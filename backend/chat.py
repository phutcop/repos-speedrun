"""
chat.py

Role 3's core chatbot logic.

Design (matches the functional spec, Function 9):
- The AI never does arithmetic itself and never invents figures.
  The summary pack (or, in v1, the database) computes; the LLM only narrates.
- Three question paths:
    1. what-if      -> pure Python arithmetic on summary_pack, then LLM phrases it
    2. answerable    -> relevant slice of summary_pack handed to LLM, LLM answers
                        strictly from what it's given
    3. unanswerable  -> graceful refusal, no LLM call needed
- v0 only (per spec): everything is answered from the precomputed summary
  pack, no live DB queries yet. v1 (query generation) is a later swap-in
  behind the same answer_question() function signature.
"""

import json
import os
import re
from pathlib import Path

from groq import Groq

SUMMARY_PACK_PATH = Path(__file__).parent / "summary_pack.json"

client = Groq(api_key=os.environ["GROQ_API_KEY"])
MODEL = "llama-3.3-70b-versatile"  # swap freely; check console.groq.com/docs/models for current options


def load_summary_pack() -> dict:
    with open(SUMMARY_PACK_PATH) as f:
        return json.load(f)


# ---------------------------------------------------------------------------
# Question routing
# ---------------------------------------------------------------------------

WHATIF_PATTERNS = [
    r"\bwhat if\b",
    r"\bif we (cut|reduce|increase|raise|lower)\b",
    r"\bhow much would.*(save|free up|cost)\b",
]


def classify_question(question: str) -> str:
    q = question.lower()
    if any(re.search(p, q) for p in WHATIF_PATTERNS):
        return "whatif"
    return "general"


# ---------------------------------------------------------------------------
# Path 1: general questions answered from the summary pack
# ---------------------------------------------------------------------------

SYSTEM_PROMPT_GENERAL = """You are a financial analyst assistant for a small startup.

You will be given a JSON "summary pack" containing precomputed totals,
budget-vs-actual figures, and top vendors for the company.

Rules you MUST follow:
- Only use numbers that appear in the summary pack. Never invent, estimate,
  or calculate a number that isn't already there.
- If the summary pack doesn't contain what's needed to answer, say so
  plainly and suggest what data or question would work instead. Do not guess.
- State facts and the questions they raise. Do not give strategic advice
  or conclusions the data doesn't directly support (e.g. don't say
  "you should fire someone" — you can say "Engineering is your largest
  cost center at $X, more than Sales and Marketing combined").
- Be concise and concrete. Cite the specific number and time period.
"""


def answer_general_question(question: str, summary_pack: dict) -> dict:
    resp = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT_GENERAL},
            {
                "role": "user",
                "content": (
                    f"Summary pack:\n{json.dumps(summary_pack)}\n\n"
                    f"Question: {question}"
                ),
            },
        ],
        temperature=0.2,
    )
    return {
        "answer": resp.choices[0].message.content,
        "type": "general",
    }


# ---------------------------------------------------------------------------
# Path 2: what-if arithmetic — Python computes, LLM only phrases the result
# ---------------------------------------------------------------------------

def _find_category_or_vendor(question: str, summary_pack: dict):
    """Very simple keyword match against known categories/vendors.
    Good enough for v0; v1 can replace with embedding match like
    Role 1's categorizer."""
    q = question.lower()
    for cat in summary_pack["categories"]:
        if cat.lower().split(" &")[0] in q or cat.lower() in q:
            return "category", cat
    for v in summary_pack["top_vendors"]:
        if v["vendor"].lower() in q:
            return "vendor", v["vendor"]
    return None, None


def _find_percentage(question: str):
    m = re.search(r"(\d+(?:\.\d+)?)\s*%", question)
    return float(m.group(1)) if m else None


def compute_whatif(question: str, summary_pack: dict) -> dict | None:
    """Returns a structured arithmetic result, or None if we can't
    confidently parse the question — caller should fall back to refusal."""
    kind, target = _find_category_or_vendor(question, summary_pack)
    pct = _find_percentage(question)

    if kind is None or pct is None:
        return None

    if kind == "category":
        annual_total = summary_pack["category_totals"].get(target)
    else:
        annual_total = next(
            (v["total"] for v in summary_pack["top_vendors"] if v["vendor"] == target),
            None,
        )

    if annual_total is None:
        return None

    savings = round(annual_total * (pct / 100), 2)
    return {
        "target": target,
        "target_kind": kind,
        "percentage": pct,
        "annual_total": annual_total,
        "computed_savings": savings,
    }


def answer_whatif_question(question: str, summary_pack: dict) -> dict:
    result = compute_whatif(question, summary_pack)

    if result is None:
        return refuse(
            question,
            reason="I couldn't confidently match this to a specific category "
            "or vendor with a percentage in the summary pack.",
        )

    resp = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You explain a pre-computed what-if calculation to a "
                    "founder in one or two plain-language sentences. "
                    "Do not recompute or second-guess the numbers you're given — "
                    "just phrase them clearly."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Question: {question}\n"
                    f"Computed result (already correct, just phrase it): "
                    f"{json.dumps(result)}"
                ),
            },
        ],
        temperature=0.2,
    )
    return {
        "answer": resp.choices[0].message.content,
        "type": "whatif",
        "evidence": result,
    }


# ---------------------------------------------------------------------------
# Path 3: graceful refusal
# ---------------------------------------------------------------------------

def refuse(question: str, reason: str) -> dict:
    return {
        "answer": (
            f"I can't answer that from the current data. {reason} "
            "Try asking about department or category totals, budget vs. "
            "actual by month, top vendors, or a specific what-if like "
            "'what if we cut Software Subscriptions by 20%?'"
        ),
        "type": "refusal",
    }


# ---------------------------------------------------------------------------
# Entry point used by the FastAPI route
# ---------------------------------------------------------------------------

def answer_question(question: str) -> dict:
    summary_pack = load_summary_pack()
    q_type = classify_question(question)

    if q_type == "whatif":
        return answer_whatif_question(question, summary_pack)
    return answer_general_question(question, summary_pack)


if __name__ == "__main__":
    # quick manual smoke test — requires GROQ_API_KEY set
    for q in [
        "What was our biggest expense category this year?",
        "What if we cut Software Subscriptions by 20%?",
        "What will our revenue be next quarter?",
    ]:
        print("Q:", q)
        print(json.dumps(answer_question(q), indent=2))
        print()
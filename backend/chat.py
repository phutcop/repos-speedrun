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

import requests
from dotenv import load_dotenv
from groq import Groq

# Load .env here too (not just in main.py) so this module works whether
# it's imported by the FastAPI app or run/imported standalone (e.g. by
# run_eval.py). load_dotenv() is safe to call more than once.
load_dotenv()

# Role 2's live aggregate endpoints.
INTEL_BASE_URL = os.environ.get("INTEL_BASE_URL", "http://localhost:8000/api/intel")
SUMMARY_API_URL = os.environ.get("SUMMARY_API_URL", f"{INTEL_BASE_URL}/summary")

client = Groq(api_key=os.environ["GROQ_API_KEY"])
MODEL = "openai/gpt-oss-120b"  # swap freely; check console.groq.com/docs/models for current options

MONTH_NAME_TO_NUM = {
    "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6,
    "jul": 7, "aug": 8, "sep": 9, "sept": 9, "oct": 10, "nov": 11, "dec": 12,
}


def load_summary_pack() -> dict:
    """Pulls the real, live summary pack from Role 2's endpoint instead
    of a static local file. Falls back to the static file only if the
    live endpoint is unreachable, so local dev never fully breaks."""
    try:
        resp = requests.get(SUMMARY_API_URL, timeout=5)
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException as e:
        print(f"[warn] couldn't reach {SUMMARY_API_URL} ({e}), falling back to local summary_pack.json")
        with open("summary_pack.json") as f:
            return json.load(f)


def _safe_get(url: str):
    """Best-effort GET — returns None on any failure instead of raising,
    since these are optional context enrichments, not the core answer path."""
    try:
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException:
        return None


def extract_month_from_question(question: str) -> str | None:
    """Finds an explicit month reference like 'February 2025' or '2025-02'
    in the question and returns it as 'YYYY-MM', or None if none found."""
    m = re.search(r"\b(20\d{2})-(0[1-9]|1[0-2])\b", question)
    if m:
        return f"{m.group(1)}-{m.group(2)}"

    m2 = re.search(
        r"\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|"
        r"jul(?:y)?|aug(?:ust)?|sept?(?:ember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)"
        r"\.?\s+(20\d{2})\b",
        question,
        re.IGNORECASE,
    )
    if m2:
        key = m2.group(1)[:4].lower().rstrip(".")
        key = key[:3] if key not in MONTH_NAME_TO_NUM else key
        num = MONTH_NAME_TO_NUM.get(key[:3])
        if num:
            return f"{m2.group(2)}-{num:02d}"
    return None


def load_context(question: str, base_summary: dict) -> dict:
    """Builds the full context handed to the LLM: the base summary pack,
    PLUS true annual vendor totals (the summary pack's own 'top_vendors'
    is only for its current month — see /api/intel/vendors for the
    all-time version), PLUS a specific past month's budget-vs-actual if
    the question names one (the summary pack only covers its current
    month by default)."""
    context = dict(base_summary)

    annual_vendors = _safe_get(f"{INTEL_BASE_URL}/vendors")
    if annual_vendors:
        context["top_vendors_annual"] = annual_vendors.get("data", annual_vendors)

    month = extract_month_from_question(question)
    if month:
        budget_month = _safe_get(f"{INTEL_BASE_URL}/budget/{month}")
        if budget_month:
            context[f"budget_vs_actual_{month}"] = budget_month.get("data", budget_month)

    return context


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

You will be given a JSON context object built from several live endpoints.
Some fields cover the WHOLE YEAR, others cover only ONE MONTH — mixing
these up is the most common mistake, so read this key guide carefully:

WHOLE-YEAR fields (use these for "this year", "total", "overall", "annual"):
  - department_totals, category_totals: full-year totals
  - monthly_trend: full year, keyed by month
  - top_vendors_annual (if present): TRUE full-year vendor totals —
    always prefer this over "top_vendors" for any annual vendor question

ONE-MONTH-ONLY fields (these describe ONLY the "month" field's value,
usually the most recent month — do NOT use them to answer "this year"
questions):
  - by_department, by_category, budget_vs_actual, top_vendors

SPECIFIC-PAST-MONTH fields (present only if the question named a month):
  - budget_vs_actual_YYYY-MM: budget vs actual for that exact month,
    across all departments — use this to answer "was X over budget in
    <that month>" questions instead of escalating anywhere else

Rules you MUST follow:
- Only use numbers that appear in the context. Never invent, estimate,
  or calculate a number that isn't already there.
- Match the question's time scope to the right field using the guide
  above. If asked "this year" or "total", never substitute a
  single-month figure.
- State facts and the questions they raise. Do not give strategic advice
  or conclusions the data doesn't directly support (e.g. don't say
  "you should fire someone" — you can say "Engineering is your largest
  cost center at $X, more than Sales and Marketing combined").
- Be concise and concrete. Cite the specific number and time period.
- If, and only if, the context genuinely does not contain what's
  needed to answer (e.g. a specific expense line item, or a specific
  vendor/department/month combination not present anywhere above),
  respond with EXACTLY the single token: NEED_QUERY
  Do not add any other text when you do this.
"""


def answer_general_question(question: str, context: dict) -> dict:
    resp = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT_GENERAL},
            {
                "role": "user",
                "content": (
                    f"Context:\n{json.dumps(context)}\n\n"
                    f"Question: {question}"
                ),
            },
        ],
        temperature=0.2,
    )
    answer = resp.choices[0].message.content.strip()
    return {
        "answer": answer,
        "type": "general",
        "needs_query": answer == "NEED_QUERY",
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

def answer_question(question: str, company_id: int = 1) -> dict:
    """company_id defaults to 1 for the single-company demo; wire this to
    the logged-in company's real id once auth (Function 1) is in place."""
    summary_pack = load_summary_pack()
    q_type = classify_question(question)

    if q_type == "whatif":
        return answer_whatif_question(question, summary_pack)

    context = load_context(question, summary_pack)
    result = answer_general_question(question, context)

    # v0 -> v1 handoff: only escalate to a real database query when even
    # the enriched context (summary pack + annual vendors + any named
    # month's budget) genuinely couldn't answer it. This keeps things
    # fast and safe for the common case and only pays v1's cost — and
    # its DATABASE_URL dependency — when truly needed.
    if result.get("needs_query"):
        from query_engine import answer_via_query_engine  # imported lazily so v0 works even without DATABASE_URL/psycopg2 configured
        return answer_via_query_engine(question, company_id)

    return result


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
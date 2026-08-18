"""
narrate.py — turns evidence JSON into plain-language warnings.

Grounding rule: prompt contains ONLY the evidence dict.
Falls back to templates when GROQ_API_KEY is not set (dev mode).
"""

import json
import os

from groq import Groq

MODEL = "llama-3.3-70b-versatile"

SYSTEM = (
    "You write short financial warnings for a small business owner. "
    "You are given evidence as JSON. Use ONLY the numbers in the evidence — "
    "never invent figures, causes, or advice requiring outside knowledge. "
    "Write 2-3 sentences: what happened (with the key numbers), why it stands out, "
    "and end with one concrete thing worth checking. "
    "Plain language, no jargon, no markdown."
)


def _template_fallback(finding):
    e = finding["evidence"]
    if finding["type"] == "spending_anomaly":
        return (
            f"{finding['category']} spending hit {e['current']:,.2f} in {finding['month']}, "
            f"well above its typical {e['baseline_mean']:,.2f} "
            f"(about {e['excess_over_typical']:,.2f} more than usual). "
            f"Worth checking what drove the increase."
        )
    if finding["type"] == "budget_breach_streak":
        return (
            f"{finding['department']} has been over budget {e['streak_length']} months in a row, "
            f"by {e['total_over_budget']:,.2f} in total. "
            f"Worth reviewing whether the budget is unrealistic or the spending needs reining in."
        )
    return json.dumps(finding)


def narrate(finding):
    key = os.environ.get("GROQ_API_KEY")
    if not key:
        return _template_fallback(finding)
    try:
        client = Groq(api_key=key)
        resp = client.chat.completions.create(
            model=MODEL,
            temperature=0.3,
            max_tokens=160,
            messages=[
                {"role": "system", "content": SYSTEM},
                {"role": "user", "content": "Evidence JSON:\n" + json.dumps(finding)},
            ],
        )
        return resp.choices[0].message.content.strip()
    except Exception:
        return _template_fallback(finding)


def narrate_all(findings):
    return [{**f, "narrative": narrate(f)} for f in findings]

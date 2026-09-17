"""
build_summary_pack.py

Reads the raw expenses/budget CSVs and produces summary_pack.json —
the precomputed numbers Role 3's chatbot (v0) prompts over instead of
touching the database directly.

This is a STAND-IN for Role 2's real aggregate endpoints. Once those
exist, this script's output shape becomes the CONTRACTS.md spec for
"GET /summary" and you swap this for an HTTP call.

Usage: python3 build_summary_pack.py
Produces: summary_pack.json
"""

import csv
import datetime
import json
import os
from collections import defaultdict

_HERE = os.path.dirname(os.path.abspath(__file__))
_DATA2 = os.path.join(_HERE, "..", "data2")


def parse_month_name(s: str) -> str:
    """'January 2025' -> '2025-01'"""
    return datetime.datetime.strptime(s, "%B %Y").strftime("%Y-%m")


def load_expenses(path=None):
    if path is None:
        path = os.path.join(_DATA2, "expenses.csv")
    with open(path) as f:
        return list(csv.DictReader(f))


def load_budget(path=None):
    if path is None:
        path = os.path.join(_DATA2, "budget.csv")
    with open(path) as f:
        return list(csv.DictReader(f))


def build_summary_pack():
    expenses = load_expenses()
    budgets = load_budget()

    months = sorted(set(row["date"][:7] for row in expenses))

    # ---- totals by department / month ----
    dept_month_totals = defaultdict(float)
    cat_month_totals = defaultdict(float)
    monthly_trend = defaultdict(float)
    vendor_totals = defaultdict(float)
    dept_totals = defaultdict(float)
    cat_totals = defaultdict(float)

    for row in expenses:
        amt = float(row["amount"])
        month = row["date"][:7]
        dept_month_totals[(row["department"], month)] += amt
        cat_month_totals[(row["category"], month)] += amt
        monthly_trend[month] += amt
        vendor_totals[row["vendor"]] += amt
        dept_totals[row["department"]] += amt
        cat_totals[row["category"]] += amt

    # ---- budget totals by department / month ----
    budget_dept_month = defaultdict(float)
    for row in budgets:
        month = parse_month_name(row["month"])
        budget_dept_month[(row["department"], month)] += float(
            row["budgeted_amount"]
        )

    departments = sorted(set(d for d, m in dept_month_totals.keys()))
    categories = sorted(set(c for c, m in cat_month_totals.keys()))

    # ---- budget vs actual ----
    budget_vs_actual = {}
    for dept in departments:
        budget_vs_actual[dept] = {}
        for month in months:
            actual = round(dept_month_totals.get((dept, month), 0.0), 2)
            budget = round(budget_dept_month.get((dept, month), 0.0), 2)
            budget_vs_actual[dept][month] = {
                "actual": actual,
                "budget": budget,
                "variance": round(actual - budget, 2),
                "over_budget": actual > budget,
            }

    # ---- top vendors (overall) ----
    top_vendors = sorted(
        ({"vendor": v, "total": round(t, 2)} for v, t in vendor_totals.items()),
        key=lambda x: -x["total"],
    )[:10]

    summary_pack = {
        "months": months,
        "departments": departments,
        "categories": categories,
        "monthly_trend": {m: round(monthly_trend[m], 2) for m in months},
        "department_totals": {
            d: round(t, 2) for d, t in sorted(dept_totals.items(), key=lambda x: -x[1])
        },
        "category_totals": {
            c: round(t, 2) for c, t in sorted(cat_totals.items(), key=lambda x: -x[1])
        },
        "department_by_month": {
            d: {m: round(dept_month_totals.get((d, m), 0.0), 2) for m in months}
            for d in departments
        },
        "category_by_month": {
            c: {m: round(cat_month_totals.get((c, m), 0.0), 2) for m in months}
            for c in categories
        },
        "budget_vs_actual": budget_vs_actual,
        "top_vendors": top_vendors,
    }
    return summary_pack


if __name__ == "__main__":
    pack = build_summary_pack()
    out_path = os.path.join(_HERE, "summary_pack.json")
    with open(out_path, "w") as f:
        json.dump(pack, f, indent=2)
    print(f"Wrote {out_path}")
    print(f"Months: {pack['months'][0]} to {pack['months'][-1]}")
    print(f"Departments: {pack['departments']}")
    print(f"Categories: {len(pack['categories'])}")
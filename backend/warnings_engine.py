"""
warnings_engine.py — Role 2 (Financial Intelligence)

Two detection rules producing evidence JSON.
Adapted to team's schema: budget column is 'budgeted_amount' (renamed to 'amount' in load).

Tune these dials against the real dataset:
  Z_THRESHOLD        how unusual before we care (higher = fewer warnings)
  MATERIALITY_FLOOR  ignore statistically-odd but financially tiny amounts
  STREAK_MONTHS      consecutive over-budget months before it's a pattern
"""

import numpy as np

Z_THRESHOLD = 2.0
MATERIALITY_FLOOR = 1000.0    # ~298 rows, 12 months — lower floor than a bigger dataset
STREAK_MONTHS = 3


def spending_anomalies(expenses, month):
    """Rule 1: category spend unusually high vs. its own history."""
    findings = []
    for category in expenses["category"].unique():
        series = expenses[expenses["category"] == category].groupby("month")["amount"].sum().sort_index()
        if month not in series.index:
            continue
        history = series[series.index < month].tail(12)
        if len(history) < 3:
            continue
        mean = float(history.mean())
        std = float(history.std(ddof=0))
        current = float(series[month])
        if std == 0:
            continue
        z = (current - mean) / std
        excess = current - mean
        if z >= Z_THRESHOLD and excess >= MATERIALITY_FLOOR:
            findings.append({
                "type": "spending_anomaly",
                "severity": "high" if z >= 3 else "medium",
                "category": category,
                "month": month,
                "evidence": {
                    "current": round(current, 2),
                    "baseline_mean": round(mean, 2),
                    "baseline_std": round(std, 2),
                    "z_score": round(float(z), 2),
                    "excess_over_typical": round(excess, 2),
                    "baseline_months": len(history),
                },
            })
    return findings


def budget_breach_streaks(expenses, budgets, upto_month):
    """Rule 2: department over budget for STREAK_MONTHS consecutive months."""
    findings = []
    months = sorted(m for m in expenses["month"].unique() if m <= upto_month)
    recent = months[-STREAK_MONTHS:]
    if len(recent) < STREAK_MONTHS:
        return findings

    actual = expenses.groupby(["month", "department"])["amount"].sum()
    planned = budgets.groupby(["month", "department"])["amount"].sum()

    for dept in expenses["department"].unique():
        overages = []
        for m in recent:
            a = float(actual.get((m, dept), 0.0))
            b = float(planned.get((m, dept), np.nan))
            if np.isnan(b) or b <= 0 or a <= b:
                overages = None
                break
            overages.append({
                "month": m,
                "budget": round(b, 2),
                "actual": round(a, 2),
                "over_by": round(a - b, 2),
            })
        if overages:
            total_over = sum(o["over_by"] for o in overages)
            findings.append({
                "type": "budget_breach_streak",
                "severity": "high" if total_over >= 3 * MATERIALITY_FLOOR else "medium",
                "department": dept,
                "months": recent,
                "evidence": {
                    "streak_length": STREAK_MONTHS,
                    "monthly_detail": overages,
                    "total_over_budget": round(total_over, 2),
                },
            })
    return findings


def derive_warnings(expenses, budgets, month):
    """Run all rules for one month. High severity first."""
    findings = spending_anomalies(expenses, month) + budget_breach_streaks(expenses, budgets, month)
    findings.sort(key=lambda f: 0 if f["severity"] == "high" else 1)
    return findings

"""
aggregates.py — Role 2 (Financial Intelligence)

Adapted to the team's actual data schema:
  expenses.csv: expense_id, date, amount, description, vendor, department, category
  budget.csv:   department, category, month ("January 2025"), budgeted_amount
"""

import os
import datetime
import pandas as pd

try:
    import psycopg2
    HAVE_PSYCOPG2 = True
except ImportError:
    HAVE_PSYCOPG2 = False


def load_expenses(path="../data2/expenses.csv"):
    db_url = os.environ.get("DATABASE_URL")
    if db_url and HAVE_PSYCOPG2:
        try:
            conn = psycopg2.connect(db_url)
            # The app expects company_id = 1 for the single-tenant demo
            query = "SELECT * FROM expenses WHERE company_id = 1;"
            df = pd.read_sql_query(query, conn, parse_dates=["date"])
            conn.close()
        except Exception as e:
            print(f"Error loading expenses from DB: {e}. Falling back to CSV.")
            df = pd.read_csv(path, parse_dates=["date"])
    else:
        df = pd.read_csv(path, parse_dates=["date"])
        
    df["month"] = df["date"].dt.to_period("M").astype(str)
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
    df = df.dropna(subset=["amount", "date"])
    return df


def _parse_month_name(s):
    """'January 2025' -> '2025-01'"""
    return datetime.datetime.strptime(s.strip(), "%B %Y").strftime("%Y-%m")


def load_budgets(path="../data2/budget.csv"):
    db_url = os.environ.get("DATABASE_URL")
    if db_url and HAVE_PSYCOPG2:
        try:
            conn = psycopg2.connect(db_url)
            query = "SELECT * FROM budgets WHERE company_id = 1;"
            df = pd.read_sql_query(query, conn)
            conn.close()
            # If reading from DB, the column is already named correctly in some cases,
            # but wait, the DB schema has 'budgeted_amount'
            if "budgeted_amount" in df.columns:
                df = df.rename(columns={"budgeted_amount": "amount"})
            # Ensure month is correctly formatted YYYY-MM
            # The DB stores it as YYYY-MM natively, but we apply _parse_month_name defensively
            df["month"] = df["month"].apply(lambda m: m if "-" in str(m) else _parse_month_name(m))
        except Exception as e:
            print(f"Error loading budgets from DB: {e}. Falling back to CSV.")
            df = pd.read_csv(path)
            df["month"] = df["month"].apply(_parse_month_name)
            df = df.rename(columns={"budgeted_amount": "amount"})
    else:
        df = pd.read_csv(path)
        df["month"] = df["month"].apply(_parse_month_name)
        df = df.rename(columns={"budgeted_amount": "amount"})
        
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
    return df.dropna(subset=["amount"])


# ---------- chart aggregates ----------

def department_totals(expenses, month=None):
    df = expenses if month is None else expenses[expenses["month"] == month]
    out = df.groupby("department")["amount"].sum().sort_values(ascending=False)
    return [{"department": d, "total": round(float(v), 2)} for d, v in out.items()]


def category_breakdown(expenses, month=None):
    df = expenses if month is None else expenses[expenses["month"] == month]
    out = df.groupby("category")["amount"].sum().sort_values(ascending=False)
    return [{"category": c, "total": round(float(v), 2)} for c, v in out.items()]


def monthly_trend(expenses):
    out = expenses.groupby("month")["amount"].sum().sort_index()
    return [{"month": m, "total": round(float(v), 2)} for m, v in out.items()]


def budget_vs_actual(expenses, budgets, month):
    actual = expenses[expenses["month"] == month].groupby("department")["amount"].sum()
    planned = budgets[budgets["month"] == month].groupby("department")["amount"].sum()
    rows = []
    for dept in sorted(set(actual.index) | set(planned.index)):
        a = round(float(actual.get(dept, 0.0)), 2)
        b = round(float(planned.get(dept, 0.0)), 2)
        rows.append({
            "department": dept,
            "budget": b,
            "actual": a,
            "variance": round(a - b, 2),
            "pct_used": round(a / b * 100, 1) if b else None
        })
    return rows


def top_vendors(expenses, month=None, n=10):
    df = expenses if month is None else expenses[expenses["month"] == month]
    out = df.groupby("vendor")["amount"].sum().sort_values(ascending=False).head(n)
    return [{"vendor": v, "total": round(float(t), 2)} for v, t in out.items()]


# ---------- summary pack ----------

def summary_pack(expenses, budgets, month=None):
    """Full precomputed summary. If month is None, uses the latest month."""
    months = sorted(expenses["month"].unique())
    if month is None:
        month = months[-1]
    prev = months[months.index(month) - 1] if month in months and months.index(month) > 0 else None

    month_df = expenses[expenses["month"] == month]
    total = float(month_df["amount"].sum())
    prev_total = float(expenses[expenses["month"] == prev]["amount"].sum()) if prev else None

    return {
        "month": month,
        "months": months,
        "total_spend": round(total, 2),
        "prev_month": prev,
        "prev_month_total": round(prev_total, 2) if prev_total is not None else None,
        "change_pct": round((total - prev_total) / prev_total * 100, 1) if prev_total else None,
        "by_department": department_totals(expenses, month),
        "by_category": category_breakdown(expenses, month),
        "budget_vs_actual": budget_vs_actual(expenses, budgets, month),
        "top_vendors": top_vendors(expenses, month),
        "departments": sorted(expenses["department"].unique().tolist()),
        "categories": sorted(expenses["category"].unique().tolist()),
        "department_totals": {d: round(float(v), 2) for d, v in expenses.groupby("department")["amount"].sum().sort_values(ascending=False).items()},
        "category_totals": {c: round(float(v), 2) for c, v in expenses.groupby("category")["amount"].sum().sort_values(ascending=False).items()},
        "monthly_trend": {m: round(float(v), 2) for m, v in expenses.groupby("month")["amount"].sum().sort_index().items()},
    }

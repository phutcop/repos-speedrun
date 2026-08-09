"""
intelligence.py — Role 2 (Financial Intelligence) API router

Endpoints:
  GET  /api/intel/summary              latest month summary pack
  GET  /api/intel/summary/{month}      specific month (e.g. 2025-06)
  GET  /api/intel/departments           department totals
  GET  /api/intel/categories            category breakdown
  GET  /api/intel/trend                 monthly spending trend
  GET  /api/intel/budget/{month}        budget vs actual for one month
  GET  /api/intel/vendors               top vendors
  GET  /api/intel/insights              warnings for latest month
  GET  /api/intel/insights/{month}      warnings for specific month
  GET  /api/intel/insights/all          warnings across all months

All month params use YYYY-MM format (e.g. "2025-12").
"""

from fastapi import APIRouter, Query
from aggregates import load_expenses, load_budgets, summary_pack, department_totals, category_breakdown, monthly_trend, budget_vs_actual, top_vendors
from warnings_engine import derive_warnings
from narrate import narrate_all

router = APIRouter(prefix="/api/intel", tags=["intelligence"])


def _load():
    """Load both datasets. Later: swap for read-only DB queries."""
    return load_expenses(), load_budgets()


def _latest_month(expenses):
    return sorted(expenses["month"].unique())[-1]


# ---------- summary pack (feeds the chatbot too) ----------

@router.get("/summary")
def get_summary():
    expenses, budgets = _load()
    return summary_pack(expenses, budgets)


@router.get("/summary/{month}")
def get_summary_month(month: str):
    expenses, budgets = _load()
    return summary_pack(expenses, budgets, month)


# ---------- chart aggregates ----------

@router.get("/departments")
def get_departments(month: str = None):
    expenses, _ = _load()
    return {"data": department_totals(expenses, month)}


@router.get("/categories")
def get_categories(month: str = None):
    expenses, _ = _load()
    return {"data": category_breakdown(expenses, month)}


@router.get("/trend")
def get_trend():
    expenses, _ = _load()
    return {"data": monthly_trend(expenses)}


@router.get("/budget/{month}")
def get_budget(month: str):
    expenses, budgets = _load()
    return {"data": budget_vs_actual(expenses, budgets, month)}


@router.get("/vendors")
def get_vendors(month: str = None, n: int = 10):
    expenses, _ = _load()
    return {"data": top_vendors(expenses, month, n)}


# ---------- warnings / insights ----------

@router.get("/insights")
def get_insights():
    expenses, budgets = _load()
    month = _latest_month(expenses)
    warnings = narrate_all(derive_warnings(expenses, budgets, month))
    return {"month": month, "warnings": warnings}


@router.get("/insights/all")
def get_insights_all():
    expenses, budgets = _load()
    months = sorted(expenses["month"].unique())
    all_warnings = []
    for m in months:
        for w in narrate_all(derive_warnings(expenses, budgets, m)):
            all_warnings.append(w)
    return {"warnings": all_warnings, "total": len(all_warnings)}


@router.get("/insights/{month}")
def get_insights_month(month: str):
    expenses, budgets = _load()
    warnings = narrate_all(derive_warnings(expenses, budgets, month))
    return {"month": month, "warnings": warnings}

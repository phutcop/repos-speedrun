<<<<<<< HEAD
=======
import React, { useState, useEffect } from "react";
>>>>>>> main
import SummaryCard from "../components/SummaryCard";
import UploadPanel from "../components/UploadPanel";
import ExpenseTrendChart from "../components/charts/ExpenseTrendChart";
import CategoryPieChart from "../components/charts/CategoryPieChart";
import DepartmentBarChart from "../components/charts/DepartmentBarChart";
import { DownloadIcon } from "../components/Icons";
<<<<<<< HEAD
import { summaryCards, timeVsExpense, categoryDistribution, departmentSpend } from "../data/mockData";

function DashboardPage() {
  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div>
          <span className="eyebrow">overview</span>
          <h1 className="display-title" style={{ fontSize: "2.1rem" }}>
            Your Finance Dashboard
=======

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--chart-6)"];

function DashboardPage() {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [sumRes, trendRes, deptRes, catRes] = await Promise.all([
          fetch("http://localhost:8000/api/intel/summary"),
          fetch("http://localhost:8000/api/intel/trend"),
          fetch("http://localhost:8000/api/intel/departments"),
          fetch("http://localhost:8000/api/intel/categories")
        ]);

        const summary = await sumRes.json();
        const trend = await trendRes.json();
        const dept = await deptRes.json();
        const cat = await catRes.json();

        setSummaryData({
          summary,
          trend: trend.data.map(d => ({ month: d.month, expense: d.total })),
          departments: dept.data.map(d => ({ department: d.department, spend: d.total })),
          categories: cat.data.map((d, i) => ({ 
            name: d.category, 
            value: d.total, 
            color: COLORS[i % COLORS.length] 
          }))
        });
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading || !summaryData) {
    return <div className="page" style={{ padding: "2rem" }}>Loading dashboard...</div>;
  }

  const { summary, trend, departments, categories } = summaryData;

  const dynamicSummaryCards = [
    {
      id: "card-1",
      label: "Total Monthly Spend",
      value: `$${summary.total_spend?.toLocaleString() ?? 0}`,
      delta: summary.change_pct ? `${summary.change_pct > 0 ? '+' : ''}${summary.change_pct}% vs last month` : 'N/A',
      trend: summary.change_pct > 0 ? "up" : "down",
    },
    {
      id: "card-2",
      label: "Analyzed Departments",
      value: `${summary.departments?.length ?? 0}`,
      delta: "Active cost centers",
      trend: "flag",
    },
  ];

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", paddingBottom: "1rem", borderBottom: "1px solid var(--ink)" }}>
        <div>
          <h1 className="display-title" style={{ fontSize: "3.5rem" }}>
            The Ledger.
>>>>>>> main
          </h1>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* ---------- LEFT COLUMN ---------- */}
        <div className="dashboard-col-left">
<<<<<<< HEAD
          {summaryCards.map((card) => (
            <SummaryCard key={card.id} {...card} />
          ))}

          <div className="panel-card" style={{ flex: 1 }}>
            <div className="card-label" style={{ marginBottom: "1rem" }}>
              Visualization — 01 · department spend
            </div>
            <DepartmentBarChart data={departmentSpend} />
=======
          {dynamicSummaryCards.map((card) => (
            <SummaryCard key={card.id} {...card} />
          ))}

          <div style={{ flex: 1, border: "1px solid var(--ink)", padding: "2rem", display: "flex", flexDirection: "column" }}>
            <div className="card-label" style={{ marginBottom: "1rem", textTransform: "uppercase" }}>
              Department Spend
            </div>
            <div style={{ flex: 1, minHeight: 260, overflowY: "auto", overflowX: "hidden" }}>
              <DepartmentBarChart data={departments} />
            </div>
>>>>>>> main
          </div>
        </div>

        {/* ---------- RIGHT COLUMN ---------- */}
        <div className="dashboard-col-right">
<<<<<<< HEAD
          <div className="panel-card">
            <div className="card-label" style={{ marginBottom: "0.4rem" }}>
              Time vs Expense
            </div>
            <ExpenseTrendChart data={timeVsExpense} />
          </div>

          <div className="panel-card">
            <UploadPanel />
          </div>

          <div className="panel-card">
            <div className="card-label" style={{ marginBottom: "0.4rem" }}>
              Distribution
            </div>
            <CategoryPieChart data={categoryDistribution} />
=======
          <div style={{ border: "1px solid var(--ink)", padding: "2rem" }}>
            <div className="card-label" style={{ marginBottom: "0.4rem", textTransform: "uppercase" }}>
              Time vs Expense
            </div>
            <ExpenseTrendChart data={trend} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
            <div style={{ border: "1px solid var(--ink)", padding: "1.25rem 1.5rem" }}>
              <div className="card-label" style={{ marginBottom: "1rem", textTransform: "uppercase" }}>
                Update Ledger
              </div>
              <UploadPanel />
            </div>
            
            <div style={{ 
              border: "1px solid var(--ink)", 
              padding: "1.25rem 1.5rem", 
              background: "var(--ink)", 
              color: "var(--bg-main)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", textTransform: "uppercase", opacity: 0.7, marginBottom: "0.6rem" }}>
                  AI Advisor
                </div>
                <div style={{ fontSize: "0.95rem", lineHeight: 1.5, fontFamily: "var(--font-body)" }}>
                  Your marketing spend spiked 12% in Q3. Should we run a vendor audit?
                </div>
              </div>
              <a href="/advisor" style={{ 
                color: "var(--bg-main)", 
                fontFamily: "var(--font-display)", 
                fontSize: "0.9rem", 
                textDecoration: "underline", 
                marginTop: "0.8rem",
                display: "inline-block"
              }}>
                Ask Advisor →
              </a>
            </div>
          </div>

          <div style={{ border: "1px solid var(--ink)", padding: "2rem" }}>
            <div className="card-label" style={{ marginBottom: "0.4rem", textTransform: "uppercase" }}>
              Distribution
            </div>
            <CategoryPieChart data={categories} />
>>>>>>> main
          </div>
        </div>
      </div>

      {/* ---------- FOOTER ACTION BAR ---------- */}
      <div
<<<<<<< HEAD
        className="panel-card panel-card-alt"
        style={{
          marginTop: "1.6rem",
=======
        style={{
          marginTop: "3rem",
          paddingTop: "2rem",
          borderTop: "1px solid var(--ink)",
>>>>>>> main
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div className="muted" style={{ fontSize: "0.88rem" }}>
          Data current as of your latest upload.
        </div>
        {/* TODO(team): wire up to real export (PDF/PPTX) generation */}
        <button type="button" className="btn btn-solid">
          <DownloadIcon width={16} height={16} />
          Download report / dashboard
        </button>
      </div>

      <style>{`
        .dashboard-grid {
          display: grid;
<<<<<<< HEAD
          grid-template-columns: 320px 1fr;
          gap: 1.4rem;
          align-items: stretch;
=======
          grid-template-columns: 320px minmax(0, 1fr);
          gap: 2rem;
          margin-bottom: 2rem;
        }
        .dashboard-grid > div {
          min-width: 0;
>>>>>>> main
        }
        .dashboard-col-left,
        .dashboard-col-right {
          display: flex;
          flex-direction: column;
          gap: 1.4rem;
        }
        @media (max-width: 980px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default DashboardPage;

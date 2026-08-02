import SummaryCard from "../components/SummaryCard";
import UploadPanel from "../components/UploadPanel";
import ExpenseTrendChart from "../components/charts/ExpenseTrendChart";
import CategoryPieChart from "../components/charts/CategoryPieChart";
import DepartmentBarChart from "../components/charts/DepartmentBarChart";
import { DownloadIcon } from "../components/Icons";
import { summaryCards, timeVsExpense, categoryDistribution, departmentSpend } from "../data/mockData";

function DashboardPage() {
  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div>
          <span className="eyebrow">overview</span>
          <h1 className="display-title" style={{ fontSize: "2.1rem" }}>
            Your Finance Dashboard
          </h1>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* ---------- LEFT COLUMN ---------- */}
        <div className="dashboard-col-left">
          {summaryCards.map((card) => (
            <SummaryCard key={card.id} {...card} />
          ))}

          <div className="panel-card" style={{ flex: 1 }}>
            <div className="card-label" style={{ marginBottom: "1rem" }}>
              Visualization — 01 · department spend
            </div>
            <DepartmentBarChart data={departmentSpend} />
          </div>
        </div>

        {/* ---------- RIGHT COLUMN ---------- */}
        <div className="dashboard-col-right">
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
          </div>
        </div>
      </div>

      {/* ---------- FOOTER ACTION BAR ---------- */}
      <div
        className="panel-card panel-card-alt"
        style={{
          marginTop: "1.6rem",
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
          grid-template-columns: 320px 1fr;
          gap: 1.4rem;
          align-items: stretch;
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

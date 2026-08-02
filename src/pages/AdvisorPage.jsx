import { useState } from "react";
import { DownloadIcon, ArrowUpRight } from "../components/Icons";
import { balanceSheetSummary, reinvestmentSuggestion } from "../data/mockData";

function AdvisorPage() {
  const [operationText, setOperationText] = useState("");

  const handleGetInsights = () => {
    // TODO(team): send `operationText` + computed financial facts to the
    // chatbot/LLM endpoint and render the response below.
    console.log("Get personalized insights for:", operationText);
  };

  return (
    <div className="page">
      <span className="eyebrow">finance advisor</span>
      <h1 className="display-title" style={{ fontSize: "2.1rem", marginBottom: "2rem" }}>
        Where to cut, and where to reinvest
      </h1>

      {/* ---------- ASSETS / LIABILITIES ---------- */}
      <div className="advisor-top-grid" style={{ marginBottom: "1.4rem" }}>
        <div className="panel-card">
          <div className="card-label">Assets</div>
          {balanceSheetSummary.assets.map((row) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0.55rem 0",
                borderBottom: "1px solid var(--border-soft)",
                fontSize: "0.9rem",
              }}
            >
              <span className="muted">{row.label}</span>
              <span style={{ fontWeight: 600 }}>{row.value}</span>
            </div>
          ))}
        </div>

        <div className="panel-card">
          <div className="card-label">Liabilities</div>
          {balanceSheetSummary.liabilities.map((row) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0.55rem 0",
                borderBottom: "1px solid var(--border-soft)",
                fontSize: "0.9rem",
              }}
            >
              <span className="muted">{row.label}</span>
              <span style={{ fontWeight: 600 }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- COST CUTTING / REINVEST ---------- */}
      <div className="panel-card" style={{ marginBottom: "1.4rem" }}>
        <div className="card-label" style={{ marginBottom: "1.1rem" }}>
          Cost cutting → reinvestment
        </div>

        <div className="reinvest-row">
          <div className="reinvest-box">
            <div className="muted" style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Cut from
            </div>
            <div style={{ fontWeight: 600, margin: "0.3rem 0" }}>{reinvestmentSuggestion.from.label}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.95rem" }}>
              {reinvestmentSuggestion.from.amount}
            </div>
            <div className="muted" style={{ fontSize: "0.78rem", marginTop: "0.4rem" }}>
              {reinvestmentSuggestion.from.note}
            </div>
          </div>

          <div className="reinvest-arrow">
            <ArrowUpRight width={22} height={22} />
          </div>

          <div className="reinvest-box">
            <div className="muted" style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Reinvest into
            </div>
            <div style={{ fontWeight: 600, margin: "0.3rem 0" }}>{reinvestmentSuggestion.to.label}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.95rem" }}>
              {reinvestmentSuggestion.to.amount}
            </div>
            <div className="muted" style={{ fontSize: "0.78rem", marginTop: "0.4rem" }}>
              {reinvestmentSuggestion.to.note}
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "1.1rem",
            paddingTop: "1rem",
            borderTop: "1px solid var(--border-soft)",
            fontSize: "0.88rem",
            fontWeight: 600,
            color: "var(--success)",
          }}
        >
          {reinvestmentSuggestion.impact}
        </div>
      </div>

      {/* ---------- EXPLAIN YOUR OPERATION ---------- */}
      <div className="panel-card">
        <div className="card-label" style={{ marginBottom: "0.9rem" }}>
          Explain your operation → get personalized insights
        </div>
        <textarea
          value={operationText}
          onChange={(e) => setOperationText(e.target.value)}
          placeholder="e.g. We're an 18-person SaaS company. Engineering and Customer Success drive most of our revenue, while Marketing and Ops are mostly overhead right now..."
          rows={4}
          style={{
            width: "100%",
            padding: "0.9rem 1rem",
            border: "1px solid var(--border-soft)",
            borderRadius: "var(--radius-sm)",
            background: "var(--bg-card-alt)",
            color: "var(--text-main)",
            fontFamily: "inherit",
            fontSize: "0.92rem",
            resize: "vertical",
            marginBottom: "1rem",
          }}
        />
        {/* TODO(team): call the insight/chatbot endpoint with operationText */}
        <button type="button" className="btn btn-solid" onClick={handleGetInsights}>
          Get personalized insights
        </button>
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
          Includes dashboard, insight cards, and this advisor summary.
        </div>
        {/* TODO(team): wire up to real export (PDF/PPTX) generation */}
        <button type="button" className="btn btn-solid">
          <DownloadIcon width={16} height={16} />
          Download report / dashboard
        </button>
      </div>

      <style>{`
        .advisor-top-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.4rem;
        }
        .reinvest-row {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 1.2rem;
        }
        .reinvest-box {
          background: var(--bg-card-alt);
          border: 1px solid var(--border-soft);
          border-radius: var(--radius-sm);
          padding: 1rem 1.2rem;
        }
        .reinvest-arrow {
          display: flex;
          justify-content: center;
          opacity: 0.6;
        }
        @media (max-width: 860px) {
          .advisor-top-grid { grid-template-columns: 1fr; }
          .reinvest-row { grid-template-columns: 1fr; }
          .reinvest-arrow { transform: rotate(90deg); }
        }
      `}</style>
    </div>
  );
}

export default AdvisorPage;

<<<<<<< HEAD
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
=======
import { useState, useEffect } from "react";
import { DownloadIcon, ArrowUpRight } from "../components/Icons";

function AdvisorPage() {
  const [operationText, setOperationText] = useState("");
  const [chatResponse, setChatResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/intel/insights")
      .then(res => res.json())
      .then(data => setInsights(data.warnings))
      .catch(err => console.error("Failed to load insights:", err));
  }, []);

  const handleGetInsights = async () => {
    if (!operationText.trim()) return;
    setIsLoading(true);
    setChatResponse(null);
    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: operationText })
      });
      const data = await res.json();
      setChatResponse(data);
    } catch (err) {
      console.error("Chatbot error:", err);
      setChatResponse({ answer: "Sorry, I couldn't connect to the AI advisor right now." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page" style={{ paddingTop: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", paddingBottom: "1rem", borderBottom: "1px solid var(--ink)" }}>
        <div>
          <h1 className="display-title" style={{ fontSize: "3.5rem" }}>
            The Oracle.
          </h1>
        </div>
      </div>

      {/* ---------- AI INSIGHTS / WARNINGS ---------- */}
      <div className="advisor-top-grid" style={{ marginBottom: "1.4rem", display: "flex", flexDirection: "column" }}>
        {insights ? insights.map((warning, idx) => (
          <div key={idx} className="panel-card" style={{ borderLeft: warning.severity === "high" ? "4px solid #ff4d4f" : "4px solid #faad14" }}>
            <div className="card-label" style={{ marginBottom: "0.5rem" }}>
              {warning.type.replace(/_/g, ' ').toUpperCase()} • {warning.department || warning.category}
            </div>
            <div style={{ fontSize: "0.95rem", lineHeight: 1.5, color: "var(--ink)", marginBottom: "0.8rem" }}>
              {warning.narrative}
            </div>
            <div className="muted" style={{ fontSize: "0.85rem", display: "flex", gap: "1rem" }}>
              {warning.evidence.excess_over_typical && (
                <span>Excess: ${warning.evidence.excess_over_typical.toLocaleString()}</span>
              )}
              {warning.evidence.streak_length && (
                <span>Streak: {warning.evidence.streak_length} months</span>
              )}
            </div>
          </div>
        )) : (
          <div className="muted">Loading AI insights...</div>
        )}
>>>>>>> main
      </div>

      {/* ---------- EXPLAIN YOUR OPERATION ---------- */}
      <div className="panel-card">
        <div className="card-label" style={{ marginBottom: "0.9rem" }}>
          Explain your operation → get personalized insights
        </div>
        <textarea
          value={operationText}
          onChange={(e) => setOperationText(e.target.value)}
<<<<<<< HEAD
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
=======
          placeholder="e.g. We're an 18-person creative studio. Production and Software drive revenue..."
          rows={4}
          style={{
            width: "100%",
            padding: "1rem",
            border: "1px solid var(--ink)",
            borderRadius: "0",
            background: "transparent",
            color: "var(--ink)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.95rem",
>>>>>>> main
            resize: "vertical",
            marginBottom: "1rem",
          }}
        />
<<<<<<< HEAD
        {/* TODO(team): call the insight/chatbot endpoint with operationText */}
        <button type="button" className="btn btn-solid" onClick={handleGetInsights}>
          Get personalized insights
        </button>
=======
        <button type="button" className="btn btn-solid" onClick={handleGetInsights} disabled={isLoading}>
          {isLoading ? "Thinking..." : "Extract insights"}
        </button>

        {chatResponse && (
          <div style={{
            marginTop: "1.5rem",
            padding: "1rem 1.2rem",
            background: "var(--bg-card)",
            border: "1px solid var(--border-soft)",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.95rem",
            lineHeight: 1.6,
            color: "var(--ink)",
            whiteSpace: "pre-wrap"
          }}>
            {chatResponse.answer}
          </div>
        )}
>>>>>>> main
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
<<<<<<< HEAD
          Includes dashboard, insight cards, and this advisor summary.
=======
          [ Intelligence gathered from recent ledgers ]
>>>>>>> main
        </div>
        {/* TODO(team): wire up to real export (PDF/PPTX) generation */}
        <button type="button" className="btn btn-solid">
          <DownloadIcon width={16} height={16} />
<<<<<<< HEAD
          Download report / dashboard
=======
          Export Manifesto
>>>>>>> main
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

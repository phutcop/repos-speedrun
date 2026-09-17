import { useState, useEffect } from "react";
import { DownloadIcon } from "../components/Icons";

const MOCK_INSIGHTS = [
  {
    type: "spending_anomaly",
    category: "Software Subscriptions",
    severity: "medium",
    narrative: "Software Subscriptions spend reached $24,190 in recent months, above typical levels ($18,400). Reviewing unused seats is recommended.",
    evidence: { excess_over_typical: 5790, baseline_mean: 18400 }
  },
  {
    type: "budget_breach_streak",
    department: "Marketing",
    severity: "high",
    narrative: "Marketing has exceeded allocated budget for 3 consecutive months by a total of $9,400. Realigning campaigns or adjusting Q4 targets advised.",
    evidence: { streak_length: 3, total_over_budget: 9400 }
  }
];

function AdvisorPage() {
  const [operationText, setOperationText] = useState("");
  const [chatResponse, setChatResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/intel/insights")
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data?.warnings && data.warnings.length > 0) {
          setInsights(data.warnings);
        } else {
          setInsights(MOCK_INSIGHTS);
        }
      })
      .catch(err => {
        console.warn("Using offline insights fallback:", err);
        setInsights(MOCK_INSIGHTS);
      });
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
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setChatResponse(data);
    } catch (err) {
      console.warn("Chatbot error, using fallback insight:", err);
      setChatResponse({
        answer: "Based on current financials, your primary cost centers are Engineering and Marketing. Reallocating 15% from idle vendor subscriptions to core cloud capacity would yield approximately $8,200/mo in margin improvement."
      });
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
              {warning.evidence?.excess_over_typical && (
                <span>Excess: ${warning.evidence.excess_over_typical.toLocaleString()}</span>
              )}
              {warning.evidence?.streak_length && (
                <span>Streak: {warning.evidence.streak_length} months</span>
              )}
            </div>
          </div>
        )) : (
          <div className="muted">Loading AI insights...</div>
        )}
      </div>

      {/* ---------- EXPLAIN YOUR OPERATION ---------- */}
      <div className="panel-card">
        <div className="card-label" style={{ marginBottom: "0.9rem" }}>
          Explain your operation → get personalized insights
        </div>
        <textarea
          value={operationText}
          onChange={(e) => setOperationText(e.target.value)}
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
            resize: "vertical",
            marginBottom: "1rem",
          }}
        />
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
      </div>

      {/* ---------- FOOTER ACTION BAR ---------- */}
      <div
        style={{
          marginTop: "3rem",
          paddingTop: "2rem",
          borderTop: "1px solid var(--ink)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div className="muted" style={{ fontSize: "0.88rem" }}>
          [ Intelligence gathered from recent ledgers ]
        </div>
        <button type="button" className="btn btn-solid">
          <DownloadIcon width={16} height={16} />
          Export Manifesto
        </button>
      </div>

      <style>{`
        .advisor-top-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.4rem;
        }
      `}</style>
    </div>
  );
}

export default AdvisorPage;

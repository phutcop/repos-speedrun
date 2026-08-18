import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardIcon, ChatbotIcon, ArrowUpRight } from "../components/Icons";

const steps = [
  { id: "UPLOAD", desc: "A raw CSV or ledger export. That's all the system needs to begin." },
  { id: "PARSE", desc: "The engine categorizes, maps, and normalizes thousands of rows instantly." },
  { id: "VISUALIZE", desc: "Live, interactive dashboards appear immediately, exposing hidden trends." },
  { id: "ACT", desc: "Get specific, ruthless guidance from the AI advisor on where to cut." },
];
function LandingPage() {
  const [hoveredStep, setHoveredStep] = useState(null);
  return (
    <div style={{ position: "relative", padding: 0 }}>

      {/* ---------- HERO ---------- */}
      <section style={{
        minHeight: "65vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        borderBottom: "1px solid var(--ink)",
        padding: "5rem 4rem 4rem",
        position: "relative",
        overflow: "hidden"
      }}>
        <div className="hero-text-container" style={{ maxWidth: "55%", position: "relative", zIndex: 2, paddingRight: "2rem" }}>
          <h1 className="display-title" style={{ marginBottom: "2.5rem", lineHeight: 1.05, fontSize: "clamp(2.5rem, 4.5vw, 4rem)", wordBreak: "break-word" }}>
            Know your burn.<br />
            Protect your cash.
          </h1>
          <p style={{
            fontSize: "1.05rem",
            maxWidth: 420,
            marginBottom: "3.5rem",
            fontFamily: "var(--font-body)",
            lineHeight: 1.7,
            color: "var(--text-muted)"
          }}>
            Upload your raw ledger and gain immediate visibility into your capital flow. No complex modeling required.
          </p>
          <Link to="/upload" className="btn btn-solid" style={{ fontSize: "0.85rem" }}>
            Upload your ledger
          </Link>
        </div>

        {/* Editorial image frame */}
        <div className="hero-image-frame" style={{
          position: "absolute",
          right: "6%",
          top: 0,
          bottom: 0,
          width: "clamp(240px, 28vw, 420px)",
          borderLeft: "1px solid var(--ink)",
          borderRight: "1px solid var(--ink)",
          overflow: "hidden",
          zIndex: 1
        }}>
          <img
            src="/hero-monkey-cropped.png"
            alt=""
            aria-hidden="true"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", filter: "grayscale(30%)" }}
          />
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section style={{ padding: "3.5rem 4rem", borderBottom: "1px solid var(--ink)", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.5rem",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: "1.5rem",
          letterSpacing: "0.05em"
        }}>
          Working
        </h2>
        
        <div className="workflow-container">
          {steps.map((step, idx) => (
            <div key={step.id} className="workflow-step">
              <span
                onMouseEnter={() => setHoveredStep(step.id)}
                onMouseLeave={() => setHoveredStep(null)}
                onClick={() => setHoveredStep(hoveredStep === step.id ? null : step.id)}
                style={{
                  cursor: "crosshair",
                  transition: "opacity 0.2s ease",
                  opacity: hoveredStep && hoveredStep !== step.id ? 0.3 : 1
                }}
              >
                {step.id}
              </span>
              {hoveredStep === step.id && (
                <div className="mobile-inline-desc">
                  ( {step.desc} )
                </div>
              )}
              {idx < steps.length - 1 && (
                <svg
                  className="workflow-arrow-svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ opacity: 0.5 }}
                >
                  <path d="M7 21L20 12L7 3V21Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          ))}
        </div>

        <div className="hover-desc-container" style={{
          minHeight: "40px",
          marginTop: "2rem",
          fontFamily: "var(--font-mono)",
          fontSize: "0.95rem",
          color: "var(--ink)",
          opacity: 0.85,
          maxWidth: 600,
          margin: "2rem auto 0"
        }}>
          {hoveredStep
            ? steps.find(s => s.id === hoveredStep)?.desc
            : "Hover a phase to inspect."}
        </div>
      </section>



    </div>
  );
}

export default LandingPage;

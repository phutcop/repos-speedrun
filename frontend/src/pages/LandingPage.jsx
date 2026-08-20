<<<<<<< HEAD
=======
import { useState } from "react";
>>>>>>> main
import { Link } from "react-router-dom";
import { DashboardIcon, ChatbotIcon, ArrowUpRight } from "../components/Icons";

const steps = [
<<<<<<< HEAD
  { label: "Upload", detail: "Bring in your balance sheet or expense export" },
  { label: "Analyze", detail: "We study spending patterns against your own history" },
  { label: "Visualize", detail: "Clean dashboards, built the moment you upload" },
  { label: "Decide", detail: "Personalized cost-cut and reinvestment guidance" },
];

function LandingPage() {
  return (
    <div className="page">
      {/* ---------- HERO ---------- */}
      <section style={{ paddingTop: "2rem", paddingBottom: "4.5rem", maxWidth: 760 }}>
        <span className="eyebrow">financial clarity, on autopilot</span>
        <h1 className="display-title" style={{ fontSize: "clamp(2.4rem, 4.6vw, 3.6rem)", marginBottom: "1.4rem" }}>
          We study your balance sheet.
          <br />
          You get to decide what to do with it.
        </h1>
        <p className="muted" style={{ fontSize: "1.05rem", maxWidth: 560, marginBottom: "2.2rem" }}>
          Upload your financials once a month. We turn them into dashboards,
          plain-language warnings, and personalized suggestions — like where
          you're overspending, and where that freed-up capital could actually
          grow the business.
        </p>
        <Link to="/upload" className="btn btn-solid">
          Get started <ArrowUpRight width={16} height={16} />
        </Link>
      </section>

      {/* ---------- SERVICES ---------- */}
      <section style={{ marginBottom: "4.5rem" }}>
        <span className="eyebrow">what we do</span>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.4rem",
          }}
          className="services-grid"
        >
          <div className="panel-card">
            <DashboardIcon width={26} height={26} />
            <h3 className="section-title" style={{ marginTop: "1.1rem", fontSize: "1.25rem" }}>
              Service — 01
              <br />
              Smart dashboards
            </h3>
            <p className="muted" style={{ fontSize: "0.92rem" }}>
              Department spend, category breakdowns, budget vs. actual, and
              trend lines — generated automatically from whatever you upload.
              No spreadsheet wrangling required.
            </p>
          </div>

          <div className="panel-card">
            <ChatbotIcon width={26} height={26} />
            <h3 className="section-title" style={{ marginTop: "1.1rem", fontSize: "1.25rem" }}>
              Service — 02
              <br />
              Personalized insights
            </h3>
            <p className="muted" style={{ fontSize: "0.92rem" }}>
              Tell us how your business runs, and we translate your numbers
              into specific moves: what to cut, and which part of the
              business that capital would help most.
            </p>
          </div>
=======
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
>>>>>>> main
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
<<<<<<< HEAD
      <section style={{ marginBottom: "3.5rem" }}>
        <span className="eyebrow">working</span>
        <div className="panel-card" style={{ padding: "2rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1.6rem",
            }}
            className="steps-grid"
          >
            {steps.map((step, i) => (
              <div key={step.label}>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    marginBottom: "0.5rem",
                  }}
                >
                  0{i + 1}
                </div>
                <div style={{ fontWeight: 600, marginBottom: "0.3rem" }}>{step.label}</div>
                <div className="muted" style={{ fontSize: "0.85rem" }}>
                  {step.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section style={{ textAlign: "center", padding: "2rem 0" }}>
        <Link to="/upload" className="btn btn-solid" style={{ padding: "1rem 2.4rem", fontSize: "0.95rem" }}>
          Explore / Get started
        </Link>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .services-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
=======
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



>>>>>>> main
    </div>
  );
}

export default LandingPage;

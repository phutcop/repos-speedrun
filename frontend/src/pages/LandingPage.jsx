import { Link } from "react-router-dom";
import { DashboardIcon, ChatbotIcon, ArrowUpRight } from "../components/Icons";

const steps = [
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
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
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
    </div>
  );
}

export default LandingPage;

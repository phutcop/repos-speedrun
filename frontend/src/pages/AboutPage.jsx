<<<<<<< HEAD
function AboutPage() {
  return (
    <div className="page page-narrow">
      <span className="eyebrow">about us</span>
      <h1 className="display-title" style={{ fontSize: "clamp(2rem, 3.6vw, 2.8rem)", marginBottom: "1.4rem" }}>
        Built for founders who'd rather build than budget.
      </h1>
      <p className="muted" style={{ fontSize: "1rem", marginBottom: "1.4rem", maxWidth: 640 }}>
        We're a small team building the financial co-pilot we wished existed —
        one that reads your numbers so you don't have to, and tells you what
        they actually mean for your next decision.
      </p>
      <p className="muted" style={{ fontSize: "1rem", maxWidth: 640 }}>
        Placeholder copy — team to replace with real founder bios, mission
        statement, and any press or backing worth mentioning.
      </p>
    </div>
=======
import { Link } from "react-router-dom";

function AboutPage() {
  return (
    <>
      <style>{`
        .about-header {
          padding: 5rem 4rem 4rem;
          border-bottom: 1px solid var(--ink);
        }
        .about-grid {
          display: flex;
          flex-direction: row;
        }
        .about-col {
          flex: 1;
          padding: 4rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .about-col:first-child {
          border-right: 1px solid var(--ink);
        }
        @media (max-width: 860px) {
          .about-header {
            padding: 3rem 1.5rem 2rem;
          }
          .about-grid {
            flex-direction: column;
          }
          .about-col {
            padding: 2.5rem 1.5rem;
          }
          .about-col:first-child {
            border-right: none;
            border-bottom: 1px solid var(--ink);
          }
        }
      `}</style>
      <div style={{ padding: 0, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* HEADER SECTION */}
        <section className="about-header">
          <h1 className="display-title" style={{ 
            fontSize: "clamp(3rem, 7vw, 6rem)", 
            lineHeight: 0.95, 
            margin: 0,
            maxWidth: "1200px",
            textTransform: "uppercase",
            wordBreak: "break-word"
          }}>
            Built for founders who'd rather build than budget.
          </h1>
        </section>

        {/* CONTENT GRID */}
        <section className="about-grid" style={{ flex: 1 }}>
          <div className="about-col">
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", textTransform: "uppercase", color: "var(--text-muted)", margin: 0 }}>
              The Origin
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", lineHeight: 1.8, color: "var(--ink)", margin: 0 }}>
              It started with friends trying to figure out how to cut our own expenses. We quickly realized this wasn't just a personal headache—it was a massive market problem. Founders were bleeding cash and drowning in spreadsheets just to understand their burn. So, we started building.
            </p>
          </div>
          
          <div className="about-col" style={{ backgroundColor: "rgba(33, 40, 66, 0.02)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", textTransform: "uppercase", color: "var(--text-muted)", margin: 0 }}>
              The Team
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1.1rem", lineHeight: 1.8, color: "var(--ink)", margin: 0 }}>
              We are Heiley, Sahil, Triza, and Yashraj—four computer science builders turning a late-night ideation session into an enterprise-grade financial engine. We'd rather be coding than budgeting, and we figured you would too.
            </p>
          </div>
        </section>
      </div>
    </>
>>>>>>> main
  );
}

export default AboutPage;

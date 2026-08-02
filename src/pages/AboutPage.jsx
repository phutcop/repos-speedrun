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
  );
}

export default AboutPage;

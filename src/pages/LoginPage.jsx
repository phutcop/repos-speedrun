function LoginPage() {
  return (
    <div className="page" style={{ display: "flex", justifyContent: "center", paddingTop: "5rem" }}>
      <div className="panel-card panel-card-alt" style={{ width: 380, padding: "2.2rem" }}>
        <h1 className="section-title">Log in</h1>
        <p className="muted" style={{ fontSize: "0.9rem", marginBottom: "1.6rem" }}>
          UI placeholder — wire up to your auth provider.
        </p>

        <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
          Email
        </label>
        <input
          type="email"
          placeholder="you@company.com"
          disabled
          style={{
            width: "100%",
            padding: "0.7rem 0.9rem",
            marginBottom: "1.1rem",
            border: "1px solid var(--border-soft)",
            borderRadius: "var(--radius-sm)",
            background: "var(--bg-main)",
            color: "var(--text-main)",
            opacity: 0.7,
          }}
        />

        <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
          Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          disabled
          style={{
            width: "100%",
            padding: "0.7rem 0.9rem",
            marginBottom: "1.6rem",
            border: "1px solid var(--border-soft)",
            borderRadius: "var(--radius-sm)",
            background: "var(--bg-main)",
            color: "var(--text-main)",
            opacity: 0.7,
          }}
        />

        {/* TODO(team): wire this button up to your auth flow */}
        <button className="btn btn-solid btn-block" disabled style={{ opacity: 0.6, cursor: "not-allowed" }}>
          Log in
        </button>
      </div>
    </div>
  );
}

export default LoginPage;

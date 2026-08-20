<<<<<<< HEAD
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
=======
import React, { useState } from "react";

function LoginPage({ onLogin }) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg-main)",
      fontFamily: "var(--font-display)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* ---------- MOBILE TOP HEADER ---------- */}
      <header className="mobile-top-header">
        <a href="/">
          <img src="/monkey-logo.png" alt="finshyt logo" />
          <span>finshyt</span>
        </a>
      </header>
      {/* Background graphic placeholder (previously DataRain) */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.1, zIndex: 0, pointerEvents: "none", background: "radial-gradient(circle at center, var(--ink) 0%, transparent 70%)" }} />
      
      <div style={{ width: "100%", maxWidth: 360, padding: "0 1.5rem", position: "relative", zIndex: 1 }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: "var(--ink)",
            marginBottom: "0.4rem"
          }}>Log in</h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
            Secure access to your financial intelligence.
          </p>
        </div>

        <div style={{ marginBottom: "1.2rem" }}>
          <label style={{
            display: "block",
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "var(--ink)",
            marginBottom: "0.5rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase"
          }}>Email</label>
          <input
            type="email"
            style={{
              width: "100%",
              padding: "0.85rem 1rem",
              border: "1px solid var(--ink)",
              borderRadius: 0,
              background: "transparent",
              color: "var(--ink)",
              fontSize: "0.95rem",
              fontFamily: "var(--font-mono)",
              outline: "none",
              boxSizing: "border-box"
            }}
          />
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <label style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "var(--ink)",
              letterSpacing: "0.08em",
              textTransform: "uppercase"
            }}>Password</label>
            <a href="#" style={{ fontSize: "0.78rem", color: "var(--text-muted)", textDecoration: "none" }}>Forgot?</a>
          </div>
          <input
            type="password"
            style={{
              width: "100%",
              padding: "0.85rem 1rem",
              border: "1px solid var(--ink)",
              borderRadius: 0,
              background: "transparent",
              color: "var(--ink)",
              fontSize: "0.95rem",
              fontFamily: "var(--font-mono)",
              outline: "none",
              boxSizing: "border-box"
            }}
          />
        </div>

        <button
          onClick={onLogin}
          style={{
            width: "100%",
            padding: "0.95rem",
            background: "var(--ink)",
            color: "var(--bg-main)",
            border: "none",
            borderRadius: 0,
            fontSize: "0.88rem",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "var(--font-display)",
            letterSpacing: "0.03em",
            marginBottom: "0.75rem"
          }}
        >
          Log into finshyt
        </button>

        <button
          onClick={onLogin}
          style={{
            width: "100%",
            padding: "0.95rem",
            background: "transparent",
            color: "var(--text-muted)",
            border: "1px solid var(--border-soft)",
            borderRadius: 0,
            fontSize: "0.88rem",
            cursor: "pointer",
            fontFamily: "var(--font-display)"
          }}
        >
          Continue as guest
        </button>

        <p style={{ marginTop: "2rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>
          New here?{" "}
          <a href="#" style={{ color: "var(--ink)", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: "3px" }}>
            Request access
          </a>
        </p>
>>>>>>> main
      </div>
    </div>
  );
}

export default LoginPage;

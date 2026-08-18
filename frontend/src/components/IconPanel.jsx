import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { HomeIcon, AboutIcon, LoginIcon, DashboardIcon, ChatbotIcon, SunIcon, MoonIcon } from "./Icons";

/* =====================================================
   ICON PANEL
   Persistent left nav (desktop) + bottom tab bar (mobile).

   Layout:
   - main nav: Home / Dashboard / Chatbot
   - bottom-docked: info button (About Us) + Login
   - footer: copyright line
   ===================================================== */
function IconPanel() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial state
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true);
    }
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const navClass = ({ isActive }) => (isActive ? "active" : "");

  return (
    <>
      {/* ---------- MOBILE TOP HEADER ---------- */}
      <header className="mobile-top-header">
        <NavLink to="/">
          <img src="/monkey-logo.png" alt="finshyt logo" />
          <span>finshyt</span>
        </NavLink>
      </header>

      {/* ---------- DESKTOP SIDEBAR ---------- */}
      <aside className="icon-panel">
        <NavLink to="/" className="panel-brand">
          <img
            src="/monkey-logo.png"
            alt="finshyt logo"
            style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover" }}
          />
          <span className="panel-brand-name">finshyt</span>
        </NavLink>

        <nav className="panel-nav">
          <NavLink to="/" end className={navClass}>
            <HomeIcon />
            <span>home</span>
          </NavLink>

          <NavLink to="/dashboard" className={navClass}>
            <DashboardIcon />
            <span>dashboard</span>
          </NavLink>

          <NavLink to="/advisor" className={navClass}>
            <ChatbotIcon />
            <span>chatbot</span>
          </NavLink>
        </nav>

        <div className="panel-bottom">
          <div className="panel-bottom-actions">
            <button onClick={toggleDark} className="info-btn" aria-label="Toggle dark mode" title="Toggle dark mode" style={{ cursor: "pointer", background: "transparent" }}>
              {isDark ? <SunIcon width={16} height={16} /> : <MoonIcon width={16} height={16} />}
            </button>
            <NavLink to="/about" className="info-btn" aria-label="About us" title="About us">
              <AboutIcon width={16} height={16} />
            </NavLink>
            <NavLink to="/login" className="btn btn-sm btn-block panel-login-btn" style={{ borderRadius: 0 }}>
              <LoginIcon width={15} height={15} />
              <span>login</span>
            </NavLink>
          </div>
          <div className="panel-copyright">© 2026 finshyt. All rights reserved.</div>
        </div>
      </aside>

      {/* ---------- MOBILE BOTTOM TAB BAR ---------- */}
      <nav className="mobile-nav" aria-label="Primary">
        <NavLink to="/" end className={navClass} aria-label="Home">
          <HomeIcon width={20} height={20} />
        </NavLink>
        <NavLink to="/dashboard" className={navClass} aria-label="Dashboard">
          <DashboardIcon width={20} height={20} />
        </NavLink>
        <NavLink to="/advisor" className={navClass} aria-label="Chatbot">
          <ChatbotIcon width={20} height={20} />
        </NavLink>
        <NavLink to="/about" className={navClass} aria-label="About us">
          <AboutIcon width={20} height={20} />
        </NavLink>
        <NavLink to="/login" className={navClass} aria-label="Login">
          <LoginIcon width={20} height={20} />
        </NavLink>
      </nav>
    </>
  );
}

export default IconPanel;

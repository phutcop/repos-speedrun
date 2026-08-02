import { NavLink } from "react-router-dom";
import { HomeIcon, AboutIcon, LoginIcon, DashboardIcon, ChatbotIcon } from "./Icons";

/* =====================================================
   ICON PANEL
   Persistent left nav (desktop) + bottom tab bar (mobile).

   Layout:
   - main nav: Home / Dashboard / Chatbot
   - bottom-docked: info button (About Us) + Login
   - footer: copyright line
   ===================================================== */
function IconPanel() {
  const navClass = ({ isActive }) => (isActive ? "active" : "");

  return (
    <>
      {/* ---------- DESKTOP SIDEBAR ---------- */}
      <aside className="icon-panel">
        <div className="panel-brand">
          <div className="panel-brand-mark">F</div>
          <span className="panel-brand-name">finance advisor</span>
        </div>

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
            <NavLink to="/about" className="info-btn" aria-label="About us" title="About us">
              <AboutIcon width={16} height={16} />
            </NavLink>
            <NavLink to="/login" className="btn btn-sm btn-block panel-login-btn">
              <LoginIcon width={15} height={15} />
              <span>login</span>
            </NavLink>
          </div>
          <div className="panel-copyright">© 2026 Finance Advisor. All rights reserved.</div>
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

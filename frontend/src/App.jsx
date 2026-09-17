import { useState } from "react";
import { Routes, Route, Navigate, useNavigate, Outlet } from "react-router-dom";
import IconPanel from "./components/IconPanel";
import MoneyBoat from "./components/MoneyBoat";

import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import UploadFlowPage from "./pages/UploadFlowPage";
import DashboardPage from "./pages/DashboardPage";
import AdvisorPage from "./pages/AdvisorPage";

function AppLayout({ isAuthenticated, onLogout }) {
  return (
    <div className="app-layout">
      <IconPanel isAuthenticated={isAuthenticated} onLogout={onLogout} />
      <main className="content">
        <Outlet />
      </main>
      <MoneyBoat />
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return typeof localStorage !== "undefined" && localStorage.getItem("finshyt_auth") === "true";
  });
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsAuthenticated(true);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("finshyt_auth", "true");
    }
    navigate("/dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("finshyt_auth");
    }
    navigate("/login");
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route element={<AppLayout isAuthenticated={isAuthenticated} onLogout={handleLogout} />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/upload" element={<UploadFlowPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/advisor" element={<AdvisorPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
import { useState } from "react";
import { Routes, Route, Navigate, useNavigate, Outlet } from "react-router-dom";
import IconPanel from "./components/IconPanel";

import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import UploadFlowPage from "./pages/UploadFlowPage";
import DashboardPage from "./pages/DashboardPage";
import AdvisorPage from "./pages/AdvisorPage";

function AppLayout() {
  return (
    <div className="app-layout">
      <IconPanel />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate("/");
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route element={<AppLayout />}>
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

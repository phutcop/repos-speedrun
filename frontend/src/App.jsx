<<<<<<< HEAD
import { Routes, Route } from "react-router-dom";
import IconPanel from "./components/IconPanel";
import MoneyBoat from "./components/MoneyBoat";
=======
import { useState } from "react";
import { Routes, Route, Navigate, useNavigate, Outlet } from "react-router-dom";
import IconPanel from "./components/IconPanel";
>>>>>>> main

import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import UploadFlowPage from "./pages/UploadFlowPage";
import DashboardPage from "./pages/DashboardPage";
import AdvisorPage from "./pages/AdvisorPage";

<<<<<<< HEAD
function App() {
  return (
    <div className="app-layout">
      <IconPanel />

      <main className="content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/upload" element={<UploadFlowPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/advisor" element={<AdvisorPage />} />
        </Routes>
      </main>

      <MoneyBoat />
=======
function AppLayout() {
  return (
    <div className="app-layout">
      <IconPanel />
      <main className="content">
        <Outlet />
      </main>
>>>>>>> main
    </div>
  );
}

<<<<<<< HEAD
=======
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

>>>>>>> main
export default App;

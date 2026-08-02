import { Routes, Route } from "react-router-dom";
import IconPanel from "./components/IconPanel";
import MoneyBoat from "./components/MoneyBoat";

import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import UploadFlowPage from "./pages/UploadFlowPage";
import DashboardPage from "./pages/DashboardPage";
import AdvisorPage from "./pages/AdvisorPage";

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
    </div>
  );
}

export default App;

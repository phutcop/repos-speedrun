import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadPanel from "../components/UploadPanel";
import { ArrowUpRight } from "../components/Icons";

/* =====================================================
   UPLOAD FLOW PAGE
   "Explore / Get started" lands here first. Once a file
   is selected, we show a short "analyzing" state, then
   reveal a "your dashboard is ready" card.

   TODO(team): replace the setTimeout with your real
   upload → parse → categorize → analyze pipeline, and
   only reveal "ready" once that actually completes.
   ===================================================== */
function UploadFlowPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle"); // idle | analyzing | ready
  const [fileName, setFileName] = useState(null);

  const handleFileSelected = (file) => {
    setFileName(file?.name ?? null);
    setStatus("analyzing");

    // TODO(team): replace with real processing; resolve this
    // only once the backend confirms the dashboard is built.
    setTimeout(() => setStatus("ready"), 1600);
  };

  return (
    <div className="page" style={{ display: "flex", justifyContent: "center", paddingTop: "5rem" }}>
      <div style={{ width: "100%", maxWidth: 640 }}>
        <h1
          className="display-title"
          style={{ fontSize: "3rem", textAlign: "center", marginBottom: "1rem" }}
        >
          Upload your ledger.
        </h1>
        <p className="muted" style={{ textAlign: "center", marginBottom: "3rem", fontSize: "1rem", fontFamily: "var(--font-mono)", maxWidth: 480, margin: "0 auto 3rem auto" }}>
          We handle the categorization and synthesis so your dashboard builds itself instantly.
        </p>

        <div style={{ 
          border: "1px solid var(--ink)", 
          background: "var(--bg-card-alt)", 
          padding: "3rem", 
          minHeight: "280px", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center" 
        }}>
          {status === "idle" && (
            <UploadPanel onFileSelected={handleFileSelected} />
          )}

          {status === "analyzing" && (
            <div className="upload-status">
              <div className="upload-spinner" aria-hidden="true" />
              <div style={{ fontWeight: 600, marginBottom: "0.3rem" }}>Analyzing {fileName}…</div>
              <div className="muted" style={{ fontSize: "0.85rem" }}>
                Categorizing expenses, checking your budget, and building your dashboard.
              </div>
            </div>
          )}

          {status === "ready" && (
            <div className="upload-status">
              <div className="upload-status-check" aria-hidden="true">✓</div>
              <div style={{ fontWeight: 600, marginBottom: "0.4rem" }}>Your dashboard is ready</div>
              <div className="muted" style={{ fontSize: "0.85rem", marginBottom: "1.4rem" }}>
                Built from {fileName}.
              </div>
              <button type="button" className="btn btn-solid" onClick={() => navigate("/dashboard")}>
                View dashboard <ArrowUpRight width={15} height={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadFlowPage;

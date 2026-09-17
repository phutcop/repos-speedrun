import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadPanel from "../components/UploadPanel";
import { ArrowUpRight } from "../components/Icons";

/* Upload → server-side validation/preview → explicit confirmation. */
function UploadFlowPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle"); // idle | previewing | preview | confirming | ready
  const [fileName, setFileName] = useState(null);
  const [kind, setKind] = useState("expenses");
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelected = async (file) => {
    setFileName(file?.name ?? null);
    setError(null);
    setStatus("previewing");
    try {
      const form = new FormData();
      form.append("kind", kind);
      form.append("file", file);
      const response = await fetch("http://localhost:8000/api/imports/preview", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "We could not preview this file.");
      setPreview(data);
      setStatus("preview");
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  };

  const confirmImport = async () => {
    setStatus("confirming");
    try {
      const response = await fetch("http://localhost:8000/api/imports/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ import_id: preview.import_id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "We could not save this import.");
      setPreview({ ...preview, result: data });
      setStatus("ready");
    } catch (err) {
      setError(err.message);
      setStatus("preview");
    }
  };

  const reset = () => {
    setFileName(null);
    setPreview(null);
    setError(null);
    setStatus("idle");
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
            <div style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                {["expenses", "budgets"].map((value) => (
                  <button key={value} type="button" className={`btn btn-sm ${kind === value ? "btn-solid" : "btn-outline"}`} onClick={() => setKind(value)}>
                    {value === "expenses" ? "Expense file" : "Budget file"}
                  </button>
                ))}
              </div>
              <UploadPanel onFileSelected={handleFileSelected} />
              {error && <p role="alert" style={{ color: "#b42318", marginTop: "1rem", fontSize: "0.9rem" }}>{error}</p>}
            </div>
          )}

          {status === "previewing" && (
            <div className="upload-status">
              <div className="upload-spinner" aria-hidden="true" />
              <div style={{ fontWeight: 600, marginBottom: "0.3rem" }}>Checking {fileName}…</div>
              <div className="muted" style={{ fontSize: "0.85rem" }}>
                Validating columns, identifying duplicates, and preparing your preview.
              </div>
            </div>
          )}

          {status === "preview" && preview && (
            <div style={{ width: "100%", maxWidth: 760 }}>
              <div className="card-label" style={{ marginBottom: "0.6rem" }}>Review before importing</div>
              <p className="muted" style={{ margin: "0 0 1rem", fontSize: "0.85rem" }}>
                {preview.valid_rows} valid rows will be imported. {preview.duplicate_rows > 0 && `${preview.duplicate_rows} duplicates will be skipped.`}
                {preview.errors.length > 0 && ` ${preview.errors.length} invalid rows were excluded.`}
              </p>
              <div style={{ maxHeight: 235, overflow: "auto", border: "1px solid var(--border-soft)", marginBottom: "1rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem", fontFamily: "var(--font-mono)" }}>
                  <thead><tr>{Object.keys(preview.preview[0] || {}).filter((key) => key !== "confidence").map((key) => <th key={key} style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid var(--border-soft)" }}>{key}</th>)}</tr></thead>
                  <tbody>{preview.preview.map((row, index) => <tr key={index}>{Object.entries(row).filter(([key]) => key !== "confidence").map(([key, value]) => <td key={key} style={{ padding: "0.5rem", borderBottom: "1px solid var(--border-soft)" }}>{String(value)}</td>)}</tr>)}</tbody>
                </table>
              </div>
              {preview.errors.length > 0 && <p className="muted" style={{ fontSize: "0.78rem", marginBottom: "1rem" }}>Example issue: row {preview.errors[0].row} — {preview.errors[0].reason}</p>}
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button type="button" className="btn btn-solid" disabled={!preview.valid_rows} onClick={confirmImport}>Confirm import</button>
                <button type="button" className="btn btn-outline" onClick={reset}>Cancel</button>
              </div>
              {error && <p role="alert" style={{ color: "#b42318", marginTop: "1rem", fontSize: "0.9rem" }}>{error}</p>}
            </div>
          )}

          {status === "confirming" && (
            <div className="upload-status"><div className="upload-spinner" aria-hidden="true" /><div style={{ fontWeight: 600 }}>Saving your confirmed import…</div></div>
          )}

          {status === "ready" && (
            <div className="upload-status">
              <div className="upload-status-check" aria-hidden="true">✓</div>
              <div style={{ fontWeight: 600, marginBottom: "0.4rem" }}>Your dashboard is ready</div>
              <div className="muted" style={{ fontSize: "0.85rem", marginBottom: "1.4rem" }}>
                {preview?.result?.message || `Built from ${fileName}.`}
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

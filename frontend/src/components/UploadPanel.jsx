import { useRef, useState } from "react";
import { UploadIcon } from "./Icons";

/* =====================================================
   UPLOAD PANEL — UI ONLY
   Drag/drop + browse affordance is fully wired for
   visual states (hover, file-selected) but does NOT
   parse or send the file anywhere yet.

   TODO(team): hook `handleFiles` up to your real
   upload pipeline (validation, preview, POST to backend).
   ===================================================== */
function UploadPanel({ onFileSelected }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files) => {
    if (files && files.length > 0) {
      setFileName(files[0].name);
      // TODO(team): replace with real upload/parsing call
      // e.g. uploadExpenseFile(files[0])
      onFileSelected?.(files[0]);
    }
  };

  return (
    <div>
      <div className="card-label" style={{ marginBottom: "0.9rem" }}>
        Upload your balance sheet
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        style={{
          border: `1.5px dashed ${isDragging ? "var(--ink)" : "var(--border-strong)"}`,
          borderRadius: "var(--radius-md)",
          padding: "1.8rem 1.2rem",
          textAlign: "center",
          background: isDragging ? "rgba(33,40,66,0.04)" : "transparent",
          transition: "background 0.15s ease, border-color 0.15s ease",
        }}
      >
        <UploadIcon width={28} height={28} style={{ opacity: 0.6, marginBottom: "0.7rem" }} />
        <div style={{ fontSize: "0.88rem", marginBottom: "0.9rem" }}>
          {fileName ? (
            <span>
              <strong>{fileName}</strong> selected
            </span>
          ) : (
            <span className="muted">Drag a CSV or Excel file here, or</span>
          )}
        </div>

        <button type="button" className="btn btn-sm" onClick={() => inputRef.current?.click()}>
          Browse file
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={(e) => handleFiles(e.target.files)}
          style={{ display: "none" }}
        />

        <div className="muted" style={{ fontSize: "0.72rem", marginTop: "1rem", letterSpacing: "0.03em" }}>
          Initial — CSV / XLSX supported
        </div>
      </div>
    </div>
  );
}

export default UploadPanel;

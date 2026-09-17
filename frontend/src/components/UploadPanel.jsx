import { useRef, useState } from "react";
import { UploadIcon } from "./Icons";

/* =====================================================
   UPLOAD PANEL - UI ONLY
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
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        background: isDragging ? "rgba(33,40,66,0.04)" : "transparent",
        transition: "background 0.15s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--bg-card)", border: "1px solid var(--border-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <UploadIcon width={18} height={18} style={{ opacity: 0.7 }} />
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", marginBottom: "0.2rem" }}>
            {fileName || "Upload ledger"}
          </div>
          <div className="muted" style={{ fontSize: "0.75rem" }}>
            {fileName ? "Ready to parse" : "Drag & Drop CSV / XLSX"}
          </div>
        </div>
      </div>

      <button type="button" className="btn btn-sm btn-solid" onClick={() => inputRef.current?.click()} style={{ flexShrink: 0 }}>
        Browse
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={(e) => handleFiles(e.target.files)}
        style={{ display: "none" }}
      />
    </div>
  );
}

export default UploadPanel;

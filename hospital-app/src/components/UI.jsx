import { statusColor } from "../utils/helpers";

// ── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ label }) {
  const color = statusColor(label);
  return (
    <span
      style={{
        background: color + "22",
        color,
        border: `1px solid ${color}55`,
        borderRadius: 20,
        padding: "2px 10px",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.5,
      }}
    >
      {label}
    </span>
  );
}

// ── StatCard ─────────────────────────────────────────────────────────────────
export function StatCard({ icon, label, value, sub, color = "#0ea5e9" }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "22px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: 12, right: 16, fontSize: 28, opacity: 0.15 }}>{icon}</div>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "#94a3b8", fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 36, fontWeight: 800, color, fontVariantNumeric: "tabular-nums" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#64748b" }}>{sub}</div>}
    </div>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          background: "#0a1628",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          padding: 32,
          width: "min(520px,95vw)",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18 }}>{title}</div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "none",
              color: "#94a3b8",
              width: 32,
              height: 32,
              borderRadius: "50%",
              fontSize: 16,
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── FormField ────────────────────────────────────────────────────────────────
export function FormField({ label, value, onChange, type = "text", options, required }) {
  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 9,
    color: "#e2e8f0",
    fontSize: 13,
    outline: "none",
  };
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 600,
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 5,
        }}
      >
        {label}
        {required && " *"}
      </label>
      {options ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle, background: "#0d1f38" }}>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
      )}
    </div>
  );
}

// ── SaveButton ───────────────────────────────────────────────────────────────
export function SaveButton({ label = "Save", onClick }) {
  return (
    <button
      className="btn-primary"
      onClick={onClick}
      style={{
        width: "100%",
        padding: 13,
        background: "linear-gradient(135deg,#0ea5e9,#06b6d4)",
        border: "none",
        borderRadius: 10,
        color: "#fff",
        fontWeight: 700,
        fontSize: 14,
        marginTop: 4,
      }}
    >
      {label}
    </button>
  );
}

// ── ActionButton ─────────────────────────────────────────────────────────────
export function ActionButton({ label, onClick, variant = "primary" }) {
  const variants = {
    primary: { bg: "rgba(14,165,233,0.1)", border: "rgba(14,165,233,0.2)", color: "#38bdf8" },
    danger:  { bg: "rgba(239,68,68,0.1)",  border: "rgba(239,68,68,0.2)",  color: "#ef4444" },
    success: { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)", color: "#34d399" },
  };
  const v = variants[variant];
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 12px",
        background: v.bg,
        border: `1px solid ${v.border}`,
        borderRadius: 7,
        color: v.color,
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      {label}
    </button>
  );
}

// ── SearchBar ────────────────────────────────────────────────────────────────
export function SearchBar({ value, onChange, placeholder = "Search…" }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        flex: 1,
        minWidth: 200,
        padding: "10px 16px",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 10,
        color: "#e2e8f0",
        fontSize: 13,
        outline: "none",
      }}
    />
  );
}

// ── AddButton ────────────────────────────────────────────────────────────────
export function AddButton({ label, onClick }) {
  return (
    <button
      className="btn-primary"
      onClick={onClick}
      style={{
        padding: "10px 22px",
        background: "linear-gradient(135deg,#0ea5e9,#06b6d4)",
        border: "none",
        borderRadius: 10,
        color: "#fff",
        fontWeight: 700,
        fontSize: 13,
      }}
    >
      {label}
    </button>
  );
}

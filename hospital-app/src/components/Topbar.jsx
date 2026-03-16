import { NAV_ITEMS } from "../data/mockData";
import { formatDate } from "../utils/helpers";

export default function Topbar({ activePage, isAdmin, onToggleSidebar }) {
  const allItems = NAV_ITEMS;
  const pageLabel = allItems.find((n) => n.key === activePage)?.label || activePage;

  return (
    <header
      style={{
        height: 64,
        background: "#050e1d",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: 16,
        flexShrink: 0,
      }}
    >
      <button
        onClick={onToggleSidebar}
        style={{ background: "transparent", border: "none", color: "#64748b", fontSize: 20, padding: 4 }}
      >
        ☰
      </button>

      <div
        style={{
          flex: 1,
          fontFamily: "'Syne',sans-serif",
          fontWeight: 700,
          fontSize: 18,
          color: "#f1f5f9",
          textTransform: "capitalize",
        }}
      >
        {pageLabel}
      </div>

      <div
        style={{
          fontSize: 12,
          color: "#475569",
          background: "rgba(255,255,255,0.04)",
          padding: "6px 14px",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {formatDate(new Date().toISOString())}
      </div>

      <div
        style={{
          fontSize: 11,
          padding: "5px 12px",
          borderRadius: 20,
          background: isAdmin ? "rgba(139,92,246,0.15)" : "rgba(14,165,233,0.15)",
          color: isAdmin ? "#a78bfa" : "#38bdf8",
          border: `1px solid ${isAdmin ? "#a78bfa44" : "#38bdf844"}`,
          fontWeight: 700,
          letterSpacing: 0.8,
        }}
      >
        {isAdmin ? "ADMIN" : "STAFF"}
      </div>
    </header>
  );
}

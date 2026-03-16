import { NAV_ITEMS } from "../data/mockData";

export default function Sidebar({ session, activePage, setActivePage, sidebarOpen, onSignOut }) {
  const isAdmin = session.role === "admin";
  const navItems = NAV_ITEMS.filter((n) => !n.adminOnly || isAdmin);

  return (
    <aside
      style={{
        width: sidebarOpen ? 240 : 72,
        background: "#050e1d",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s ease",
        overflow: "hidden",
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "20px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          minHeight: 72,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "linear-gradient(135deg,#0ea5e9,#06b6d4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          ✚
        </div>
        {sidebarOpen && (
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: -0.5, color: "#f1f5f9" }}>
              MediCore
            </div>
            <div style={{ fontSize: 10, color: "#64748b", letterSpacing: 1.5, textTransform: "uppercase" }}>HMS Pro</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
        {navItems.map((n) => (
          <div
            key={n.key}
            className={`nav-item${activePage === n.key ? " active" : ""}`}
            onClick={() => setActivePage(n.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 20px",
              cursor: "pointer",
              color: "#64748b",
              fontSize: 14,
              fontWeight: 500,
              borderLeft: "3px solid transparent",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>{n.icon}</span>
            {sidebarOpen && n.label}
          </div>
        ))}
      </nav>

      {/* User + Sign Out */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {sidebarOpen && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#0ea5e9,#8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              {session.avatar}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {session.name}
              </div>
              <div style={{ fontSize: 10, color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {session.title}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={onSignOut}
          style={{
            width: "100%",
            padding: "8px 12px",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 8,
            color: "#ef4444",
            fontSize: 12,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          {sidebarOpen ? "⎋ Sign Out" : "⎋"}
        </button>
      </div>
    </aside>
  );
}

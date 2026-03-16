import { StatCard, Badge } from "../components/UI";

export default function Dashboard({
  patients,
  staff,
  appointments,
  inventory,
  isAdmin,
}) {
  const critical = patients.filter((p) => p.status === "Critical").length;
  const lowStock = inventory.filter((i) => i.stock < i.threshold).length;
  const pendingAppts = appointments.filter(
    (a) => a.status === "Pending",
  ).length;
  const activeStaff = staff.filter((s) => s.status === "Active").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: 16,
        }}
      >
        <StatCard
          icon="🫀"
          label="Total Patients"
          value={patients.length}
          sub="Currently admitted"
          color="#38bdf8"
        />
        <StatCard
          icon="🚨"
          label="Critical Cases"
          value={critical}
          sub="Require attention"
          color="#ef4444"
        />
        <StatCard
          icon="📅"
          label="Pending Appts"
          value={pendingAppts}
          sub="Need confirmation"
          color="#f59e0b"
        />
        {isAdmin && (
          <StatCard
            icon="👥"
            label="Active Staff"
            value={activeStaff}
            sub={`of ${staff.length} total`}
            color="#a78bfa"
          />
        )}
        <StatCard
          icon="⚠️"
          label="Low Stock Items"
          value={lowStock}
          sub="Below threshold"
          color="#f97316"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Recent patients */}
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16,
            padding: 24,
          }}
        >
          <div
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 700,
              fontSize: 15,
              marginBottom: 18,
              color: "#f1f5f9",
            }}
          >
            Recent Patients
          </div>
          {patients.slice(0, 5).map((p) => (
            <div
              key={p.id}
              className="table-row"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 8px",
                borderRadius: 8,
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: `hsl(${p.name.charCodeAt(0) * 7},55%,35%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {p.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{p.ward}</div>
              </div>
              <Badge label={p.status} />
            </div>
          ))}
        </div>

        {/* Upcoming appointments */}
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16,
            padding: 24,
          }}
        >
          <div
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 700,
              fontSize: 15,
              marginBottom: 18,
              color: "#f1f5f9",
            }}
          >
            Upcoming Appointments
          </div>
          {appointments.map((a) => (
            <div
              key={a.id}
              className="table-row"
              style={{ padding: "10px 8px", borderRadius: 8, marginBottom: 4 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>
                    {a.patient}
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>
                    {a.doctor} · {a.time}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Badge label={a.status} />
                  <div style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>
                    {a.date}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Low inventory alerts */}
      {lowStock > 0 && (
        <div
          style={{
            background: "rgba(249,115,22,0.06)",
            border: "1px solid rgba(249,115,22,0.2)",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <div
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 700,
              fontSize: 14,
              color: "#fb923c",
              marginBottom: 12,
            }}
          >
            ⚠️ Low Inventory Alerts
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {inventory
              .filter((i) => i.stock < i.threshold)
              .map((i) => (
                <div
                  key={i.id}
                  style={{
                    background: "rgba(249,115,22,0.1)",
                    border: "1px solid rgba(249,115,22,0.2)",
                    borderRadius: 8,
                    padding: "8px 14px",
                    fontSize: 12,
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{i.name}</span>
                  <br />
                  <span style={{ color: "#ef4444" }}>
                    {i.stock} {i.unit}
                  </span>{" "}
                  <span style={{ color: "#64748b" }}>(min: {i.threshold})</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

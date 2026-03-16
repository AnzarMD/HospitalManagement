import { statusColor } from "../utils/helpers";

export default function ReportsPage({ patients, appointments, inventory }) {
  // Ward distribution
  const wards = {};
  patients.forEach((p) => {
    wards[p.ward] = (wards[p.ward] || 0) + 1;
  });
  const maxWard = Math.max(...Object.values(wards));

  // Status breakdown
  const statusCounts = { Stable: 0, Critical: 0, Recovering: 0 };
  patients.forEach((p) => {
    if (statusCounts[p.status] !== undefined) statusCounts[p.status]++;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Ward distribution */}
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
              marginBottom: 20,
            }}
          >
            Patients by Ward
          </div>
          {Object.entries(wards).map(([ward, count]) => (
            <div key={ward} style={{ marginBottom: 12 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 5,
                  fontSize: 12,
                }}
              >
                <span>{ward}</span>
                <span style={{ fontWeight: 700, color: "#38bdf8" }}>
                  {count}
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 3,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${(count / maxWard) * 100}%`,
                    background: "linear-gradient(90deg,#0ea5e9,#06b6d4)",
                    borderRadius: 3,
                    transition: "width 0.5s",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Status + appointments */}
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
              marginBottom: 20,
            }}
          >
            Patient Status Overview
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {Object.entries(statusCounts).map(([s, c]) => {
              const color = statusColor(s);
              return (
                <div
                  key={s}
                  style={{
                    background: `${color}11`,
                    border: `1px solid ${color}33`,
                    borderRadius: 12,
                    padding: "16px 12px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 28, fontWeight: 800, color }}>
                    {c}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color,
                      fontWeight: 600,
                      marginTop: 4,
                    }}
                  >
                    {s}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 20 }}>
            <div
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 12,
                color: "#94a3b8",
              }}
            >
              Appointments Summary
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
              }}
            >
              {[
                ["Total", appointments.length, "#38bdf8"],
                [
                  "Confirmed",
                  appointments.filter((a) => a.status === "Confirmed").length,
                  "#34d399",
                ],
                [
                  "Pending",
                  appointments.filter((a) => a.status === "Pending").length,
                  "#f59e0b",
                ],
              ].map(([l, v, c]) => (
                <div
                  key={l}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: 10,
                    padding: "12px 14px",
                  }}
                >
                  <div style={{ fontSize: 20, fontWeight: 800, color: c }}>
                    {v}
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Inventory health */}
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
            marginBottom: 16,
          }}
        >
          Inventory Health
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
            gap: 12,
          }}
        >
          {inventory.map((i) => {
            const pct = Math.min(
              100,
              Math.round((i.stock / (i.threshold * 2)) * 100),
            );
            const low = i.stock < i.threshold;
            return (
              <div
                key={i.id}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 12,
                  padding: "14px 16px",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 8,
                    color: low ? "#ef4444" : "#e2e8f0",
                  }}
                >
                  {i.name}
                </div>
                <div
                  style={{
                    height: 5,
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: 3,
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: low ? "#ef4444" : "#10b981",
                      borderRadius: 3,
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    color: "#64748b",
                  }}
                >
                  <span>
                    {i.stock} {i.unit}
                  </span>
                  <span
                    style={{
                      color: low ? "#ef4444" : "#34d399",
                      fontWeight: 700,
                    }}
                  >
                    {low ? "LOW" : "OK"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

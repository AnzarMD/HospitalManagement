const express = require("express");
const cors    = require("cors");
const { getDb } = require("./db/database");

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// ── Boot: init DB first, then attach routes ───────────────────────────────────
async function start() {
  await getDb(); // ensures DB file + schema exist before any request

  app.use("/api/auth",         require("./routes/auth"));
  app.use("/api/patients",     require("./routes/patients"));
  app.use("/api/staff",        require("./routes/staff"));
  app.use("/api/appointments", require("./routes/appointments"));
  app.use("/api/inventory",    require("./routes/inventory"));

  app.get("/api/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

  app.use((req, res) => res.status(404).json({ error: `Route ${req.method} ${req.path} not found` }));
  app.use((err, req, res, next) => { console.error(err.stack); res.status(500).json({ error: "Internal server error" }); });

  app.listen(PORT, () => {
    console.log(`✅ MediCore API running at http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
  });
}

start().catch(err => { console.error("Failed to start:", err); process.exit(1); });

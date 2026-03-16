const express = require("express");
const { getDb } = require("../db/database");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

async function nextId(db) {
  const last = db.prepare("SELECT id FROM appointments ORDER BY id DESC LIMIT 1").get();
  if (!last) return "A-001";
  return `A-${String(parseInt(last.id.split("-")[1]) + 1).padStart(3, "0")}`;
}

router.get("/", authenticate, async (req, res) => {
  try {
    const db = await getDb();
    res.json(db.prepare("SELECT * FROM appointments ORDER BY date ASC, time ASC").all());
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", authenticate, async (req, res) => {
  try {
    const db = await getDb();
    const { patient, doctor, date, time, type } = req.body;
    if (!patient || !doctor || !date) return res.status(400).json({ error: "Patient, doctor and date required" });
    const id = await nextId(db);
    db.prepare(`INSERT INTO appointments (id,patient,doctor,date,time,type,status) VALUES (?,?,?,?,?,?,'Pending')`)
      .run(id, patient, doctor, date, time||"", type||"Consultation");
    res.status(201).json(db.prepare("SELECT * FROM appointments WHERE id = ?").get(id));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch("/:id/status", authenticate, async (req, res) => {
  try {
    const db = await getDb();
    const existing = db.prepare("SELECT * FROM appointments WHERE id = ?").get(req.params.id);
    if (!existing) return res.status(404).json({ error: "Not found" });
    const newStatus = existing.status === "Pending" ? "Confirmed" : "Pending";
    db.prepare("UPDATE appointments SET status=? WHERE id=?").run(newStatus, req.params.id);
    res.json(db.prepare("SELECT * FROM appointments WHERE id = ?").get(req.params.id));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:id", authenticate, async (req, res) => {
  try {
    const db = await getDb();
    if (!db.prepare("SELECT id FROM appointments WHERE id = ?").get(req.params.id)) return res.status(404).json({ error: "Not found" });
    db.prepare("DELETE FROM appointments WHERE id = ?").run(req.params.id);
    res.json({ message: "Deleted", id: req.params.id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;

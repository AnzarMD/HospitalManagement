const express = require("express");
const { getDb } = require("../db/database");
const { authenticate, adminOnly } = require("../middleware/auth");

const router = express.Router();

async function nextId(db) {
  const last = db.prepare("SELECT id FROM staff ORDER BY id DESC LIMIT 1").get();
  if (!last) return "S-001";
  return `S-${String(parseInt(last.id.split("-")[1]) + 1).padStart(3, "0")}`;
}

router.get("/", authenticate, adminOnly, async (req, res) => {
  try {
    const db = await getDb();
    res.json(db.prepare("SELECT * FROM staff ORDER BY created_at DESC").all());
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", authenticate, adminOnly, async (req, res) => {
  try {
    const db = await getDb();
    const { name, role, dept, shift, status } = req.body;
    if (!name || !role) return res.status(400).json({ error: "Name and role required" });
    const id = await nextId(db);
    db.prepare(`INSERT INTO staff (id,name,role,dept,shift,status,joined) VALUES (?,?,?,?,?,?,?)`)
      .run(id, name, role, dept||"Admin", shift||"Morning", status||"Active", new Date().toISOString().slice(0,10));
    res.status(201).json(db.prepare("SELECT * FROM staff WHERE id = ?").get(id));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const db = await getDb();
    const existing = db.prepare("SELECT * FROM staff WHERE id = ?").get(req.params.id);
    if (!existing) return res.status(404).json({ error: "Not found" });
    const { name, role, dept, shift, status } = req.body;
    db.prepare(`UPDATE staff SET name=?,role=?,dept=?,shift=?,status=? WHERE id=?`)
      .run(name||existing.name, role||existing.role, dept||existing.dept, shift||existing.shift, status||existing.status, req.params.id);
    res.json(db.prepare("SELECT * FROM staff WHERE id = ?").get(req.params.id));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const db = await getDb();
    if (!db.prepare("SELECT id FROM staff WHERE id = ?").get(req.params.id)) return res.status(404).json({ error: "Not found" });
    db.prepare("DELETE FROM staff WHERE id = ?").run(req.params.id);
    res.json({ message: "Deleted", id: req.params.id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;

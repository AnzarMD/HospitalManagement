const express = require("express");
const { getDb } = require("../db/database");
const { authenticate, adminOnly } = require("../middleware/auth");

const router = express.Router();

const fmt = (p) => p && ({ id: p.id, name: p.name, age: p.age, gender: p.gender, ward: p.ward, doctor: p.doctor, status: p.status, admitted: p.admitted, bloodGroup: p.blood_group, phone: p.phone });

async function nextId(db) {
  const last = db.prepare("SELECT id FROM patients ORDER BY id DESC LIMIT 1").get();
  if (!last) return "P-001";
  return `P-${String(parseInt(last.id.split("-")[1]) + 1).padStart(3, "0")}`;
}

router.get("/", authenticate, async (req, res) => {
  try {
    const db = await getDb();
    const { status, search } = req.query;
    let sql = "SELECT * FROM patients WHERE 1=1";
    const params = [];
    if (status && status !== "All") { sql += " AND status = ?"; params.push(status); }
    if (search) { sql += " AND (name LIKE ? OR id LIKE ? OR ward LIKE ?)"; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
    sql += " ORDER BY created_at DESC";
    res.json(db.prepare(sql).all(...params).map(fmt));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", authenticate, adminOnly, async (req, res) => {
  try {
    const db = await getDb();
    const { name, age, gender, ward, doctor, status, bloodGroup, phone } = req.body;
    if (!name || !doctor) return res.status(400).json({ error: "Name and doctor are required" });
    const id = await nextId(db);
    const admitted = new Date().toISOString().slice(0, 10);
    db.prepare(`INSERT INTO patients (id,name,age,gender,ward,doctor,status,admitted,blood_group,phone) VALUES (?,?,?,?,?,?,?,?,?,?)`)
      .run(id, name, age || null, gender || "Male", ward || "Cardiology", doctor, status || "Stable", admitted, bloodGroup || "A+", phone || "");
    res.status(201).json(fmt(db.prepare("SELECT * FROM patients WHERE id = ?").get(id)));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const db = await getDb();
    const existing = db.prepare("SELECT * FROM patients WHERE id = ?").get(req.params.id);
    if (!existing) return res.status(404).json({ error: "Patient not found" });
    const { name, age, gender, ward, doctor, status, bloodGroup, phone } = req.body;
    db.prepare(`UPDATE patients SET name=?,age=?,gender=?,ward=?,doctor=?,status=?,blood_group=?,phone=? WHERE id=?`)
      .run(name||existing.name, age??existing.age, gender||existing.gender, ward||existing.ward, doctor||existing.doctor, status||existing.status, bloodGroup||existing.blood_group, phone??existing.phone, req.params.id);
    res.json(fmt(db.prepare("SELECT * FROM patients WHERE id = ?").get(req.params.id)));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const db = await getDb();
    if (!db.prepare("SELECT id FROM patients WHERE id = ?").get(req.params.id)) return res.status(404).json({ error: "Not found" });
    db.prepare("DELETE FROM patients WHERE id = ?").run(req.params.id);
    res.json({ message: "Deleted", id: req.params.id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;

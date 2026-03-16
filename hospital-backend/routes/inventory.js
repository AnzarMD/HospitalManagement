const express = require("express");
const { getDb } = require("../db/database");
const { authenticate, adminOnly } = require("../middleware/auth");

const router = express.Router();

async function nextId(db) {
  const last = db
    .prepare("SELECT id FROM inventory ORDER BY id DESC LIMIT 1")
    .get();
  if (!last) return "I-001";
  return `I-${String(parseInt(last.id.split("-")[1]) + 1).padStart(3, "0")}`;
}

router.get("/", authenticate, async (req, res) => {
  try {
    const db = await getDb();
    const { search } = req.query;
    let sql = "SELECT * FROM inventory WHERE 1=1";
    const params = [];
    if (search) {
      sql += " AND (name LIKE ? OR category LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }
    sql += " ORDER BY name ASC";
    res.json(db.prepare(sql).all(...params));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", authenticate, adminOnly, async (req, res) => {
  try {
    const db = await getDb();
    const { name, category, stock, unit, threshold, supplier } = req.body;
    if (!name) return res.status(400).json({ error: "Name required" });
    const id = await nextId(db);
    db.prepare(
      `INSERT INTO inventory (id,name,category,stock,unit,threshold,supplier) VALUES (?,?,?,?,?,?,?)`,
    ).run(
      id,
      name,
      category || "Other",
      Number(stock) || 0,
      unit || "Units",
      Number(threshold) || 0,
      supplier || "",
    );
    res
      .status(201)
      .json(db.prepare("SELECT * FROM inventory WHERE id = ?").get(id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const db = await getDb();
    const existing = db
      .prepare("SELECT * FROM inventory WHERE id = ?")
      .get(req.params.id);
    if (!existing) return res.status(404).json({ error: "Not found" });
    const { name, category, stock, unit, threshold, supplier } = req.body;
    db.prepare(
      `UPDATE inventory SET name=?,category=?,stock=?,unit=?,threshold=?,supplier=? WHERE id=?`,
    ).run(
      name || existing.name,
      category || existing.category,
      stock !== undefined ? Number(stock) : existing.stock,
      unit || existing.unit,
      threshold !== undefined ? Number(threshold) : existing.threshold,
      supplier || existing.supplier,
      req.params.id,
    );
    res.json(
      db.prepare("SELECT * FROM inventory WHERE id = ?").get(req.params.id),
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id/stock", authenticate, async (req, res) => {
  try {
    const db = await getDb();
    const existing = db
      .prepare("SELECT * FROM inventory WHERE id = ?")
      .get(req.params.id);
    if (!existing) return res.status(404).json({ error: "Not found" });
    const newStock = Math.max(0, existing.stock + Number(req.body.delta));
    db.prepare("UPDATE inventory SET stock=? WHERE id=?").run(
      newStock,
      req.params.id,
    );
    res.json(
      db.prepare("SELECT * FROM inventory WHERE id = ?").get(req.params.id),
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const db = await getDb();
    if (!db.prepare("SELECT id FROM inventory WHERE id = ?").get(req.params.id))
      return res.status(404).json({ error: "Not found" });
    db.prepare("DELETE FROM inventory WHERE id = ?").run(req.params.id);
    res.json({ message: "Deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

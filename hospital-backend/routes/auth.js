const express = require("express");
const bcrypt  = require("bcryptjs");
const { getDb } = require("../db/database");
const { generateToken, authenticate } = require("../middleware/auth");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username and password required" });

    const db   = await getDb();
    const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username.toLowerCase());

    if (!user || !bcrypt.compareSync(password, user.password))
      return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(user);
    res.json({ token, user: { id: user.id, username: user.username, role: user.role, name: user.name, title: user.title, avatar: user.avatar } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/me", authenticate, async (req, res) => {
  try {
    const db   = await getDb();
    const user = db.prepare("SELECT id, username, role, name, title, avatar FROM users WHERE id = ?").get(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
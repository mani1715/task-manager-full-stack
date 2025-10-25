const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { query } = require("../db");
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, hash]);
    const user = await query("SELECT id, email FROM users WHERE email = $1", [email]);
    const token = jwt.sign(user[0], process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: user[0] });
  } catch (err) {
    if (err.message.includes("duplicate")) return res.status(400).json({ message: "Email already exists" });
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.length === 0) return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user[0].password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const payload = { id: user[0].id, email: user[0].email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

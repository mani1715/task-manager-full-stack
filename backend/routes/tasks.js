const express = require("express");
const { query } = require("../db");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;
  const rows = await query(
    "INSERT INTO tasks (user_id, title, description) VALUES ($1, $2, $3) RETURNING *",
    [userId, title, description]
  );
  res.status(201).json(rows[0]);
});

router.get("/", auth, async (req, res) => {
  const rows = await query("SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC", [req.user.id]);
  res.json(rows);
});

router.put("/:id", auth, async (req, res) => {
  const { title, description, completed } = req.body;
  const id = req.params.id;
  await query(
    "UPDATE tasks SET title=$1, description=$2, completed=$3, updated_at=NOW() WHERE id=$4 AND user_id=$5",
    [title, description, completed, id, req.user.id]
  );
  const rows = await query("SELECT * FROM tasks WHERE id=$1", [id]);
  res.json(rows[0]);
});

router.delete("/:id", auth, async (req, res) => {
  await query("DELETE FROM tasks WHERE id=$1 AND user_id=$2", [req.params.id, req.user.id]);
  res.json({ message: "Deleted" });
});

module.exports = router;

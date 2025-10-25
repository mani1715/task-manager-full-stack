require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { pool } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const migrationSql = fs.readFileSync(path.join(__dirname, "migrations", "init.sql"), "utf8");
pool.query(migrationSql).then(() => console.log("✅ Database initialized."));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (_, res) => res.json({ message: "Task Manager API with PostgreSQL" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

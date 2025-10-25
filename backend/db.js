const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // needed for Railway/Render
});

async function query(sql, params) {
  const { rows } = await pool.query(sql, params);
  return rows;
}

module.exports = { query, pool };

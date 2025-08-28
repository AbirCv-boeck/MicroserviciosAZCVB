// db.js
const mysql = require('mysql2/promise');

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'usersdb',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function getPoolWithRetry(retries = 10, delayMs = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      const pool = mysql.createPool(config);
      // test connection
      const conn = await pool.getConnection();
      conn.release();
      return pool;
    } catch (err) {
      console.log(`MySQL not ready yet (${i+1}/${retries}) - retrying in ${delayMs}ms`);
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
  throw new Error('Could not connect to MySQL after retries');
}

module.exports = { getPoolWithRetry, config };

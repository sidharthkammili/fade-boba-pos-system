require('dotenv').config();
const { Pool } = require('pg');

// Support both explicit DB_* env vars and a single DATABASE_URL (render.com style).
// If DATABASE_URL is provided, prefer it. Preserve SSL handling for hosted DBs.
let poolConfig;
if (process.env.DATABASE_URL) {
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  };
} else {
  poolConfig = {
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT,
    database: process.env.DB_NAME,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  };
}

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected database error:', err); // post error (any error, i didnt make it specific)
});

module.exports = pool;
const fs = require('fs');
const path = require('path');
const pool = require('../db');

async function run() {
  const sql = fs.readFileSync(path.join(__dirname, 'optimize.sql'), 'utf8');

  try {
    await pool.query(sql);
    console.log('Database optimization script completed successfully.');
  } catch (error) {
    console.error('Failed to run DB optimization:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

run();
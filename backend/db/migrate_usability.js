const fs = require('fs');
const path = require('path');
const pool = require('../db');

async function run() {
  const sql = fs.readFileSync(path.join(__dirname, 'usability.sql'), 'utf8');
  try {
    await pool.query(sql);
    console.log('Usability_Feedback table created/verified successfully.');
  } catch (error) {
    console.error('Failed to run usability migration:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

run();
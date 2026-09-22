require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../db');

async function seedDatabase() {
  try {
    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    
    console.log('Starting database seeding...');
    
    // Split by semicolon and filter out empty strings
    // Simple splitting, might not handle complex SQL well, but for this seed it's fine.
    const queries = seedSql.split(';').map(q => q.trim()).filter(q => q.length > 0);
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const query of queries) {
        await client.query(query);
      }
      await client.query('COMMIT');
      console.log('Database seeded successfully!');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
    
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    pool.end();
  }
}

seedDatabase();

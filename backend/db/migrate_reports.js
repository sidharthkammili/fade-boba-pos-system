const pool = require('../db');

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Update Orders table
    await client.query(`
      ALTER TABLE Orders 
      ADD COLUMN IF NOT EXISTS tax_amount NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20) DEFAULT 'Card',
      ADD COLUMN IF NOT EXISTS discount_amount NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS service_charge NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS z_report_id INTEGER;
    `);

    // Update z_reports table
    await client.query(`
      ALTER TABLE z_reports 
      ADD COLUMN IF NOT EXISTS total_tax NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS total_cash NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS total_card NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS total_discounts NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS total_voids NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS total_service_charges NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS total_returns NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS employee_signature TEXT;
    `);

    // Ensure status 'voided' is possible or just use a boolean
    // For simplicity, we'll use status = 'voided' or 'refunded' boolean

    await client.query('COMMIT');
    console.log('Migration successful');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();

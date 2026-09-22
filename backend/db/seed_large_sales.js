const pool = require('../db');
const fs = require('fs');

async function seedLargeSales() {
  const TOTAL_ORDERS = parseInt(process.argv[2]) || 1000000;
  const BATCH_SIZE = 5000;
  
  console.log(`Starting to seed ${TOTAL_ORDERS} orders...`);
  
  const client = await pool.connect();
  try {
    // 1. Get existing Employees and Menu Items
    const employees = (await client.query('SELECT employee_id FROM Employees')).rows;
    const menuItems = (await client.query('SELECT menu_item_id, base_price FROM Menu_Items')).rows;

    if (employees.length === 0 || menuItems.length === 0) {
      console.error('No employees or menu items found. Please run regular seed first.');
      return;
    }

    console.log(`Found ${employees.length} employees and ${menuItems.length} menu items.`);

    // 2. Clear existing orders (optional but usually intended for a fresh seed)
    // console.log('Clearing existing orders...');
    // await client.query('TRUNCATE TABLE Orders, Order_Line_Items RESTART IDENTITY CASCADE');

    const startTime = Date.now();
    let ordersSeeded = 0;

    while (ordersSeeded < TOTAL_ORDERS) {
      const currentBatchSize = Math.min(BATCH_SIZE, TOTAL_ORDERS - ordersSeeded);
      
      await client.query('BEGIN');
      
      try {
        // We'll insert orders and then their line items.
        // For performance at scale, we use a single multi-row INSERT.
        
        const ordersRows = [];
        const orderTimestampBase = new Date('2025-01-01T00:00:00Z').getTime();
        const yearInMs = 365 * 24 * 60 * 60 * 1000;

        for (let i = 0; i < currentBatchSize; i++) {
          const emp = employees[Math.floor(Math.random() * employees.length)];
          const timestamp = new Date(orderTimestampBase + Math.floor(Math.random() * yearInMs)).toISOString();
          // total_amount will be updated later or calculated during generation
          ordersRows.push(`(${emp.employee_id}, '${timestamp}', 0, true, null)`);
        }

        // Insert orders and get their IDs
        const ordersQuery = `
          INSERT INTO Orders (employee_id, order_timestamp, total_amount, is_closed, customer_id)
          VALUES ${ordersRows.join(', ')}
          RETURNING order_id
        `;
        const orderResults = await client.query(ordersQuery);
        const orderIds = orderResults.rows.map(r => r.order_id);

        const lineItemsRows = [];
        const orderTotals = new Map();

        for (const orderId of orderIds) {
          const numItems = Math.floor(Math.random() * 3) + 1; // 1 to 3 items per order
          let total = 0;

          for (let j = 0; j < numItems; j++) {
            const item = menuItems[Math.floor(Math.random() * menuItems.length)];
            const qty = 1;
            const price = parseFloat(item.base_price);
            total += price * qty;
            lineItemsRows.push(`(${orderId}, ${item.menu_item_id}, ${qty}, ${price})`);
          }
          orderTotals.set(orderId, total);
        }

        // Insert line items
        const lineItemsQuery = `
          INSERT INTO Order_Line_Items (order_id, menu_item_id, quantity, sale_price)
          VALUES ${lineItemsRows.join(', ')}
        `;
        await client.query(lineItemsQuery);

        // Update order totals
        // This can be slow if done one by one. Better to use a temp table or CTE?
        // Let's use a chunky UPDATE statement.
        const updateValues = Array.from(orderTotals.entries()).map(([id, tot]) => `(${id}, ${tot.toFixed(2)})`).join(', ');
        const updateQuery = `
          UPDATE Orders AS o
          SET total_amount = v.total
          FROM (VALUES ${updateValues}) AS v(id, total)
          WHERE o.order_id = v.id
        `;
        await client.query(updateQuery);

        await client.query('COMMIT');
        
        ordersSeeded += currentBatchSize;
        const elapsed = (Date.now() - startTime) / 1000;
        const rate = ordersSeeded / elapsed;
        console.log(`Seeded ${ordersSeeded}/${TOTAL_ORDERS} orders... (${rate.toFixed(0)} orders/sec)`);

      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
    }

    console.log(`Finished seeding ${TOTAL_ORDERS} orders in ${(Date.now() - startTime) / 1000}s`);

  } catch (err) {
    console.error('Error during large seeding:', err);
  } finally {
    client.release();
    pool.end();
  }
}

// Check if run directly
if (require.main === module) {
  seedLargeSales();
}

module.exports = seedLargeSales;

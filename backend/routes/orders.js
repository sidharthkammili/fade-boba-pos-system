// routes/orders.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST place a new order
router.post('/', async (req, res) => {
  const { employee_id, items } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    let total = items.reduce((sum, item) => sum + parseFloat(item.sale_price), 0);
    const orderResult = await client.query(
      'INSERT INTO Orders (employee_id, order_timestamp, total_amount, status) VALUES ($1, NOW(), $2, $3) RETURNING order_id',
      [employee_id, total.toFixed(2), 'pending']
    );
    const order_id = orderResult.rows[0].order_id;
    for (const item of items) {
      const lineResult = await client.query(
        'INSERT INTO Order_Line_Items (order_id, menu_item_id, quantity, sale_price) VALUES ($1, $2, $3, $4) RETURNING line_item_id',
        [order_id, item.menu_item_id, item.quantity || 1, item.sale_price]
      );
      const line_item_id = lineResult.rows[0].line_item_id;
      if (item.addons && item.addons.length > 0) {
        for (const addon of item.addons) {
          await client.query(
            'INSERT INTO Line_Item_Add_Ons (line_item_id, add_on_menu_item_id, quantity) VALUES ($1, $2, $3)',
            [line_item_id, addon.add_on_menu_item_id, addon.quantity || 1]
          );
        }
      }

      // Deduct inventory based on recipes (if recipes table exists)
      try {
        const tableCheck = await client.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name = 'recipes'
          );
        `);

        if (tableCheck.rows[0].exists) {
          const recipeResult = await client.query(
            'SELECT inventory_id, quantity_used FROM recipes WHERE menu_item_id = $1',
            [item.menu_item_id]
          );

          for (const recipeItem of recipeResult.rows) {
            const totalQuantityNeeded = recipeItem.quantity_used * (item.quantity || 1);

            // Deduct inventory
            await client.query(
              'UPDATE Inventory SET quantity_in_stock = quantity_in_stock - $1 WHERE inventory_id = $2',
              [totalQuantityNeeded, recipeItem.inventory_id]
            );
          }
        }
      } catch (recipeErr) {
        console.error('Recipe inventory deduction error:', recipeErr.message);
        // Continue with order even if recipe deduction fails
      }
    }
    await client.query('COMMIT');
    res.json({ success: true, order_id });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Order failed' });
  } finally {
    client.release();
  }
});

// GET recent orders (manager view)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.order_id, o.order_timestamp, o.total_amount, o.refunded, o.status,
              e.first_name || ' ' || e.last_name AS employee_name
       FROM Orders o
       JOIN Employees e ON o.employee_id = e.employee_id
       ORDER BY o.order_timestamp DESC
       LIMIT 50`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET sales summary by day
router.get('/summary', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DATE(order_timestamp) AS date, 
              COUNT(*) AS order_count, 
              SUM(total_amount) AS revenue
       FROM Orders
       WHERE order_timestamp >= NOW() - INTERVAL '30 days'
       AND (refunded IS NULL OR refunded = false)
       GROUP BY DATE(order_timestamp)
       ORDER BY date`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// GET active order queue (pending + in progress + ready)
router.get('/queue', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.order_id, o.order_timestamp, o.total_amount, o.status,
              e.first_name || ' ' || e.last_name AS employee_name,
              array_agg(m.item_name ORDER BY m.item_name) AS items
       FROM Orders o
       JOIN Employees e ON o.employee_id = e.employee_id
       JOIN Order_Line_Items oli ON oli.order_id = o.order_id
       JOIN Menu_Items m ON m.menu_item_id = oli.menu_item_id
       WHERE o.status IN ('pending', 'in progress', 'ready')
       AND (o.refunded IS NULL OR o.refunded = false)
       GROUP BY o.order_id, o.order_timestamp, o.total_amount, o.status, e.first_name, e.last_name
       ORDER BY o.order_timestamp ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch queue' });
  }
});

// PUT update order status
router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const valid = ['pending', 'in progress', 'ready', 'completed'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  try {
    const result = await pool.query(
      'UPDATE Orders SET status = $1 WHERE order_id = $2 RETURNING order_id, status',
      [status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json({ success: true, ...result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// GET single order with line items
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const orderResult = await pool.query(
      `SELECT o.order_id, o.order_timestamp, o.total_amount, o.refunded, o.status,
              e.first_name || ' ' || e.last_name AS employee_name
       FROM Orders o
       JOIN Employees e ON o.employee_id = e.employee_id
       WHERE o.order_id = $1`,
      [id]
    );
    if (orderResult.rows.length === 0) return res.status(404).json({ error: 'Order not found' });

    const lineResult = await pool.query(
      `SELECT oli.line_item_id, oli.quantity, oli.sale_price,
              m.item_name
       FROM Order_Line_Items oli
       JOIN Menu_Items m ON oli.menu_item_id = m.menu_item_id
       WHERE oli.order_id = $1`,
      [id]
    );

    const addonResult = await pool.query(
      `SELECT lia.line_item_id, m.item_name, lia.quantity
       FROM Line_Item_Add_Ons lia
       JOIN Menu_Items m ON lia.add_on_menu_item_id = m.menu_item_id
       JOIN Order_Line_Items oli ON lia.line_item_id = oli.line_item_id
       WHERE oli.order_id = $1`,
      [id]
    );

    const addonMap = {};
    addonResult.rows.forEach((a) => {
      if (!addonMap[a.line_item_id]) addonMap[a.line_item_id] = [];
      addonMap[a.line_item_id].push(a);
    });

    const items = lineResult.rows.map((li) => ({
      ...li,
      addons: addonMap[li.line_item_id] || [],
    }));

    res.json({ ...orderResult.rows[0], items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// GET orders by employee (cashier history)
router.get('/employee/:employee_id', async (req, res) => {
  const { employee_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT o.order_id, o.order_timestamp, o.total_amount, o.refunded, o.status,
              e.first_name || ' ' || e.last_name AS employee_name
       FROM Orders o
       JOIN Employees e ON o.employee_id = e.employee_id
       WHERE o.employee_id = $1
       ORDER BY o.order_timestamp DESC
       LIMIT 30`,
      [employee_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch employee orders' });
  }
});

// POST refund an order
router.post('/:id/refund', async (req, res) => {
  const { id } = req.params;
  try {
    const check = await pool.query(
      'SELECT order_id, refunded, total_amount FROM Orders WHERE order_id = $1',
      [id]
    );
    if (check.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    if (check.rows[0].refunded) return res.status(400).json({ error: 'Order already refunded' });

    const result = await pool.query(
      'UPDATE Orders SET refunded = true, status = $1 WHERE order_id = $2 RETURNING order_id, total_amount',
      ['completed', id]
    );
    res.json({ success: true, refunded_order_id: result.rows[0].order_id, amount: result.rows[0].total_amount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Refund failed' });
  }
});

module.exports = router;
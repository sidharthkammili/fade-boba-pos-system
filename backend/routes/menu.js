// routes/menu.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all drinks
router.get('/drinks', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT menu_item_id, item_name, base_price, is_seasonal FROM Menu_Items WHERE item_type = 'Drink' ORDER BY item_name"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch drinks' });
  }
});

// GET all addons
router.get('/addons', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT menu_item_id, item_name, base_price FROM Menu_Items WHERE item_type = 'Addon' ORDER BY item_name"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch addons' });
  }
});

// GET all menu items (drinks + addons)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT menu_item_id, item_name, base_price, item_type FROM Menu_Items ORDER BY item_type, item_name'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

// PUT update a menu item (manager)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { item_name, base_price, item_type } = req.body;
  try {
    await pool.query(
      'UPDATE Menu_Items SET item_name = $1, base_price = $2, item_type = $3 WHERE menu_item_id = $4',
      [item_name, base_price, item_type, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

// PUT update a menu item price specifically (for backward compatibility)
router.put('/:id/price', async (req, res) => {
  const { id } = req.params;
  const { base_price } = req.body;
  try {
    await pool.query(
      'UPDATE Menu_Items SET base_price = $1 WHERE menu_item_id = $2',
      [base_price, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update price' });
  }
});

// POST create a new menu item (manager)
router.post('/', async (req, res) => {
  const { item_name, base_price, item_type } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Menu_Items (item_name, base_price, item_type) VALUES ($1, $2, $3) RETURNING menu_item_id',
      [item_name, base_price, item_type]
    );
    res.status(201).json({ success: true, menu_item_id: result.rows[0].menu_item_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create menu item' });
  }
});

// DELETE a menu item (manager)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Note: This might fail if there are orders referencing this item and CASCADE is not set.
    await pool.query('DELETE FROM Menu_Items WHERE menu_item_id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete menu item. It may be referenced by existing orders.' });
  }
});

module.exports = router;
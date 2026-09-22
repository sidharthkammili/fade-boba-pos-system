const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM Inventory ORDER BY item_name'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

router.get('/low-stock', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM Inventory WHERE (quantity_in_stock - reorder_level) <= 0 ORDER BY item_name'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch low stock' });
  }
});

router.put('/:id/restock', async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  try {
    const result = await pool.query(
      'UPDATE Inventory SET quantity_in_stock = quantity_in_stock + $1 WHERE inventory_id = $2 RETURNING *',
      [amount, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to restock item' });
  }
});

module.exports = router;
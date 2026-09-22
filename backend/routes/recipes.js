// routes/recipes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all recipes with menu item and inventory details
router.get('/', async (req, res) => {
  try {
    // First check if recipes table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'recipes'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('Recipes table does not exist');
      return res.json([]); // Return empty array instead of error
    }

    const result = await pool.query(`
      SELECT
        r.menu_item_id,
        r.inventory_id,
        r.quantity_used,
        m.item_name as menu_item_name,
        m.item_type as menu_item_type,
        i.item_name as inventory_item_name,
        i.quantity_in_stock,
        i.reorder_level
      FROM recipes r
      JOIN Menu_Items m ON r.menu_item_id = m.menu_item_id
      JOIN Inventory i ON r.inventory_id = i.inventory_id
      ORDER BY m.item_name, i.item_name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching recipes:', err.message);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// POST add new recipe ingredient
router.post('/', async (req, res) => {
  const { menu_item_id, inventory_id, quantity_used } = req.body;
  if (!menu_item_id || !inventory_id || quantity_used === undefined) {
    return res.status(400).json({ error: 'menu_item_id, inventory_id, and quantity_used are required' });
  }
  try {
    // Check if recipes table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'recipes'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      return res.status(404).json({ error: 'Recipes table does not exist' });
    }

    const result = await pool.query(
      'INSERT INTO recipes (menu_item_id, inventory_id, quantity_used) VALUES ($1, $2, $3) RETURNING *',
      [menu_item_id, inventory_id, quantity_used]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Recipe POST error:', err.code, err.message);
    if (err.code === '23505') { // unique constraint violation
      res.status(409).json({ error: 'Recipe ingredient already exists for this menu item' });
    } else if (err.code === '23503') { // foreign key constraint violation
      res.status(400).json({ error: 'Invalid menu item or inventory item. Please ensure both exist.' });
    } else {
      res.status(500).json({ error: 'Failed to add recipe ingredient: ' + err.message });
    }
  }
});

// PUT update recipe ingredient quantity
router.put('/:menu_item_id/:inventory_id', async (req, res) => {
  const { menu_item_id, inventory_id } = req.params;
  const { quantity_used } = req.body;
  if (quantity_used === undefined) {
    return res.status(400).json({ error: 'quantity_used is required' });
  }
  try {
    const result = await pool.query(
      'UPDATE recipes SET quantity_used = $1 WHERE menu_item_id = $2 AND inventory_id = $3 RETURNING *',
      [quantity_used, menu_item_id, inventory_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe ingredient not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update recipe ingredient' });
  }
});

// DELETE recipe ingredient
router.delete('/:menu_item_id/:inventory_id', async (req, res) => {
  const { menu_item_id, inventory_id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM recipes WHERE menu_item_id = $1 AND inventory_id = $2 RETURNING *',
      [menu_item_id, inventory_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe ingredient not found' });
    }
    res.json({ message: 'Recipe ingredient deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete recipe ingredient' });
  }
});

module.exports = router;
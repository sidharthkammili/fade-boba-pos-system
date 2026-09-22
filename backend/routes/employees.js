// routes/employees.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST login
router.post('/login', async (req, res) => {
  const { employee_id } = req.body;
  try {
    const result = await pool.query(
      'SELECT employee_id, first_name, last_name, role FROM Employees WHERE employee_id = $1',
      [employee_id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Employee not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET all employees
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT employee_id, first_name, last_name, role FROM Employees ORDER BY last_name, first_name'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// POST add new employee
router.post('/', async (req, res) => {
  const { first_name, last_name, role } = req.body;
  if (!first_name || !last_name || !role) return res.status(400).json({ error: 'All fields required' });
  if (!['Cashier', 'Manager'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
  try {
    const result = await pool.query(
      'INSERT INTO Employees (first_name, last_name, role) VALUES ($1, $2, $3) RETURNING *',
      [first_name, last_name, role]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add employee' });
  }
});

// PUT update employee role
router.put('/:id/role', async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!['Cashier', 'Manager'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
  try {
    const result = await pool.query(
      'UPDATE Employees SET role = $1 WHERE employee_id = $2 RETURNING *',
      [role, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Employee not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// DELETE employee
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM Employees WHERE employee_id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Employee not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

module.exports = router;
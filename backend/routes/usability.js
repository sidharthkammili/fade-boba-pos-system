const express = require('express');
const router = express.Router();
const pool = require('../db');

const VALID_INTERFACES = [
  'Customer Kiosk',
  'Cashier POS',
  'Manager Dashboard',
];

router.post('/', async (req, res) => {
  const {
    participantName,
    interfaceView,
    taskLabel,
    taskSuccess,
    easeRating,
    completionSeconds,
    notes,
  } = req.body;

  if (!participantName || !interfaceView || !taskLabel) {
    return res.status(400).json({ error: 'participantName, interfaceView, and taskLabel are required' });
  }

  if (!VALID_INTERFACES.includes(interfaceView)) {
    return res.status(400).json({ error: 'Invalid interfaceView' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO Usability_Feedback
       (participant_name, interface_view, task_label, task_success, ease_rating, completion_seconds, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        participantName,
        interfaceView,
        taskLabel,
        Boolean(taskSuccess),
        easeRating ?? null,
        completionSeconds ?? null,
        notes ?? '',
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save usability feedback' });
  }
});

router.get('/', async (req, res) => {
  const { interfaceView = '', limit = 50 } = req.query;

  try {
    const values = [];
    let query = `
      SELECT *
      FROM Usability_Feedback
    `;

    if (interfaceView) {
      values.push(interfaceView);
      query += ` WHERE interface_view = $1 `;
    }

    values.push(Number(limit));
    query += ` ORDER BY created_at DESC LIMIT $${values.length}`;

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch usability feedback' });
  }
});

module.exports = router;
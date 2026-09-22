// routes/auth.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Approved emails that can log in as staff
// Add any email here that should have manager or cashier access
const APPROVED_STAFF_EMAILS = (process.env.APPROVED_STAFF_EMAILS || '')
  .split(',')
  .map((email) => email.trim())
  .filter(Boolean);

router.post('/google', async (req, res) => {
  const { token, intendedRole } = req.body;
  // intendedRole is 'manager' or 'cashier' sent from the frontend Login.js

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: google_id, email, given_name, family_name } = payload;

    // Check if this is an approved staff email
    if (APPROVED_STAFF_EMAILS.includes(email)) {
      // Use intendedRole to decide Manager or Cashier
      // Default to Manager if no role specified
      const role = intendedRole === 'cashier' ? 'Cashier' : 'Manager';

      // Try to find existing employee record by email
      const employeeCheck = await pool.query(
        'SELECT employee_id, first_name, last_name, role FROM Employees WHERE email = $1',
        [email]
      );

      if (employeeCheck.rows.length > 0) {
        // Return the employee but override role with intendedRole
        const emp = { ...employeeCheck.rows[0], role };
        return res.json({ success: true, userType: 'employee', user: emp });
      }

      // No employee record — return a virtual staff user based on Google profile
      const virtualUser = {
        employee_id: null,
        first_name: given_name || 'Staff',
        last_name: family_name || '',
        role,
        email,
      };
      return res.json({ success: true, userType: 'employee', user: virtualUser });
    }

    // Not an approved staff email — handle as customer
    let customerQuery = await pool.query(
      'SELECT * FROM Customers WHERE email = $1',
      [email]
    );

    let customer;
    if (customerQuery.rows.length === 0) {
      const newCustomer = await pool.query(
        'INSERT INTO Customers (google_id, email, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *',
        [google_id, email, given_name, family_name]
      );
      customer = newCustomer.rows[0];
    } else {
      customer = customerQuery.rows[0];
    }

    res.json({ success: true, userType: 'customer', user: customer });

  } catch (err) {
    console.error('OAuth Error:', err);
    res.status(401).json({ error: 'Invalid authentication token' });
  }
});

router.post('/pin', async (req, res) => {
  const { pin } = req.body;

  const pinFormatRegex = /^\d{4}$/;
  if (!pin || !pinFormatRegex.test(pin)) {
    return res.json({ success: false });
  }

  try {
    const result = await pool.query(
      'SELECT employee_id, first_name, last_name, role FROM Employees WHERE pin = $1',
      [pin]
    );
    if (result.rows.length === 0) {
      return res.json({ success: false });
    }
    res.json({ success: true, userType: 'employee', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
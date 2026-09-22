require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const pool = require('./db');

const menuRoutes = require('./routes/menu');
const ordersRoutes = require('./routes/orders');
const inventoryRoutes = require('./routes/inventory');
const employeesRoutes = require('./routes/employees');
const authRoutes = require('./routes/auth');
const translateRoutes = require('./routes/translate');
const chatbotRoutes = require('./routes/chatbot');
const usabilityRoutes = require('./routes/usability');
const reportsRoutes = require('./routes/reports');
const recipesRoutes = require('./routes/recipes');

const app = express();
const PORT = process.env.PORT || 3001;

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

app.use(cors());
app.use(express.json());

app.use('/api/menu', menuRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/translate', translateRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/usability', usabilityRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/recipes', recipesRoutes);

app.get('/api/health', async (req, res) => {
  const health = {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: 'unknown'
  };

  try {
    const dbCheck = await pool.query('SELECT 1');
    if (dbCheck) health.database = 'connected';
    res.json(health);
  } catch (err) {
    health.status = 'error';
    health.database = 'disconnected';
    health.error = err.message;
    res.status(503).json(health);
  }
});

app.use((err, req, res, next) => {
  const errorLog = `[${new Date().toISOString()}] ${err.stack}\n`;
  fs.appendFile(path.join(__dirname, 'error.log'), errorLog, (fsErr) => {
    if (fsErr) console.error('Failed to write to error log:', fsErr);
  });

  console.error('SERVER ERROR:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Fade Boba backend running on http://localhost:${PORT}`);
});

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});
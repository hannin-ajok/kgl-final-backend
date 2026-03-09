const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const procurementRoutes = require('./routes/procurement.routes');
const salesRoutes = require('./routes/sales.routes');
const creditRoutes = require('./routes/credit.routes');
const reportsRoutes = require('./routes/reports.routes');

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Basic app middleware.
app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Group backend endpoints by feature.
app.use('/api/auth', authRoutes);
app.use('/api/procurement', procurementRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/credit', creditRoutes);
app.use('/api/reports', reportsRoutes);

// Lightweight health route for Render uptime checks.
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'kgl-final-backend' });
});

module.exports = app;

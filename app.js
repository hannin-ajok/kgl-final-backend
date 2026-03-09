const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const procurementRoutes = require('./routes/procurement.routes');
const salesRoutes = require('./routes/sales.routes');
const creditRoutes = require('./routes/credit.routes');
const reportsRoutes = require('./routes/reports.routes');

const app = express();

// Basic app middleware.
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets directly from this same Node process.
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/images', express.static(path.join(__dirname, '../images')));

// Group backend endpoints by feature.
app.use('/api/auth', authRoutes);
app.use('/api/procurement', procurementRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/credit', creditRoutes);
app.use('/api/reports', reportsRoutes);

// If the route is unknown, send users to login.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/login.html'));
});

module.exports = app;

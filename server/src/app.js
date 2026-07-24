const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Parse JSON payloads
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', routes);

// 404 handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;

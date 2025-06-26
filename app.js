const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const doshaRoutes = require('./routes/doshas');
const symptomRoutes = require('./routes/symptoms');
const remedyRoutes = require('./routes/remedies');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Handle favicon requests to prevent 404 errors in the console
app.get('/favicon.ico', (req, res) => res.status(204).send());

app.use(express.static('public'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Use routes
app.use('/api/doshas', doshaRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/remedies', remedyRoutes);

module.exports = app;
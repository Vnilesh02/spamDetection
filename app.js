const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
require('express-async-errors');
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contacts');
const searchRoutes = require('./routes/search');
const spamRoutes = require('./routes/spam');

require('dotenv').config();

const app = express();

app.use(helmet());

app.use(compression());

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', contactRoutes);
app.use('/api', searchRoutes);
app.use('/api', spamRoutes);

// Global error handler
app.use((err, req, res, next) => {
  if (err.isJoi) {
    return res.status(400).json({ error: err.details[0].message });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;

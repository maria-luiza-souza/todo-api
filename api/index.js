const mongoose = require('mongoose');
const express = require('express');
const userRoutes = require('../src/routes/userRoutes');
const taskRoutes = require('../src/routes/taskRoutes');

const app = express();
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    next();
  } catch (err) {
    console.error('Mongo error:', err.message);
    res.status(500).json({ success: false, message: 'DB error' });
  }
});

app.use('/api/auth', userRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'TODO API esta funcionando!' });
});

module.exports = app;

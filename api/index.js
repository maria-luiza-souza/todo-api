const mongoose = require('mongoose');
const express = require('express');
const userRoutes = require('../src/routes/userRoutes');
const taskRoutes = require('../src/routes/taskRoutes');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

app.use(express.json());

app.use(async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI não configurado');
      }

      await mongoose.connect(process.env.MONGODB_URI);
    }

    next();
  } catch (error) {
    console.error('Erro de conexão com o MongoDB:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Não foi possível conectar ao banco de dados.',
    });
  }
});

app.use('/api/auth', userRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'TODO API está funcionando!' });
});

module.exports = app;

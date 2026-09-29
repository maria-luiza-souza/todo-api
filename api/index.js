const mongoose = require('mongoose');
const express = require('express');
const userRoutes = require('../src/routes/userRoutes');
const leadRoutes = require('../src/routes/leadRoutes');
const customerRoutes = require('../src/routes/customerRoutes');
const activityRoutes = require('../src/routes/activityRoutes');
const dashboardRoutes = require('../src/routes/dashboardRoutes');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

app.use(express.json({ limit: '1mb' }));

app.use(async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI não configurado');
      await mongoose.connect(process.env.MONGODB_URI, {
        dbName: process.env.MONGODB_DB || 'todo-api',
      });
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
app.use('/api/leads', leadRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'LeadFlow CRM API está funcionando!',
    version: '2.0.0',
    resources: ['auth', 'leads', 'customers', 'activities', 'dashboard'],
  });
});

module.exports = app;

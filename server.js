require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const userRoutes = require('./src/routes/userRoutes');
const leadRoutes = require('./src/routes/leadRoutes');
const customerRoutes = require('./src/routes/customerRoutes');
const activityRoutes = require('./src/routes/activityRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const dealRoutes = require('./src/routes/dealRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

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
    console.error('Erro ao conectar ao MongoDB:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Não foi possível conectar ao banco de dados.',
    });
  }
});

app.use('/api/auth', userRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'LeadFlow CRM API está funcionando!',
    version: '2.1.0',
  });
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`LeadFlow CRM API rodando na porta ${PORT}`);
  });
}

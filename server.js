require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./src/routes/userRoutes');
const taskRoutes = require('./src/routes/taskRoutes');

const app = express();

app.use(express.json());

// Middleware - so conecta localmente
app.use(async (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    try {
      if (mongoose.connections[0].readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URI);
      }
      next();
    } catch (err) {
      res.status(500).json({ success: false, message: 'Erro de conexao' });
    }
  } else {
    next();
  }
});

// Rotas
app.use('/api/auth', userRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'TODO API esta funcionando!' });
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(3001, () => console.log('Servidor rodando na porta 3001'));
}

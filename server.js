require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./src/routes/userRoutes');
const taskRoutes = require('./src/routes/taskRoutes');

const app = express();

app.use(express.json());

// Conectar MongoDB
let connected = false;

async function ensureConnection() {
  if (connected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  connected = true;
}

// Middleware de conexao
app.use(async (req, res, next) => {
  try {
    await ensureConnection();
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro de conexao' });
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
  ensureConnection().then(() => {
    app.listen(3001, () => console.log('Servidor rodando na porta 3001'));
  });
}

require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/database');
const userRoutes = require('./src/routes/userRoutes');
const taskRoutes = require('./src/routes/taskRoutes');

const app = express();

// Middleware
app.use(express.json());

// Conectar MongoDB apenas uma vez
let isConnected = false;

const ensureDB = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

// Middleware para conectar antes de processar requests
app.use(async (req, res, next) => {
  try {
    await ensureDB();
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro de conexao com banco de dados' });
  }
});

// Rotas
app.use('/api/auth', userRoutes);
app.use('/api/tasks', taskRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'TODO API esta funcionando!' });
});

// Exportar para Vercel
module.exports = app;

// Rodar localmente
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  ensureDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  });
}

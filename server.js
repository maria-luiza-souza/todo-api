require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/database');
const userRoutes = require('./src/routes/userRoutes');
const taskRoutes = require('./src/routes/taskRoutes');

const app = express();

// Conectar ao MongoDB
connectDB();

// Middleware para parsing de JSON
app.use(express.json());

// Rotas
app.use('/api/auth', userRoutes);
app.use('/api/tasks', taskRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'TODO API está funcionando!' });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor TODO API rodando na porta ${PORT}`);
  console.log(`📍 Acesse: http://localhost:${PORT}`);
  console.log(`🗄️ Banco de dados: ${process.env.MONGODB_URI}`);
});

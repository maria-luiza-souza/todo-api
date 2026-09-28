require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const userRoutes = require('./src/routes/userRoutes');
const taskRoutes = require('./src/routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

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
    console.error('Erro ao conectar ao MongoDB:', error.message);
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

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor TODO API rodando na porta ${PORT}`);
  });
}

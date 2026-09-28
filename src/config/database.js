const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return;
    }

    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI não configurado');
    }

    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    throw error;
  }
};

module.exports = connectDB;

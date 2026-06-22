const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB conectado');

  } catch (error) {
    console.error('Erro MongoDB:', error.message);
    throw error;
  }
};

module.exports = connectDB;

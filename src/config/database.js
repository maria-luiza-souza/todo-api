/**
 * ARQUIVO: src/config/database.js
 * 
 * EXPLICAÇÃO:
 * Este arquivo é responsável por CONECTAR a aplicação ao banco de dados MongoDB.
 * 
 * O que acontece aqui:
 * 1. Importa o Mongoose (biblioteca para trabalhar com MongoDB)
 * 2. Configura a URL de conexão do banco de dados
 * 3. Define opções de conexão
 * 4. Conecta ao banco
 * 5. Exibe mensagens de sucesso ou erro
 * 
 * FLUXO:
 * server.js -> connectDB() -> Mongoose conecta ao MongoDB
 */

const mongoose = require('mongoose');

let cached = null;

const connectDB = async () => {
  if (cached) {
    return cached;
  }

  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI nao definida');
    }

    const conn = await mongoose.connect(uri);
    cached = conn;
    console.log('MongoDB conectado');
    return conn;

  } catch (error) {
    console.error('Erro MongoDB:', error.message);
    throw error;
  }
};

module.exports = connectDB;

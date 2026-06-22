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

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      console.error('MONGODB_URI nao definida');
      return false;
    }

    await mongoose.connect(uri);

    console.log('MongoDB conectado com sucesso!');
    return true;

  } catch (error) {
    console.error('Erro ao conectar MongoDB:', error.message);
    return false;
  }
};

module.exports = connectDB;

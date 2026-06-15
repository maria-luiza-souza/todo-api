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

// Função que faz a conexão com o banco de dados
const connectDB = async () => {
  try {
    // mongoose.connect() tenta se conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      // useNewUrlParser: usa o novo parser de URLs (melhor prática)
      useNewUrlParser: true,
      // useUnifiedTopology: usa novo mecanismo de conexão (mais estável)
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB conectado com sucesso!');
    return true;

  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB:', error.message);
    // Sai do processo se não conseguir conectar
    process.exit(1);
  }
};

// Exporta a função para ser usada em server.js
module.exports = connectDB;

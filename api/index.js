const mongoose = require('mongoose');

// Conectar ANTES de importar o app
let connected = false;

async function connectMongo() {
  if (connected) return;
  if (mongoose.connections[0].readyState === 1) {
    connected = true;
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI);
  connected = true;
}

// Conectar primeiro
connectMongo().then(() => {
  console.log('MongoDB pronto');
}).catch(err => {
  console.error('Erro conexao:', err.message);
});

const app = require('../server');

module.exports = app;

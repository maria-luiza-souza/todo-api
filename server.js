/**
 * ARQUIVO: server.js
 * 
 * EXPLICAÇÃO:
 * Este é o arquivo PRINCIPAL da aplicação!
 * Aqui é onde:
 * 1. Carrega as variáveis de ambiente (.env)
 * 2. Configura o Express
 * 3. Conecta ao banco de dados
 * 4. Define os middlewares globais
 * 5. Define as rotas
 * 6. Inicia o servidor
 * 
 * FLUXO:
 * Node executa server.js
 *   ↓
 * Carrega .env
 *   ↓
 * Cria app Express
 *   ↓
 * Conecta ao MongoDB
 *   ↓
 * Define middlewares e rotas
 *   ↓
 * Servidor fica ouvindo na porta 5000
 */

// 1. IMPORTAR DEPENDÊNCIAS
require('dotenv').config(); // Carrega variáveis do arquivo .env
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');
const userRoutes = require('./src/routes/userRoutes');
const taskRoutes = require('./src/routes/taskRoutes');

// 2. CRIAR APLICAÇÃO EXPRESS
const app = express();

// 3. CONECTAR AO BANCO DE DADOS
connectDB();

// 4. MIDDLEWARES GLOBAIS
// Middleware para processar JSON
// Permite que a aplicação entenda corpos de requisição JSON
app.use(express.json());

// Middleware CORS
// Permite que o frontend acesse essa API
// cors() aceita requisições de qualquer origem
app.use(cors());

// Middleware de logging (opcional, mostra requisições no console)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toLocaleTimeString()}`);
  next();
});

// 5. ROTAS DA API
// Prefixo /api/auth para rotas de autenticação
app.use('/api/auth', userRoutes);

// Prefixo /api/tasks para rotas de tarefas
app.use('/api/tasks', taskRoutes);

// 6. ROTA DE TESTE (para verificar se servidor está rodando)
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TODO API rodando com sucesso! 🚀',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
      },
      tasks: {
        getAll: 'GET /api/tasks',
        getById: 'GET /api/tasks/:id',
        create: 'POST /api/tasks',
        update: 'PUT /api/tasks/:id',
        delete: 'DELETE /api/tasks/:id',
      },
    },
  });
});

// 7. TRATAMENTO DE ROTAS NÃO ENCONTRADAS
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
  });
});

// 8. INICIAR O SERVIDOR
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n✅ Servidor TODO API rodando na porta ${PORT}`);
  console.log(`📍 Acesse: http://localhost:${PORT}`);
  console.log(`🗄️ Banco de dados: ${process.env.MONGODB_URI}\n`);
});

// Exporta app (útil para testes)
module.exports = app;

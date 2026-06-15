/**
 * ARQUIVO: src/routes/userRoutes.js
 * 
 * EXPLICAÇÃO:
 * Define as ROTAS (URLs) para autenticação
 * 
 * ROTAS DEFINIDAS:
 * POST /api/auth/register  -> register (criar novo usuário)
 * POST /api/auth/login     -> login (fazer login)
 * 
 * FLUXO:
 * Cliente faz requisição POST
 *   ↓
 * Express chama a função do controller
 *   ↓
 * Controller processa e retorna resposta JSON
 */

const express = require('express');
const { register, login } = require('../controllers/userController');

const router = express.Router();

/**
 * ROTA: POST /api/auth/register
 * 
 * Registra um novo usuário
 * 
 * Body esperado:
 * {
 *   "name": "Maria",
 *   "email": "maria@example.com",
 *   "password": "senha123"
 * }
 * 
 * Resposta de sucesso (201):
 * {
 *   "success": true,
 *   "message": "Usuário registrado com sucesso!",
 *   "token": "eyJhbGciOiJIUzI1NiIs...",
 *   "user": {
 *     "id": "507f1f77bcf86cd799439011",
 *     "name": "Maria",
 *     "email": "maria@example.com"
 *   }
 * }
 */
router.post('/register', register);

/**
 * ROTA: POST /api/auth/login
 * 
 * Faz login de um usuário existente
 * 
 * Body esperado:
 * {
 *   "email": "maria@example.com",
 *   "password": "senha123"
 * }
 * 
 * Resposta de sucesso (200):
 * {
 *   "success": true,
 *   "message": "Login realizado com sucesso!",
 *   "token": "eyJhbGciOiJIUzI1NiIs...",
 *   "user": {
 *     "id": "507f1f77bcf86cd799439011",
 *     "name": "Maria",
 *     "email": "maria@example.com"
 *   }
 * }
 */
router.post('/login', login);

module.exports = router;

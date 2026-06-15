/**
 * ARQUIVO: src/routes/taskRoutes.js
 * 
 * EXPLICAÇÃO:
 * Define as ROTAS (URLs) para operações com tarefas
 * 
 * ROTAS DEFINIDAS:
 * GET    /api/tasks      -> listar tarefas do usuário
 * GET    /api/tasks/:id  -> buscar tarefa específica
 * POST   /api/tasks      -> criar nova tarefa
 * PUT    /api/tasks/:id  -> atualizar tarefa
 * DELETE /api/tasks/:id  -> deletar tarefa
 * 
 * ⚠️ TODAS ESSAS ROTAS REQUEREM AUTENTICAÇÃO!
 * O middleware 'protect' verifica se o usuário tem um token válido
 */

const express = require('express');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Aplica o middleware 'protect' em TODAS as rotas de tarefas
// Assim, todas precisam de um token válido para funcionar
router.use(protect);

/**
 * ROTA: GET /api/tasks
 * 
 * Lista todas as tarefas do usuário autenticado
 * 
 * Header obrigatório:
 * Authorization: Bearer SEU_TOKEN_JWT
 * 
 * Resposta de sucesso (200):
 * {
 *   "success": true,
 *   "count": 3,
 *   "message": "Tarefas recuperadas com sucesso",
 *   "data": [
 *     {
 *       "_id": "507f1f77bcf86cd799439011",
 *       "title": "Estudar Node.js",
 *       "description": "Aprender sobre middlewares",
 *       "completed": false,
 *       "priority": "alta",
 *       "user": "507f1f77bcf86cd799439012",
 *       "createdAt": "2024-06-15T10:30:00.000Z",
 *       "updatedAt": "2024-06-15T10:30:00.000Z"
 *     },
 *     // ... mais tarefas
 *   ]
 * }
 */
router.get('/', getTasks);

/**
 * ROTA: GET /api/tasks/:id
 * 
 * Busca uma tarefa específica pelo ID
 * 
 * Parâmetros:
 * :id = ID da tarefa (MongoDB ObjectId)
 * 
 * Header obrigatório:
 * Authorization: Bearer SEU_TOKEN_JWT
 * 
 * Exemplo: GET /api/tasks/507f1f77bcf86cd799439011
 * 
 * Resposta de sucesso (200):
 * {
 *   "success": true,
 *   "message": "Tarefa recuperada com sucesso",
 *   "data": { ... tarefa ... }
 * }
 */
router.get('/:id', getTaskById);

/**
 * ROTA: POST /api/tasks
 * 
 * Cria uma nova tarefa para o usuário autenticado
 * 
 * Header obrigatório:
 * Authorization: Bearer SEU_TOKEN_JWT
 * 
 * Body esperado:
 * {
 *   "title": "Fazer projeto de portfólio",
 *   "description": "Criar TODO API com Node.js",
 *   "priority": "alta"
 * }
 * 
 * Resposta de sucesso (201):
 * {
 *   "success": true,
 *   "message": "Tarefa criada com sucesso!",
 *   "data": {
 *     "_id": "507f1f77bcf86cd799439011",
 *     "title": "Fazer projeto de portfólio",
 *     "description": "Criar TODO API com Node.js",
 *     "completed": false,
 *     "priority": "alta",
 *     "user": "507f1f77bcf86cd799439012",
 *     "createdAt": "2024-06-15T10:30:00.000Z",
 *     "updatedAt": "2024-06-15T10:30:00.000Z"
 *   }
 * }
 */
router.post('/', createTask);

/**
 * ROTA: PUT /api/tasks/:id
 * 
 * Atualiza uma tarefa existente
 * 
 * Parâmetros:
 * :id = ID da tarefa
 * 
 * Header obrigatório:
 * Authorization: Bearer SEU_TOKEN_JWT
 * 
 * Body esperado (todos campos são opcionais):
 * {
 *   "title": "Novo título",
 *   "description": "Nova descrição",
 *   "completed": true,
 *   "priority": "média"
 * }
 * 
 * Exemplo: PUT /api/tasks/507f1f77bcf86cd799439011
 * 
 * Resposta de sucesso (200):
 * {
 *   "success": true,
 *   "message": "Tarefa atualizada com sucesso!",
 *   "data": { ... tarefa atualizada ... }
 * }
 */
router.put('/:id', updateTask);

/**
 * ROTA: DELETE /api/tasks/:id
 * 
 * Deleta uma tarefa
 * 
 * Parâmetros:
 * :id = ID da tarefa
 * 
 * Header obrigatório:
 * Authorization: Bearer SEU_TOKEN_JWT
 * 
 * Exemplo: DELETE /api/tasks/507f1f77bcf86cd799439011
 * 
 * Resposta de sucesso (200):
 * {
 *   "success": true,
 *   "message": "Tarefa deletada com sucesso!"
 * }
 */
router.delete('/:id', deleteTask);

module.exports = router;

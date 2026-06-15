/**
 * ARQUIVO: src/controllers/taskController.js
 * 
 * EXPLICAÇÃO:
 * Contém a LÓGICA de negócio para operações com tarefas
 * 
 * Operações CRUD:
 * - CREATE: Criar nova tarefa (POST)
 * - READ: Listar/buscar tarefas (GET)
 * - UPDATE: Editar tarefa (PUT)
 * - DELETE: Deletar tarefa (DELETE)
 * 
 * Cada função recebe req (requisição) e res (resposta)
 */

const Task = require('../models/Task');

/**
 * LISTAR TODAS AS TAREFAS DO USUÁRIO
 * 
 * GET /api/tasks
 * Header: Authorization: Bearer TOKEN
 * 
 * Retorna todas as tarefas do usuário autenticado
 * Ordenadas por data de criação (mais recentes primeiro)
 */
const getTasks = async (req, res) => {
  try {
    // req.user.id vem do middleware de autenticação
    const userId = req.user.id;

    // Busca todas as tarefas do usuário
    // Ordena por createdAt em ordem decrescente (mais recentes primeiro)
    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      message: 'Tarefas recuperadas com sucesso',
      data: tasks,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar tarefas',
      error: error.message,
    });
  }
};

/**
 * BUSCAR UMA TAREFA ESPECÍFICA
 * 
 * GET /api/tasks/:id
 * Header: Authorization: Bearer TOKEN
 * 
 * Retorna apenas uma tarefa pelo ID
 */
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params; // ID da tarefa na URL
    const userId = req.user.id; // ID do usuário no token

    // Busca a tarefa e verifica se pertence ao usuário
    const task = await Task.findById(id);

    // Se tarefa não existe
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarefa não encontrada',
      });
    }

    // Se tarefa não pertence ao usuário (segurança)
    if (task.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para acessar esta tarefa',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tarefa recuperada com sucesso',
      data: task,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar tarefa',
      error: error.message,
    });
  }
};

/**
 * CRIAR NOVA TAREFA
 * 
 * POST /api/tasks
 * Header: Authorization: Bearer TOKEN
 * Body: { title, description, priority }
 * 
 * Cria uma nova tarefa para o usuário autenticado
 */
const createTask = async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    const userId = req.user.id;

    // Validação
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, forneça um título para a tarefa',
      });
    }

    // Cria nova tarefa
    const task = await Task.create({
      title,
      description,
      priority,
      user: userId, // Associa ao usuário
      completed: false, // Tarefa começa como não concluída
    });

    res.status(201).json({
      success: true,
      message: 'Tarefa criada com sucesso!',
      data: task,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar tarefa',
      error: error.message,
    });
  }
};

/**
 * ATUALIZAR TAREFA
 * 
 * PUT /api/tasks/:id
 * Header: Authorization: Bearer TOKEN
 * Body: { title, description, priority, completed }
 * 
 * Atualiza os dados de uma tarefa existente
 */
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, description, priority, completed } = req.body;

    // Busca a tarefa
    let task = await Task.findById(id);

    // Se não existe
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarefa não encontrada',
      });
    }

    // Verifica permissão
    if (task.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para atualizar esta tarefa',
      });
    }

    // Atualiza os campos fornecidos
    // Se o campo não foi fornecido, mantém o valor anterior
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority) task.priority = priority;
    if (completed !== undefined) task.completed = completed;

    // Salva a tarefa atualizada
    task = await task.save();

    res.status(200).json({
      success: true,
      message: 'Tarefa atualizada com sucesso!',
      data: task,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar tarefa',
      error: error.message,
    });
  }
};

/**
 * DELETAR TAREFA
 * 
 * DELETE /api/tasks/:id
 * Header: Authorization: Bearer TOKEN
 * 
 * Remove uma tarefa do banco de dados
 */
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Busca a tarefa
    const task = await Task.findById(id);

    // Se não existe
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarefa não encontrada',
      });
    }

    // Verifica permissão
    if (task.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para deletar esta tarefa',
      });
    }

    // Delete (Mongoose)
    await Task.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Tarefa deletada com sucesso!',
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar tarefa',
      error: error.message,
    });
  }
};

// Exporta as funções
module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};

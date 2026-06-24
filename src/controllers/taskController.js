const Task = require('../models/Task');

const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, priority, completed, search, sort } = req.query;

    const filter = { user: userId };

    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (completed !== undefined) filter.completed = completed === 'true';
    if (search) filter.title = { $regex: search, $options: 'i' };

    let sortOption = { createdAt: -1 };
    if (sort === 'priority') sortOption = { priority: 1, createdAt: -1 };
    if (sort === 'dueDate') sortOption = { dueDate: 1, createdAt: -1 };
    if (sort === 'title') sortOption = { title: 1 };

    const tasks = await Task.find(filter).sort(sortOption);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao buscar tarefas', error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findById(id);

    if (!task) return res.status(404).json({ success: false, message: 'Tarefa não encontrada' });
    if (task.user.toString() !== userId) return res.status(403).json({ success: false, message: 'Sem permissão' });

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao buscar tarefa', error: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, priority, category, dueDate } = req.body;
    const userId = req.user.id;

    if (!title) return res.status(400).json({ success: false, message: 'Forneça um título' });

    const task = await Task.create({
      title,
      description,
      priority,
      category,
      dueDate: dueDate || null,
      user: userId,
      completed: false,
    });

    res.status(201).json({ success: true, message: 'Tarefa criada!', data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao criar tarefa', error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, description, priority, category, dueDate, completed } = req.body;

    let task = await Task.findById(id);

    if (!task) return res.status(404).json({ success: false, message: 'Tarefa não encontrada' });
    if (task.user.toString() !== userId) return res.status(403).json({ success: false, message: 'Sem permissão' });

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority) task.priority = priority;
    if (category) task.category = category;
    if (dueDate !== undefined) task.dueDate = dueDate || null;
    if (completed !== undefined) task.completed = completed;

    task = await task.save();

    res.status(200).json({ success: true, message: 'Tarefa atualizada!', data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao atualizar tarefa', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findById(id);

    if (!task) return res.status(404).json({ success: false, message: 'Tarefa não encontrada' });
    if (task.user.toString() !== userId) return res.status(403).json({ success: false, message: 'Sem permissão' });

    await Task.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Tarefa deletada!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao deletar tarefa', error: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const total = await Task.countDocuments({ user: userId });
    const completed = await Task.countDocuments({ user: userId, completed: true });
    const pending = total - completed;

    const byPriority = await Task.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const byCategory = await Task.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const overdue = await Task.countDocuments({
      user: userId,
      completed: false,
      dueDate: { $lt: new Date(), $ne: null }
    });

    res.status(200).json({
      success: true,
      data: { total, completed, pending, overdue, byPriority, byCategory }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao buscar estatísticas', error: error.message });
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask, getStats };

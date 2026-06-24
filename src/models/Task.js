/**
 * ARQUIVO: src/models/Task.js
 * 
 * EXPLICAÇÃO:
 * Define a ESTRUTURA de uma tarefa no banco de dados.
 * 
 * Uma tarefa pertence a um usuário (relacionamento 1 para muitos)
 * Quando um usuário é deletado, suas tarefas também são deletadas
 * 
 * Campos:
 * - title: título da tarefa
 * - description: descrição (opcional)
 * - completed: se foi completada ou não
 * - user: referência ao ID do usuário que criou a tarefa
 * - createdAt: data de criação (automático)
 */

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Por favor, forneça um título para a tarefa'],
      trim: true,
      maxlength: [100, 'O título não pode ter mais de 100 caracteres'],
    },
    description: {
      type: String,
      maxlength: [500, 'A descrição não pode ter mais de 500 caracteres'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['baixa', 'média', 'alta'],
      default: 'média',
    },
    category: {
      type: String,
      enum: ['trabalho', 'estudos', 'pessoal', 'outros'],
      default: 'outros',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// HOOK: Quando uma tarefa é buscada com populate('user')
// Apenas retorna nome e email do usuário (não retorna senha)
taskSchema.pre(/^find/, function (next) {
  // Se a query inclui 'user', popula apenas nome e email
  if (this._mongooseOptions.lean) {
    return next();
  }
  next();
});

// Cria e exporta o modelo Task
module.exports = mongoose.model('Task', taskSchema);

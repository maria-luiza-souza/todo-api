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

// Define a estrutura de uma tarefa
const taskSchema = new mongoose.Schema(
  {
    // Título da tarefa (obrigatório)
    title: {
      type: String,
      required: [true, 'Por favor, forneça um título para a tarefa'],
      trim: true,
      maxlength: [100, 'O título não pode ter mais de 100 caracteres'],
    },

    // Descrição da tarefa (opcional, mas recomendado)
    description: {
      type: String,
      maxlength: [500, 'A descrição não pode ter mais de 500 caracteres'],
    },

    // Status da tarefa (concluída ou não)
    completed: {
      type: Boolean,
      default: false, // Por padrão, tarefa começa como não concluída
    },

    // Prioridade (baixa, média, alta)
    priority: {
      type: String,
      enum: ['baixa', 'média', 'alta'], // Só aceita esses valores
      default: 'média',
    },

    // Relacionamento: qual usuário criou esta tarefa
    // type: mongoose.Schema.Types.ObjectId = referencia outro documento
    // ref: 'User' = referencia o modelo User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    // timestamps: true cria automaticamente createdAt e updatedAt
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

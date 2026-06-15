/**
 * ARQUIVO: src/models/User.js
 * 
 * EXPLICAÇÃO:
 * Este arquivo define a ESTRUTURA de um usuário no banco de dados.
 * 
 * O que é um Schema?
 * - É como um "molde" ou "contrato" do que um usuário deve ter
 * - Define quais campos são obrigatórios, tipos de dados, validações, etc.
 * 
 * Campos do usuário:
 * - name: nome do usuário (string, obrigatório)
 * - email: email único (string, obrigatório, sem duplicatas)
 * - password: senha criptografada (string, obrigatório)
 * - createdAt: data de criação (automático)
 * 
 * Este modelo será usado para:
 * - Validar dados antes de salvar no banco
 * - Criptografar senhas
 * - Criar queries ao banco de dados
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define a estrutura de um usuário
const userSchema = new mongoose.Schema(
  {
    // Campo: nome
    // type: String = deve ser texto
    // required: true = obrigatório
    name: {
      type: String,
      required: [true, 'Por favor, forneça um nome'],
      trim: true, // Remove espaços em branco
    },

    // Campo: email (único - não pode ter 2 usuários com mesmo email)
    email: {
      type: String,
      required: [true, 'Por favor, forneça um email'],
      unique: true, // Garante que não há emails duplicados
      lowercase: true, // Converte para minúsculas
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Por favor, forneça um email válido', // Validação de formato
      ],
    },

    // Campo: senha (será criptografada)
    password: {
      type: String,
      required: [true, 'Por favor, forneça uma senha'],
      minlength: 6, // Senha deve ter mínimo 6 caracteres
      select: false, // NÃO retorna a senha quando faz busca (por segurança)
    },
  },
  {
    // timestamps: true cria automaticamente createdAt e updatedAt
    timestamps: true,
  }
);

// HOOK: Função que executa ANTES de salvar um usuário
// Criptografa a senha antes de armazenar no banco
userSchema.pre('save', async function (next) {
  // Se a senha não foi modificada, pula
  if (!this.isModified('password')) return next();

  try {
    // Gera um "salt" aleatório (8 rodadas de criptografia)
    const salt = await bcrypt.genSalt(8);
    
    // Criptografa a senha
    this.password = await bcrypt.hash(this.password, salt);
    
    // Continua com o processo de salvamento
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar senhas
// Usado no login para verificar se a senha está correta
userSchema.methods.matchPassword = async function (passwordInformed) {
  // bcrypt.compare() compara a senha informada com a criptografada no banco
  return await bcrypt.compare(passwordInformed, this.password);
};

// Cria e exporta o modelo User
// User será a coleção no MongoDB
module.exports = mongoose.model('User', userSchema);

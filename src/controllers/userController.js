/**
 * ARQUIVO: src/controllers/userController.js
 * 
 * EXPLICAÇÃO:
 * Controllers = Contêm a LÓGICA de negócio
 * 
 * Este arquivo tem funções para:
 * - Registrar um novo usuário (register)
 * - Fazer login de um usuário (login)
 * 
 * FLUXO:
 * 1. Routes chama uma função do controller
 * 2. Controller valida os dados
 * 3. Controller salva no banco (Model)
 * 4. Controller retorna resposta (JSON)
 * 
 * Separar em controllers torna o código mais organizado!
 */

const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Função para gerar um JWT token
// O token contém o ID do usuário e expira em 24 horas
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, // Payload (dados que ficam no token)
    process.env.JWT_SECRET, // Chave secreta (no .env)
    { expiresIn: process.env.JWT_EXPIRES_IN } // Tempo de expiração
  );
};

/**
 * REGISTRAR NOVO USUÁRIO
 * 
 * POST /api/auth/register
 * Body: { name, email, password }
 * 
 * Processo:
 * 1. Recebe dados do usuário
 * 2. Valida se email já existe
 * 3. Cria novo usuário (senha é criptografada automaticamente)
 * 4. Gera um token JWT
 * 5. Retorna usuário + token
 */
const register = async (req, res) => {
  try {
    // Extrai dados do corpo da requisição
    const { name, email, password } = req.body;

    // Validação básica
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, forneça nome, email e senha',
      });
    }

    // Verifica se o email já existe no banco
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado',
      });
    }

    // Cria novo usuário
    // A senha é criptografada automaticamente (hook no modelo)
    const user = await User.create({
      name,
      email,
      password,
    });

    // Gera token JWT para o novo usuário
    const token = generateToken(user._id);

    // Retorna resposta de sucesso
    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar usuário',
      error: error.message,
    });
  }
};

/**
 * LOGIN DE USUÁRIO
 * 
 * POST /api/auth/login
 * Body: { email, password }
 * 
 * Processo:
 * 1. Recebe email e senha
 * 2. Busca o usuário no banco
 * 3. Compara a senha informada com a criptografada no banco
 * 4. Se correto, gera um token JWT
 * 5. Retorna usuário + token
 */
const login = async (req, res) => {
  try {
    // Extrai dados do corpo da requisição
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, forneça email e senha',
      });
    }

    // Busca o usuário no banco
    // .select('+password') porque a senha é oculta por padrão
    const user = await User.findOne({ email }).select('+password');

    // Se usuário não existe
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos',
      });
    }

    // Verifica se a senha está correta
    // matchPassword() é um método do modelo User
    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos',
      });
    }

    // Gera token JWT
    const token = generateToken(user._id);

    // Retorna resposta de sucesso
    res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login',
      error: error.message,
    });
  }
};

// Exporta as funções para serem usadas nas routes
module.exports = { register, login };

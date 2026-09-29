const User = require('../models/User');
const jwt = require('jsonwebtoken');

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não configurado');
  }

  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

const handleAuthError = (error, res, action) => {
  console.error(`[auth:${action}]`, {
    name: error.name,
    code: error.code,
    message: error.message,
  });

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Este e-mail já está cadastrado',
    });
  }

  if (error.name === 'ValidationError') {
    const firstError = Object.values(error.errors || {})[0];
    return res.status(400).json({
      success: false,
      message: firstError?.message || 'Dados inválidos',
    });
  }

  if (error.message === 'JWT_SECRET não configurado') {
    return res.status(500).json({
      success: false,
      message: 'Serviço de autenticação não configurado. Verifique as variáveis de ambiente.',
    });
  }

  return res.status(500).json({
    success: false,
    message: `Erro ao ${action === 'register' ? 'registrar usuário' : 'fazer login'}`,
  });
};

const register = async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, forneça nome, e-mail e senha',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'A senha deve ter pelo menos 6 caracteres',
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: 'Este e-mail já está cadastrado',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
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
    return handleAuthError(error, res, 'register');
  }
};

const login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, forneça e-mail e senha',
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'E-mail ou senha incorretos',
      });
    }

    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'E-mail ou senha incorretos',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
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
    return handleAuthError(error, res, 'login');
  }
};

module.exports = { register, login };

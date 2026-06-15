/**
 * ARQUIVO: src/middleware/auth.js
 * 
 * EXPLICAÇÃO:
 * Middleware = Função que executa ANTES da rota ser processada
 * 
 * Este middleware faz:
 * 1. Verifica se o usuário tem um token JWT válido
 * 2. Decodifica o token para pegar o ID do usuário
 * 3. Coloca o ID do usuário na requisição (req.user)
 * 4. Permite que a rota continue (next())
 * 
 * SE não há token ou token é inválido:
 * - Retorna erro 401 (não autorizado)
 * 
 * FLUXO:
 * Cliente faz requisição com header "Authorization: Bearer TOKEN"
 *   ↓
 * Middleware extrai o token
 *   ↓
 * Decodifica e verifica se é válido
 *   ↓
 * Se válido: coloca usuario ID na requisição e continua
 * Se inválido: retorna erro 401
 */

const jwt = require('jsonwebtoken');

// Middleware de proteção - verifica autenticação
const protect = (req, res, next) => {
  let token;

  // 1. EXTRAIR O TOKEN DO HEADER
  // O token vem no header "Authorization: Bearer TOKEN"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Pega o token (ignora a palavra "Bearer")
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. VERIFICAR SE EXISTE TOKEN
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Não autorizado. Token não encontrado.',
    });
  }

  try {
    // 3. DECODIFICAR E VERIFICAR O TOKEN
    // Se o token é válido, jwt.verify() retorna o payload (dados do token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. COLOCAR ID DO USUÁRIO NA REQUISIÇÃO
    // Agora as rotas podem acessar req.user.id
    req.user = {
      id: decoded.id,
    };

    // 5. CONTINUAR PARA A PRÓXIMA FUNÇÃO
    next();

  } catch (error) {
    // Se o token é inválido ou expirou
    return res.status(401).json({
      success: false,
      message: 'Não autorizado. Token inválido ou expirado.',
      error: error.message,
    });
  }
};

// Exporta o middleware
module.exports = { protect };

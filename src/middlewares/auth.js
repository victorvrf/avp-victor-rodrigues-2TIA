// ============================================================
// MIDDLEWARE DE AUTENTICAÇÃO (AV2)
// ============================================================
// Este arquivo contém a "chave secreta" usada para assinar o
// token e o middleware que verifica se a requisição possui um
// token/crachá digital válido.
// ============================================================

const jwt = require('jsonwebtoken');

// Chave secreta usada para assinar e validar o token.
// Em produção ela ficaria em uma variável de ambiente (.env).
const JWT_SECRET = process.env.JWT_SECRET || 'segredo-av2-desenvolvimento-web';

/**
 * Middleware: verifica o token enviado no cabeçalho "Authorization".
 *
 * Formato esperado no cabeçalho:
 *   Authorization: Bearer <token>
 *
 * - Sem token        -> 401 Acesso negado.
 * - Token inválido   -> 401 Acesso negado.
 * - Token válido     -> passa para a próxima função da rota.
 */
function autenticar(req, res, next) {
  const cabecalho = req.headers['authorization'];

  // O token normalmente chega no formato "Bearer <token>"
  const token = cabecalho && cabecalho.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      erro: 'Acesso negado. Informe um token no cabeçalho Authorization.'
    });
  }

  try {
    // Se o token for válido, decodifica-o e guarda os dados do usuário
    const usuario = jwt.verify(token, JWT_SECRET);
    req.usuario = usuario;
    next();
  } catch (err) {
    return res.status(401).json({
      erro: 'Token inválido ou expirado.'
    });
  }
}

module.exports = { autenticar, JWT_SECRET };
const prisma = require('../config/prisma');

/**
 * Camada de dados (Model) para Autenticação / Login.
 * Encapsula as operações de banco usadas no fluxo de login.
 */

/**
 * Busca um usuário pelo e-mail, incluindo a senha (necessária para comparação com bcrypt).
 * Usado no fluxo de login.
 * @param {string} email - E-mail do usuário
 * @returns {Promise<Object|null>} Usuário com senha, ou null se não encontrado
 */
async function buscarPorEmailComSenha(email) {
  return await prisma.usuarios.findUnique({
    where: { email: email.trim().toLowerCase() }
  });
}

module.exports = { buscarPorEmailComSenha };

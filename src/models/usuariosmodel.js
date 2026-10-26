const prisma = require('../prisma/prisma');

/**
 * Camada de dados (Model) para Usuários.
 * Encapsula todas as operações de persistência com Prisma.
 * O Controller não acessa o Prisma diretamente — chama os métodos aqui.
 */

/**
 * Cadastra um novo usuário no banco de dados.
 * @param {Object} dados - { nome, email, senha } (senha já deve vir com hash do controller)
 * @returns {Promise<Object>} Usuário criado (inclui o campo senha)
 */
async function criar(dados) {
  return await prisma.usuarios.create({
    data: {
      nome: dados.nome.trim(),
      email: dados.email.trim().toLowerCase(),
      senha: dados.senha
    }
  });
}

/**
 * Lista todos os usuários cadastrados (sem expor as senhas).
 * @returns {Promise<Array>} Lista de usuários com id, nome e email
 */
async function listar() {
  return await prisma.usuarios.findMany({
    select: { id: true, nome: true, email: true },
    orderBy: { id: 'asc' }
  });
}

/**
 * Busca um usuário pelo e-mail (inclui a senha, usado para login e verificação de duplicidade).
 * @param {string} email - E-mail do usuário
 * @returns {Promise<Object|null>} Usuário encontrado ou null
 */
async function buscarPorEmail(email) {
  return await prisma.usuarios.findUnique({
    where: { email: email.trim().toLowerCase() }
  });
}

/**
 * Busca um usuário pelo ID (sem expor a senha).
 * @param {number} id - ID do usuário
 * @returns {Promise<Object|null>} Usuário encontrado ou null
 */
async function buscarPorId(id) {
  return await prisma.usuarios.findUnique({
    where: { id },
    select: { id: true, nome: true, email: true }
  });
}

module.exports = { criar, listar, buscarPorEmail, buscarPorId };

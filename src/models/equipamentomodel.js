const prisma = require('../prisma/prisma');

/**
 * Camada de dados (Model) para Equipamentos.
 * Encapsula todas as operações de persistência com Prisma.
 * O Controller não acessa o Prisma diretamente — chama os métodos aqui.
 */

async function criar(dados) {
  return await prisma.equipamentos.create({
    data: {
      nome: dados.nome,
      categoria: dados.categoria,
      fabricante: dados.fabricante,
      quantidade: dados.quantidade,
      status: dados.status || 'disponível'
    }
  });
}

async function listar() {
  return await prisma.equipamentos.findMany({
    orderBy: { id: 'asc' }
  });
}

async function buscarPorId(id) {
  return await prisma.equipamentos.findUnique({
    where: { id }
  });
}

async function atualizar(id, dados) {
  const dadosParaAtualizar = {};
  if (dados.nome !== undefined) dadosParaAtualizar.nome = dados.nome;
  if (dados.categoria !== undefined) dadosParaAtualizar.categoria = dados.categoria;
  if (dados.fabricante !== undefined) dadosParaAtualizar.fabricante = dados.fabricante;
  if (dados.quantidade !== undefined) dadosParaAtualizar.quantidade = dados.quantidade;
  if (dados.status !== undefined) dadosParaAtualizar.status = dados.status;

  return await prisma.equipamentos.update({
    where: { id },
    data: dadosParaAtualizar
  });
}

async function remover(id) {
  const equipamento = await prisma.equipamentos.findUnique({
    where: { id }
  });
  if (!equipamento) return null;

  await prisma.equipamentos.delete({
    where: { id }
  });
  return equipamento;
}

module.exports = { criar, listar, buscarPorId, atualizar, remover };

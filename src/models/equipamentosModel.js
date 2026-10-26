import prisma from "../config/prisma.js";

export function criar({ nome, categoria, fabricante, quantidade, status = "disponível" }) {
  return prisma.equipamentos.create({
    data: {
      nome,
      categoria,
      fabricante,
      quantidade,
      status,
    },
  });
}

export function listar() {
  return prisma.equipamentos.findMany({
    orderBy: { id: "asc" },
  });
}

export function buscarPorId(id) {
  return prisma.equipamentos.findUnique({
    where: { id },
  });
}

export function atualizar(id, { nome, categoria, fabricante, quantidade, status }) {
  const dadosParaAtualizar = {};
  if (nome !== undefined) dadosParaAtualizar.nome = nome;
  if (categoria !== undefined) dadosParaAtualizar.categoria = categoria;
  if (fabricante !== undefined) dadosParaAtualizar.fabricante = fabricante;
  if (quantidade !== undefined) dadosParaAtualizar.quantidade = quantidade;
  if (status !== undefined) dadosParaAtualizar.status = status;

  return prisma.equipamentos.update({
    where: { id },
    data: dadosParaAtualizar,
  });
}

export function remover(id) {
  return prisma.equipamentos.delete({
    where: { id },
  });
}

import prisma from "../config/prisma.js";

export function criar({ nome, email, senha }) {
  return prisma.usuarios.create({
    data: {
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      senha,
    },
  });
}

export function listar() {
  return prisma.usuarios.findMany({
    select: { id: true, nome: true, email: true },
    orderBy: { id: "asc" },
  });
}

export function buscarPorEmail(email) {
  return prisma.usuarios.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
}

export function buscarPorId(id) {
  return prisma.usuarios.findUnique({
    where: { id },
    select: { id: true, nome: true, email: true },
  });
}

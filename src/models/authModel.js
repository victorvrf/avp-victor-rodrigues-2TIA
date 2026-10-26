import prisma from "../config/prisma.js";

export function buscarPorEmailComSenha(email) {
  return prisma.usuarios.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
}

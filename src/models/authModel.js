import prisma from "../config/prisma.js";

export function buscarPorEmail(email) {
  return prisma.usuarios.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
}

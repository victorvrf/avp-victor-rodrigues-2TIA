import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as authModel from "../models/authModel.js";
import { JWT_SECRET } from "../middlewares/autenticar.js";
import { respostaPublica } from "./usuariosController.js";

export async function entrar(req, res) {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ erro: "Informe email e senha." });

  const usuario = await authModel.buscarPorEmailComSenha(email);
  if (!usuario || !(bcrypt.compareSync(senha, usuario.senha))) {
    return res.status(401).json({ erro: "E-mail ou senha incorretos." });
  }

  const token = jwt.sign(
    { id: usuario.id, nome: usuario.nome, email: usuario.email },
    JWT_SECRET,
    { expiresIn: "10h" }
  );

  return res.json({ mensagem: "Login realizado com sucesso.", token, usuario: respostaPublica(usuario) });
}
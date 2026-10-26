import bcrypt from "bcrypt";
import * as usuarioModel from "../models/usuariosmodel.js";

export function respostaPublica(usuario) {
  return { id: usuario.id, nome: usuario.nome, email: usuario.email };
}

function validarCadastro({ nome, email, senha }) {
  if (!nome || !email || !senha) return "Os campos nome, email e senha são obrigatórios.";
  if (typeof nome !== "string" || nome.trim().length < 2) return "O nome deve ter pelo menos 2 caracteres.";
  if (typeof email !== "string" || !/\S+@\S+\.\S+/.test(email)) return "Informe um e-mail válido.";
  if (typeof senha !== "string" || senha.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
  return null;
}

export function criar(req, res) {
  const erro = validarCadastro(req.body);
  if (erro) return res.status(400).json({ erro });

  const { nome, email, senha } = req.body;
  const existente = usuarioModel.buscarPorEmail(email);
  if (existente) return res.status(409).json({ erro: "E-mail já cadastrado." });

  const usuario = usuarioModel.criar({
    nome: nome.trim(),
    email: email.trim().toLowerCase(),
    senha: bcrypt.hashSync(senha, 10),
  });

  return res.status(201).json(respostaPublica(usuario));
}

export function listar(req, res) {
  const usuarios = usuarioModel.listar();
  return res.json(usuarios);
}
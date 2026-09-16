// ============================================================
// ROTAS DE USUÁRIOS (AV2)
// ============================================================
// Cadastro de usuários com senha protegida por bcrypt e listagem
// dos usuários (sem expor a senha).
//
// Montado em: /usuarios  (veja src/app.js)
// ============================================================

const express = require('express');
const bcrypt = require('bcrypt');
const { autenticar } = require('../middlewares/auth');
const { usuarios, gerarIdUsuario } = require('../data/database');

const router = express.Router();

/**
 * POST /usuarios
 * Cadastra um novo usuário. A senha é criptografada com bcrypt.
 */
router.post('/', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({
      erro: 'Os campos nome, email e senha são obrigatórios.'
    });
  }

  // Evita que dois usuários usem o mesmo e-mail
  const existente = usuarios.find((u) => u.email === email);
  if (existente) {
    return res.status(400).json({ erro: 'E-mail já cadastrado.' });
  }

  try {
    // Criptografa a senha antes de guardar (salt de 10 rodadas)
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = {
      id: gerarIdUsuario(),
      nome,
      email,
      senha: senhaCriptografada
    };

    usuarios.push(usuario);

    // Retorna o usuário sem expor a senha criptografada
    res.status(201).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    });
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno ao cadastrar o usuário.' });
  }
});

/**
 * GET /usuarios
 * Lista os usuários cadastrados (exige token). Sem expor a senha.
 */
router.get('/', autenticar, (req, res) => {
  const lista = usuarios.map((u) => ({ id: u.id, nome: u.nome, email: u.email }));
  res.json(lista);
});

module.exports = router;

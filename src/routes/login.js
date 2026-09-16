// ============================================================
// ROTA DE LOGIN (AV2)
// ============================================================
// Recebe email e senha, confere a senha com o bcrypt e devolve
// um token JWT (crachá digital) que libera as rotas protegidas.
//
// Montado em: /login  (veja src/app.js)
// ============================================================

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middlewares/auth');
const { usuarios } = require('../data/database');

const router = express.Router();

/**
 * POST /login
 * Recebe email e senha e, se corretos, devolve um token (JWT).
 */
router.post('/', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Informe email e senha.' });
  }

  const usuario = usuarios.find((u) => u.email === email);

  if (!usuario) {
    return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
  }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

  if (!senhaCorreta) {
    return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
  }

  // Gera o token/crachá digital válido por 10 horas
  const token = jwt.sign(
    { id: usuario.id, nome: usuario.nome, email: usuario.email },
    JWT_SECRET,
    { expiresIn: '10h' }
  );

  res.json({
    mensagem: 'Login realizado com sucesso.',
    token,
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
  });
});

module.exports = router;

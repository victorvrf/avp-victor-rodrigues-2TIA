const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authModel = require('../models/authModel');
const { JWT_SECRET } = require('../middlewares/autenticar');
const { respostaPublica } = require('./usuariosController');

async function entrar(req, res) {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ erro: 'Informe email e senha.' });

  const usuario = await authModel.buscarPorEmailComSenha(email);
  if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
    return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
  }

  const token = jwt.sign(
    { id: usuario.id, nome: usuario.nome, email: usuario.email },
    JWT_SECRET,
    { expiresIn: '10h' }
  );

  return res.json({ mensagem: 'Login realizado com sucesso.', token, usuario: respostaPublica(usuario) });
}

module.exports = { entrar };
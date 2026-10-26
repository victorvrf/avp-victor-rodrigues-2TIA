// ============================================================
// ROTAS DE USUÁRIOS (AV2)
// ============================================================
// Cadastro de usuários com senha protegida por bcrypt e listagem
// dos usuários (sem expor a senha).
//
// Montado em: /usuarios  (veja src/app.js)
// ============================================================

const express = require('express');
const { autenticar } = require('../middlewares/auth');
const controller = require('../controllers/usuariosController');

const router = express.Router();

/**
 * POST /usuarios
 * Cadastra um novo usuário. A senha é criptografada com bcrypt.
 */
router.post('/', controller.criar);

/**
 * GET /usuarios
 * Lista os usuários cadastrados (exige token). Sem expor a senha.
 */
router.get('/', autenticar, controller.listar);

module.exports = router;

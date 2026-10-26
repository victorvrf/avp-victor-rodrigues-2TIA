// ============================================================
// ROTA DE LOGIN (AV2)
// ============================================================
// Recebe email e senha, confere a senha com o bcrypt e devolve
// um token JWT (crachá digital) que libera as rotas protegidas.
//
// Montado em: /auth  (veja server.js)
// ============================================================

const express = require('express');
const controller = require('../controllers/authController');

const router = express.Router();

/**
 * POST /login
 * Recebe email e senha e, se corretos, devolve um token (JWT).
 */
router.post('/', controller.entrar);

module.exports = router;

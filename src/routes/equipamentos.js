// ============================================================
// ROTAS DE EQUIPAMENTOS (AV1)
// ============================================================
// CRUD completo de equipamentos de segurança.
//
// A partir da AV2, TODAS as rotas deste arquivo estão protegidas
// pelo middleware de autenticação (token/crachá digital), conforme
// o requisito: "as rotas criadas na AV1 deverão receber uma camada
// de proteção".
//
// Montado em: /equipamentos  (veja src/app.js)
// ============================================================

const express = require('express');
const { autenticar } = require('../middlewares/auth');
const controller = require('../controllers/equipamentosController');

const router = express.Router();

/**
 * POST /equipamentos
 * Cadastra um novo equipamento. Exige token.
 */
router.post('/', autenticar, controller.criar);

/**
 * GET /equipamentos
 * Lista todos os equipamentos. Exige token.
 */
router.get('/', autenticar, controller.listar);

/**
 * GET /equipamentos/:id
 * Busca um equipamento específico pelo ID. Exige token.
 */
router.get('/:id', autenticar, controller.buscarPorId);

/**
 * PUT /equipamentos/:id
 * Edita um equipamento existente. Exige token.
 */
router.put('/:id', autenticar, controller.atualizar);

/**
 * DELETE /equipamentos/:id
 * Exclui um equipamento pelo ID. Exige token.
 */
router.delete('/:id', autenticar, controller.remover);

module.exports = router;

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
const { equipamentos, gerarIdEquipamento } = require('../data/database');

const router = express.Router();

/**
 * POST /equipamentos
 * Cadastra um novo equipamento. Exige token.
 */
router.post('/', autenticar, (req, res) => {
  const { nome, categoria, fabricante, quantidade, status } = req.body;

  // Verifica se os dados necessários foram enviados
  if (!nome || !categoria || !fabricante) {
    return res.status(400).json({
      erro: 'Os campos nome, categoria e fabricante são obrigatórios.'
    });
  }

  if (quantidade === undefined || quantidade === null) {
    return res.status(400).json({
      erro: 'O campo quantidade é obrigatório.'
    });
  }

  // A quantidade precisa ser um número (número de equipamentos)
  if (typeof quantidade !== 'number' || Number.isNaN(quantidade)) {
    return res.status(400).json({
      erro: 'O campo quantidade deve ser um número.'
    });
  }

  const equipamento = {
    id: gerarIdEquipamento(),
    nome,
    categoria,
    fabricante,
    quantidade,
    status: status || 'disponível'
  };

  equipamentos.push(equipamento);

  res.status(201).json(equipamento);
});

/**
 * GET /equipamentos
 * Lista todos os equipamentos. Exige token.
 */
router.get('/', autenticar, (req, res) => {
  res.json(equipamentos);
});

/**
 * GET /equipamentos/:id
 * Busca um equipamento específico pelo ID. Exige token.
 */
router.get('/:id', autenticar, (req, res) => {
  const id = Number(req.params.id);
  const equipamento = equipamentos.find((e) => e.id === id);

  if (!equipamento) {
    return res.status(404).json({ erro: 'Equipamento não encontrado.' });
  }

  res.json(equipamento);
});

/**
 * PUT /equipamentos/:id
 * Edita um equipamento existente. Exige token.
 */
router.put('/:id', autenticar, (req, res) => {
  const id = Number(req.params.id);
  const equipamento = equipamentos.find((e) => e.id === id);

  if (!equipamento) {
    return res.status(404).json({ erro: 'Equipamento não encontrado.' });
  }

  const { nome, categoria, fabricante, quantidade, status } = req.body;

  // Se a quantidade foi enviada, ela precisa ser um número
  if (quantidade !== undefined && (typeof quantidade !== 'number' || Number.isNaN(quantidade))) {
    return res.status(400).json({ erro: 'O campo quantidade deve ser um número.' });
  }

  // Atualiza somente os campos enviados
  if (nome !== undefined) equipamento.nome = nome;
  if (categoria !== undefined) equipamento.categoria = categoria;
  if (fabricante !== undefined) equipamento.fabricante = fabricante;
  if (quantidade !== undefined) equipamento.quantidade = quantidade;
  if (status !== undefined) equipamento.status = status;

  res.json(equipamento);
});

/**
 * DELETE /equipamentos/:id
 * Exclui um equipamento pelo ID. Exige token.
 */
router.delete('/:id', autenticar, (req, res) => {
  const id = Number(req.params.id);
  const indice = equipamentos.findIndex((e) => e.id === id);

  if (indice === -1) {
    return res.status(404).json({ erro: 'Equipamento não encontrado.' });
  }

  const removido = equipamentos.splice(indice, 1)[0];
  res.json({ mensagem: 'Equipamento removido com sucesso.', equipamento: removido });
});

module.exports = router;

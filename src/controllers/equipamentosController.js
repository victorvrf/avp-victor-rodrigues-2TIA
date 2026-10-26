const equipamentoModel = require('../models/equipamentosModel');

function validarId(id) {
  const numero = Number(id);
  return Number.isInteger(numero) && numero > 0 ? numero : null;
}

function validarEquipamento(dados, parcial = false) {
  const camposTexto = ['nome', 'categoria', 'fabricante', 'status'];

  for (const campo of camposTexto) {
    if (dados[campo] !== undefined &&
      (typeof dados[campo] !== 'string' || dados[campo].trim().length === 0)) {
      return `O campo ${campo} deve ser um texto não vazio.`;
    }
  }

  if (!parcial && ['nome', 'categoria', 'fabricante', 'quantidade'].some((campo) => dados[campo] === undefined)) {
    return 'Os campos nome, categoria, fabricante e quantidade são obrigatórios.';
  }

  if (dados.quantidade !== undefined &&
    (!Number.isInteger(dados.quantidade) || dados.quantidade < 0)) {
    return 'O campo quantidade deve ser um número inteiro não negativo.';
  }

  return null;
}

async function criar(req, res) {
  const erro = validarEquipamento(req.body);
  if (erro) return res.status(400).json({ erro });

  const equipamento = await equipamentoModel.criar({
    nome: req.body.nome,
    categoria: req.body.categoria,
    fabricante: req.body.fabricante,
    quantidade: req.body.quantidade,
    status: req.body.status || 'disponível'
  });

  return res.status(201).json(equipamento);
}

async function listar(req, res) {
  const equipamentos = await equipamentoModel.listar();
  return res.json(equipamentos);
}

async function buscarPorId(req, res) {
  const id = validarId(req.params.id);
  if (!id) return res.status(400).json({ erro: 'ID inválido.' });

  const equipamento = await equipamentoModel.buscarPorId(id);
  if (!equipamento) return res.status(404).json({ erro: 'Equipamento não encontrado.' });

  return res.json(equipamento);
}

async function atualizar(req, res) {
  const id = validarId(req.params.id);
  if (!id) return res.status(400).json({ erro: 'ID inválido.' });

  const erro = validarEquipamento(req.body, true);
  if (erro) return res.status(400).json({ erro });

  const existente = await equipamentoModel.buscarPorId(id);
  if (!existente) return res.status(404).json({ erro: 'Equipamento não encontrado.' });

  const atualizado = await equipamentoModel.atualizar(id, {
    nome: req.body.nome,
    categoria: req.body.categoria,
    fabricante: req.body.fabricante,
    quantidade: req.body.quantidade,
    status: req.body.status
  });

  return res.json(atualizado);
}

async function remover(req, res) {
  const id = validarId(req.params.id);
  if (!id) return res.status(400).json({ erro: 'ID inválido.' });

  const removido = await equipamentoModel.remover(id);
  if (!removido) return res.status(404).json({ erro: 'Equipamento não encontrado.' });

  return res.json({ mensagem: 'Equipamento removido com sucesso.', equipamento: removido });
}

module.exports = { criar, listar, buscarPorId, atualizar, remover };
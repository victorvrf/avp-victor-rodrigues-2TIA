const express = require('express');

// Cria o servidor
const app = express();

// Permite receber dados no formato JSON
app.use(express.json());

// Lista em memória para armazenar os equipamentos
let equipamentos = [];

// Variável para gerar IDs únicos automaticamente
let proximoId = 1;

/**
 * POST /equipamentos
 * Cadastra um novo equipamento.
 */
app.post('/equipamentos', (req, res) => {
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

  // Cria o novo equipamento com ID único
  const equipamento = {
    id: proximoId,
    nome,
    categoria,
    fabricante,
    quantidade,
    status: status || 'disponível'
  };

  equipamentos.push(equipamento);
  proximoId++;

  res.status(201).json(equipamento);
});

/**
 * GET /equipamentos
 * Lista todos os equipamentos.
 */
app.get('/equipamentos', (req, res) => {
  res.json(equipamentos);
});

/**
 * GET /equipamentos/:id
 * Busca um equipamento específico pelo ID.
 */
app.get('/equipamentos/:id', (req, res) => {
  const id = Number(req.params.id);
  const equipamento = equipamentos.find((e) => e.id === id);

  if (!equipamento) {
    return res.status(404).json({ erro: 'Equipamento não encontrado.' });
  }

  res.json(equipamento);
});

/**
 * PUT /equipamentos/:id
 * Edita um equipamento existente.
 */
app.put('/equipamentos/:id', (req, res) => {
  const id = Number(req.params.id);
  const equipamento = equipamentos.find((e) => e.id === id);

  if (!equipamento) {
    return res.status(404).json({ erro: 'Equipamento não encontrado.' });
  }

  const { nome, categoria, fabricante, quantidade, status } = req.body;

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
 * Exclui um equipamento pelo ID.
 */
app.delete('/equipamentos/:id', (req, res) => {
  const id = Number(req.params.id);
  const indice = equipamentos.findIndex((e) => e.id === id);

  if (indice === -1) {
    return res.status(404).json({ erro: 'Equipamento não encontrado.' });
  }

  const removido = equipamentos.splice(indice, 1)[0];
  res.json({ mensagem: 'Equipamento removido com sucesso.', equipamento: removido });
});

// Inicia o servidor na porta 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
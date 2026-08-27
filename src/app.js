// ============================================================
// SISTEMA DE GERENCIAMENTO DE EQUIPAMENTOS DE SEGURANÇA
// Projeto AV1 -> evolução para AV2 (Desenvolvimento de Websites)
// ============================================================

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configuração do Swagger (documentação da API)
const { swaggerSpec, swaggerUi } = require('./docs/swagger');

// Middleware de autenticação e chave secreta do token
const { autenticar, JWT_SECRET } = require('./middlewares/auth');

// Cria o servidor
const app = express();

// Permite receber dados no formato JSON
app.use(express.json());

// ============================================================
// BANCO DE DADOS EM MEMÓRIA (somente enquanto o servidor ativo)
// ============================================================

// Lista de equipamentos (AV1) — já inicia com alguns cadastrados
let equipamentos = [
  {
    id: 1,
    nome: 'Câmera IP',
    categoria: 'Monitoramento',
    fabricante: 'Intelbras',
    quantidade: 10,
    status: 'disponível'
  },
  {
    id: 2,
    nome: 'Roteador',
    categoria: 'Rede',
    fabricante: 'TP-Link',
    quantidade: 5,
    status: 'disponível'
  },
  {
    id: 3,
    nome: 'Sensor de Presença',
    categoria: 'Segurança',
    fabricante: 'Positivo',
    quantidade: 8,
    status: 'em manutenção'
  }
];

// Variável para gerar IDs de equipamento automaticamente
let proximoEquipamentoId = 4;

// Lista de usuários (AV2)
let usuarios = [];

// Variável para gerar IDs de usuário automaticamente
let proximoUsuarioId = 1;

// ============================================================
// SWAGGER — documentação interativa da API
// Acesso: http://localhost:3000/api-docs
// ============================================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ============================================================
// UPLOAD DE IMAGENS (usando Multer)
// ============================================================

// Cria a pasta uploads/ caso ela ainda não exista
const pastaUpload = path.join(__dirname, 'uploads');
if (!fs.existsSync(pastaUpload)) {
  fs.mkdirSync(pastaUpload, { recursive: true });
}

// Define onde e com que nome o arquivo será salvo
const armazenamento = multer.diskStorage({
  destination: (req, file, cb) => cb(null, pastaUpload),
  filename: (req, file, cb) => {
    const nomeLimpo = file.originalname.replace(/[\s]+/g, '_');
    cb(null, Date.now() + '-' + nomeLimpo);
  }
});

// Configura o Multer com limite de tamanho (5 MB) e filtro de tipo
const uploadMulter = multer({
  storage: armazenamento,
  limits: { fileSize: 5 * 1024 * 1024 }, // máximo 5 megabytes
  fileFilter: (req, file, cb) => {
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
    if (tiposPermitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Formato de arquivo inválido. Envie apenas imagens: JPEG, PNG, GIF, WebP ou BMP.'));
    }
  }
});
// ============================================================
// ROTAS DE USUÁRIOS E LOGIN (AV2)
// ============================================================

/**
 * POST /usuarios
 * Cadastra um novo usuário. A senha é criptografada com bcrypt.
 */
app.post('/usuarios', async (req, res) => {
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
      id: proximoUsuarioId,
      nome,
      email,
      senha: senhaCriptografada
    };

    usuarios.push(usuario);
    proximoUsuarioId++;

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
app.get('/usuarios', autenticar, (req, res) => {
  const lista = usuarios.map((u) => ({ id: u.id, nome: u.nome, email: u.email }));
  res.json(lista);
});

/**
 * POST /login
 * Recebe email e senha e, se corretos, devolve um token (JWT).
 */
app.post('/login', async (req, res) => {
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
// ============================================================
// CRUD DE EQUIPAMENTOS (AV1) — AGORA PROTEGIDO POR TOKEN (AV2)
// ============================================================

/**
 * POST /equipamentos
 * Cadastra um novo equipamento. Exige token.
 */
app.post('/equipamentos', autenticar, (req, res) => {
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

  const equipamento = {
    id: proximoEquipamentoId,
    nome,
    categoria,
    fabricante,
    quantidade,
    status: status || 'disponível'
  };

  equipamentos.push(equipamento);
  proximoEquipamentoId++;

  res.status(201).json(equipamento);
});

/**
 * GET /equipamentos
 * Lista todos os equipamentos. Exige token.
 */
app.get('/equipamentos', autenticar, (req, res) => {
  res.json(equipamentos);
});

/**
 * GET /equipamentos/:id
 * Busca um equipamento específico pelo ID. Exige token.
 */
app.get('/equipamentos/:id', autenticar, (req, res) => {
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
app.put('/equipamentos/:id', autenticar, (req, res) => {
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
 * Exclui um equipamento pelo ID. Exige token.
 */
app.delete('/equipamentos/:id', autenticar, (req, res) => {
  const id = Number(req.params.id);
  const indice = equipamentos.findIndex((e) => e.id === id);

  if (indice === -1) {
    return res.status(404).json({ erro: 'Equipamento não encontrado.' });
  }

  const removido = equipamentos.splice(indice, 1)[0];
  res.json({ mensagem: 'Equipamento removido com sucesso.', equipamento: removido });
});
// ============================================================
// UPLOAD DE IMAGEM (AV2) — exige token
// ============================================================

/**
 * POST /upload
 * Recebe um arquivo de imagem (campo "imagem") e o salva em uploads/.
 * Exige token. Aceita apenas imagens de até 5 MB.
 */
app.post('/upload', autenticar, (req, res) => {
  uploadMulter.single('imagem')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ erro: 'Arquivo muito grande. O limite máximo é 5 MB.' });
      }
      return res.status(400).json({ erro: err.message });
    }

    if (!req.file) {
      return res.status(400).json({
        erro: 'Nenhum arquivo enviado. Use o campo "imagem" com multipart/form-data.'
      });
    }

    return res.status(201).json({
      mensagem: 'Imagem enviada com sucesso.',
      caminhoArquivo: req.file.path,
      nomeArquivo: req.file.filename,
      tamanhoBytes: req.file.size
    });
  });
});

// ============================================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================================

// Inicia o servidor na porta 3000 (ou na definida em PORT)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/api-docs`);
});
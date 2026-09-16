// ============================================================
// SISTEMA DE GERENCIAMENTO DE EQUIPAMENTOS DE SEGURANÇA
// Projeto AV1 -> evolução para AV2 (Desenvolvimento de Websites)
// ============================================================
// Este é o arquivo PRINCIPAL (ponto de entrada) da API.
//
// Responsabilidades deste arquivo:
//   1. Criar o servidor Express;
//   2. Ligar o middleware que lê JSON;
//   3. Montar a documentação (Swagger) em /api-docs;
//   4. Montar as rotas de cada recurso (pasta src/routes);
//   5. Iniciar o servidor na porta definida.
//
// A LÓGICA de cada rota fica nos arquivos da pasta src/routes:
//   src/routes/equipamentos.js -> CRUD da AV1 (protegido por token)
//   src/routes/usuarios.js     -> cadastro/listagem de usuários
//   src/routes/login.js        -> login e geração do token JWT
//   src/routes/upload.js       -> upload de imagem
//
// Os dados em memória ficam em src/data/database.js e a
// autenticação em src/middlewares/auth.js.
// ============================================================

// Carrega as variáveis do arquivo .env (PORT, JWT_SECRET) para
// process.env. Precisa ser a PRIMEIRA linha executada.
require('dotenv/config');

const express = require('express');

// Configuração do Swagger (documentação da API)
const { swaggerSpec, swaggerUi } = require('./docs/swagger');

// Rotas da aplicação
const rotasEquipamentos = require('./routes/equipamentos');
const rotasUsuarios = require('./routes/usuarios');
const rotasLogin = require('./routes/login');
const rotasUpload = require('./routes/upload');

// Cria o servidor
const app = express();

// Permite receber dados no formato JSON
app.use(express.json());

// ============================================================
// SWAGGER — documentação interativa da API
// Acesso: http://localhost:3000/api-docs
// ============================================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ============================================================
// ROTA RAIZ — mostra que o servidor está no ar
// ============================================================
app.get('/', (req, res) => {
  res.json({
    mensagem: 'Servidor Express funcionando!',
    projeto: 'Sistema de Gerenciamento de Equipamentos de Segurança',
    disciplina: 'Desenvolvimento de Websites',
    documentacao: '/api-docs'
  });
});

// ============================================================
// ROTAS DA AV2 (usuários, login e upload)
// ============================================================
app.use('/usuarios', rotasUsuarios);
app.use('/login', rotasLogin);
app.use('/upload', rotasUpload);

// ============================================================
// ROTAS DA AV1 (CRUD de equipamentos — protegidas por token)
// ============================================================
app.use('/equipamentos', rotasEquipamentos);

// ============================================================
// TRATAMENTO DE ERROS
// ============================================================
// Estas duas "rotas" ficam por ÚLTIMO, de propósito.
//
// 1) Rota não encontrada -> devolve 404 em JSON (e não HTML);
// 2) Erro interno         -> devolve 500 em JSON, inclusive
//    quando o cliente envia um JSON malformado.
//
// Assim TODAS as respostas da API são sempre JSON, como pede a
// proposta ("as respostas são retornadas em JSON").
// ============================================================

// 1) Qualquer rota que não existe cai aqui -> 404 em JSON
app.use((req, res) => {
  res.status(404).json({
    erro: `Rota não encontrada: ${req.method} ${req.originalUrl}`
  });
});

// 2) Tratamento de erros (precisa ter os 4 parâmetros) -> JSON
app.use((err, req, res, next) => {
  // JSON inválido enviado no corpo da requisição
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido no corpo da requisição.' });
  }

  console.error(err);

  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

// ============================================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================================

// Inicia o servidor na porta definida no .env (ou 3000)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/api-docs`);
});

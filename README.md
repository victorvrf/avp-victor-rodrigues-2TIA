# Sistema de Gerenciamento de Equipamentos de Segurança

API REST desenvolvida em **Node.js + Express** para cadastrar e gerenciar equipamentos de segurança, com **persistência de dados** via **Prisma ORM + MySQL**, **cadastro/login de usuários** com **JWT** e proteção de rotas.

> Trabalho **AV1** (Backend) da disciplina **Desenvolvimento de Websites** — evolução direta do projeto do 3o bimestre.
> Os dados são persistidos em **banco de dados MySQL** através do **Prisma ORM**, permanecendo disponíveis após reinicialização do servidor.

---

## O que a AV1 implementa

- **Arquitetura MVC**: separação entre `src/routes/`, `src/controllers/` e acesso aos dados via Prisma
- **Banco de dados relacional**: MySQL com Prisma ORM (modelos `Equipamentos` e `Usuarios`)
- **CRUD completo de equipamentos**: cadastrar, listar, consultar por ID, atualizar e excluir — todos persistidos no banco
- **Cadastro de usuários**: validação de campos, senha com hash (`bcrypt`), e-mail único
- **Login**: verificação de credenciais e geração de **token JWT**
- **Middleware de autenticação**: protege rotas que exigem token válido
- **Upload de imagens** (`Multer`) com validação de tipo e tamanho (AV2)
- **Swagger** (documentação interativa em `/api-docs`)
- Rotas de equipamentos protegidas por autenticação (token)

---

## Tecnologias instaladas

| Tecnologia | Versão | Função |
|------------|--------|--------|
| Express | ^4.21.2 | Servidor HTTP e rotas |
| Prisma / @prisma/client | ^7.10.0 | ORM e cliente do banco de dados |
| bcrypt | ^6.0.0 | Criptografar a senha dos usuários |
| jsonwebtoken | ^9.0.3 | Gerar e validar o token JWT |
| dotenv | ^17.4.2 | Carregar variáveis de ambiente |
| multer | ^2.2.0 | Upload de arquivos (imagens) |
| swagger-ui-express | ^5.0.1 | Interface web do Swagger |
| swagger-jsdoc | ^6.3.0 | Montar a especificação OpenAPI |
| nodemon | ^3.1.14 | Reinício automático em desenvolvimento |

---

## Estrutura do projeto (MVC)

```
projeto/
├── prisma/
│   ├── schema.prisma        # Modelos do banco de dados (Equipamentos, Usuarios)
│   └── prisma.js            # Instância do PrismaClient
├── generated/prisma/        # Cliente Prisma gerado (não versionar)
├── src/
│   ├── app.js               # Ponto de entrada: cria servidor, conecta DB, monta rotas
│   ├── controllers/
│   │   ├── equipamentosController.js   # Regras de negócio + validações do CRUD
│   │   ├── usuariosController.js       # Cadastro e listagem de usuários
│   │   └── loginController.js          # Login e geração de JWT
│   ├── models/
│   │   ├── equipamentomodel.js         # Camada de dados (Prisma) para equipamentos
│   ├── usuariosmodel.js            # Camada de dados (Prisma) para usuários
│   └── loginmodel.js               # Camada de dados (Prisma) para autenticação/login
│   ├── routes/
│   │   ├── equipamentos.js   # Rotas do CRUD (protegidas por token)
│   │   ├── usuarios.js       # Cadastro/listagem de usuários
│   │   ├── login.js          # Login (gera JWT)
│   │   └── upload.js         # Upload de imagem (AV2)
│   ├── middlewares/
│   │   ├── auth.js           # Middleware de autenticação JWT
│   │   └── upload.js         # Middleware Multer (tipo + tamanho)
│   ├── docs/
│   │   └── swagger.js        # Configuração do Swagger (OpenAPI)
│   └── uploads/              # Imagens enviadas
├── insomnia/
│   └── insomnia.json         # Coleção de testes do Insomnia (importável)
├── .env.example              # Modelo das variáveis de ambiente
├── .env                      # Variáveis de ambiente locais (não versionar)
├── package.json
├── .gitignore
└── README.md
```

> `src/app.js` é o **ponto de entrada** (`npm start`). Ele carrega o `.env`, conecta ao banco via Prisma,
> monta o Swagger e registra as rotas de cada recurso.

---

## Como instalar e executar

### 1. Instalar as dependências

```powershell
npm install
```

### 2. Configurar o banco de dados MySQL

Você precisa de um servidor MySQL rodando localmente (ou remoto) e um banco criado.

Exemplo com MySQL local:

```powershell
# No MySQL, crie o banco e um usuário:
CREATE DATABASE dwb_victor_rodrigues_2ati;
CREATE USER 'usuario'@'localhost' IDENTIFIED BY 'senha';
GRANT ALL PRIVILEGES ON dwb_victor_rodrigues_2ati.* TO 'usuario'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configurar as variáveis de ambiente

Copie o arquivo de exemplo e ajuste os valores:

```powershell
copy .env.example .env
```

Edite o `.env` com os dados reais do seu banco MySQL:

```env
PORT=3000
JWT_SECRET=uma-chave-secreta-forte-e-dificil-de-adivinhar
DATABASE_URL="mysql://usuario:senha@localhost:3306/dwb_victor_rodrigues_2ati"
```

> O arquivo `.env` **não vai para o GitHub** (está no `.gitignore`).
> O `.env.example` serve de modelo e pode ser versionado sem credenciais reais.

### 4. Gerar o cliente Prisma

```powershell
npx prisma generate
```

### 5. Criar e executar as migrations no banco

```powershell
npx prisma migrate dev --name init
```

Este comando cria as tabelas `Equipamentos` e `Usuarios` no banco MySQL com base no `prisma/schema.prisma`.

### 6. Iniciar o servidor

```powershell
npm start
```

Para desenvolvimento com reinício automático (nodemon):

```powershell
npm run dev
```

O servidor ficará disponível em **http://localhost:3000**  
Swagger em **http://localhost:3000/api-docs**

---

## Rotas da AV1 (CRUD de equipamentos)

Abra no navegador: **http://localhost:3000/api-docs**

---

## Rotas da AV1 (CRUD de equipamentos)

> **Atenção:** agora essas rotas exigem um token válido (evolução da AV2).

| Método | Rota                    | Descrição                              |
|--------|-------------------------|----------------------------------------|
| POST   | `/equipamentos`          | Cadastra um novo equipamento           |
| GET    | `/equipamentos`          | Lista todos os equipamentos            |
| GET    | `/equipamentos/:id`      | Busca um equipamento pelo ID           |
| PUT    | `/equipamentos/:id`      | Edita um equipamento existente         |
| DELETE | `/equipamentos/:id`      | Exclui um equipamento pelo ID          |

---

## Rotas novas da AV2

| Método | Rota         | Descrição                            | Exige token? |
|--------|--------------|--------------------------------------|--------------|
| POST   | `/usuarios`  | Cadastra usuário (senha criptografada) | Não        |
| GET    | `/usuarios`  | Lista usuários (sem expor senha)      | Sim          |
| POST   | `/login`     | Faz login e retorna o token JWT       | Não          |
| POST   | `/upload`    | Envia uma imagem (até 5 MB)           | Sim          |
| GET    | `/api-docs`  | Documentação interativa (Swagger)     | Não          |

---

## Como cadastrar um usuário

**`POST /usuarios`** — não precisa de token.

**URL:** `http://localhost:3000/usuarios`
**Body (JSON):**
```json
{
  "nome": "Carlos Silva",
  "email": "carlos@email.com",
  "senha": "123456"
}
```

**Resposta (201):**
```json
{
  "id": 1,
  "nome": "Carlos Silva",
  "email": "carlos@email.com"
}
```

> A senha **não** aparece na resposta. Ela é guardada já criptografada com `bcrypt`.
---

## Como fazer login e obter o token

**`POST /login`**

**URL:** `http://localhost:3000/login`
**Body (JSON):**
```json
{
  "email": "carlos@email.com",
  "senha": "123456"
}
```

**Resposta (200):**
```json
{
  "mensagem": "Login realizado com sucesso.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC...",
  "usuario": { "id": 1, "nome": "Carlos Silva", "email": "carlos@email.com" }
}
```

- O `token` é um **JWT** (crachá digital) válido por **10 horas**.
- Guarde esse token para usar nas rotas protegidas.
- Se o e-mail/senha estiver errado, retorna `401`.

---

## Como usar o token no Insomnia

1. Abra `POST /login`, execute e copie o `token` retornado.
2. Em qualquer rota protegida (ex.: `GET /equipamentos`):
   - Aba **Authorization**.
   - Tipo **Bearer Token**.
   - Cole o token no campo **Token**.

> Isso envia o cabeçalho: `Authorization: Bearer <seu-token>`

**Exemplo sem token:** `GET /equipamentos` → `401 Acesso negado.`
**Com token válido:** `GET /equipamentos` → `200` com a lista.

---

## Como fazer upload de imagem

**`POST /upload`** — exige token. Aceita **apenas imagens (JPEG, PNG, GIF, WebP, BMP)** de até **5 MB**.

1. No Insomnia, use a requisição `POST http://localhost:3000/upload`.
2. O corpo já deve estar como **Multipart Form**.
3. O campo precisa se chamar **`imagem`** e ser do tipo **`File`** (não `Text`).
4. Clique em **Choose file** e selecione a imagem **`exemplos/foto-teste.png`** do projeto.
   > Use uma imagem de dentro da pasta do projeto: o Insomnia só tem permissão para ler
   > arquivos de pastas permitidas. Se você escolher um arquivo de `C:\Users\...\Pictures`,
   > pode aparecer o erro *"Insomnia cannot access the file... --dataFolders"*.
5. Informe o token na aba **Authorization** (Bearer Token).
6. ⚠️ **Não adicione o header `Content-Type` manualmente.** O Insomnia precisa montar esse
   cabeçalho sozinho, porque ele inclui um `boundary` (um separador aleatório) que o
   servidor usa para entender onde começa e termina o arquivo.

**Resposta (201):**
```json
{
  "mensagem": "Imagem enviada com sucesso.",
  "caminhoArquivo": "C:\\...\\src\\uploads\\1699999999999-foto.png",
  "nomeArquivo": "1699999999999-foto.png",
  "tamanhoBytes": 20480
}
```

> O arquivo é salvo na pasta `src/uploads/`.
> Arquivo que não for imagem → `400`. Arquivo acima de 5 MB → `400`.

---

## Importar a coleção pronta do Insomnia

O arquivo **`insomnia/insomnia.json`** já vem com **todas as requisições** prontas
(inclusive os testes de erro), organizadas em pastas:

| Pasta | Conteúdo |
|-------|----------|
| `AV2 - Autenticação` | Cadastrar Usuário, Login, Listar Usuários |
| `AV1 - Equipamentos` | Listar, Buscar por ID, Cadastrar, Atualizar e Excluir |
| `AV2 - Upload` | Upload de Imagem + testes de 401 e 400 |
| `AV2 - Documentação` | Swagger e Rota Raiz |
| `AV2 - Testes de Erro (401, 400 e 404)` | Todos os cenários de erro |

**Como importar:**

1. Abra o Insomnia.
2. `Application` → **Import** → **From File**.
3. Selecione o arquivo `insomnia/insomnia.json` do projeto.
4. Pronto: aparece a coleção **`avp-victor-rodrigues-2TIA`** (pode apagar a coleção antiga).

**O token é preenchido automaticamente:**

A variável `token` do ambiente usa um *template tag* que **lê o token da resposta do
request `Login`**. Ou seja:

1. Rode **`Cadastrar Usuário`** (só na primeira vez após ligar o servidor);
2. Rode **`Login`**;
3. Todas as rotas protegidas passam a usar o token sozinhas — **nunca mais expira no meio da apresentação**.

> Se preferir, também dá para colar o token na mão: `Ctrl+E` (Manage Environments) →
> variável `token` → cole o valor devolvido pelo Login.

> ⚠️ **E se o login der 401?** Verifique se o usuário foi cadastrado (os dados persistem no banco).
> Se não existir, rode **`Cadastrar Usuário`** antes do Login.

---

## Como acessar o Swagger

Abra **http://localhost:3000/api-docs** no navegador. Lá você encontra:

- Todas as rotas documentadas (método, URL e descrição).
- Botão **Try it out** para testar diretamente.
- Exemplos de requisição/resposta.
- Rotas protegidas indicam que exigem **Bearer Token**.
- Para usar as rotas protegidas, clique em **Authorize** e informe `Bearer <token>`.

---

## Mensagens de erro mais comuns

| Situação                                 | Status | Mensagem                                        |
|------------------------------------------|--------|------------------------------------------------|
| Faltou nome/email/senha no cadastro      | 400    | Os campos nome, email e senha são obrigatórios. |
| E-mail já cadastrado                     | 400    | E-mail já cadastrado.                           |
| E-mail ou senha errados no login         | 401    | E-mail ou senha incorretos.                     |
| Requisição sem token                     | 401    | Acesso negado. Informe um token...              |
| Token inválido ou expirado               | 401    | Token inválido ou expirado.                     |
| Faltaram campos no equipamento           | 400    | Os campos nome, categoria e fabricante...       |
| Quantidade não é número                  | 400    | O campo quantidade deve ser um número.          |
| JSON malformado enviado no corpo         | 400    | JSON inválido no corpo da requisição.           |
| Rota que não existe                      | 404    | Rota não encontrada: METODO /caminho            |
| Equipamento não encontrado               | 404    | Equipamento não encontrado.                     |
| Arquivo não é imagem                     | 400    | Formato de arquivo inválido...                  |
| Arquivo maior que 5 MB                   | 400    | Arquivo muito grande. O limite máximo é 5 MB.   |

---

## Critérios de avaliação da AV1

| Critério | Peso máximo | Onde está no código |
|----------|-------------|---------------------|
| Organização MVC (rotas, controllers, acesso a dados) | 1,0 | `src/routes/`, `src/controllers/`, `prisma/prisma.js` |
| Integração com banco/ORM (Prisma + MySQL) | 1,25 | `prisma/schema.prisma`, `prisma/prisma.js` |
| CRUD funcional (cadastro, consulta, atualização, exclusão) | 1,25 | `src/controllers/equipamentosController.js` |
| Cadastro, login e JWT (senha com hash, token, proteção de rotas) | 1,0 | `src/controllers/usuariosController.js`, `loginController.js`, `src/middlewares/auth.js` |
| Validações, testes e funcionamento geral | 0,5 | Controllers + Insomnia collection + este README |
| **Total** | **5,0** | |

---

## Resumo

- A **AV1** (CRUD de equipamentos com persistência) está implementada com **Prisma ORM + MySQL**, arquitetura **MVC** e **autenticação JWT**.
- Os dados persistem no banco mesmo após reiniciar o servidor.
- O cadastro de usuários é separado do CRUD de equipamentos, conforme exigido pela proposta.
- Rotas de alteração de dados (POST, PUT, DELETE) estão protegidas por token.
- O projeto está pronto para a **AV2** (interface React integrada à API).
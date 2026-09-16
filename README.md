# Sistema de Gerenciamento de Equipamentos de Segurança

API REST desenvolvida em **Node.js + Express** para cadastrar e gerenciar equipamentos de segurança.

> Trabalho **AV2** da disciplina **Desenvolvimento de Websites** — evolução direta do projeto da **AV1**.
> Os dados são armazenados **temporariamente em memória** (somente enquanto o servidor está ativo).

---

## O que a AV2 adicionou (além do CRUD da AV1)

- Cadastro de usuários com **senha criptografada** (`bcrypt`)
- **Login** com geração de **token JWT** (crachá digital)
- **Middleware** que protege as rotas de equipamentos (exige token)
- **Upload de imagens** (`Multer`) com validação de tipo e tamanho
- **Swagger** (documentação interativa em `/api-docs`)
- CRUD da **AV1** mantido e agora **protegido por autenticação**

---

## Tecnologias instaladas

| Tecnologia | Versão | Função |
|------------|--------|--------|
| Express | ^4.21.2 | Servidor HTTP e rotas |
| bcrypt | ^6.0.0 | Criptografar a senha dos usuários |
| jsonwebtoken | ^9.0.3 | Gerar e validar o token JWT |
| multer | ^2.2.0 | Upload de arquivos (imagens) |
| swagger-ui-express | ^5.0.1 | Interface web do Swagger |
| swagger-jsdoc | ^6.3.0 | Montar a especificação OpenAPI |

---

## Estrutura do projeto

A estrutura segue a sugestão da proposta da AV1/AV2 (`src/routes/`, `middlewares/`, `uploads/`, `docs/`, `app.js`):

```
projeto/
├── src/
│   ├── app.js                      # Cria o servidor e monta as rotas
│   ├── data/
│   │   └── database.js             # "Banco de dados" em memória (listas + IDs únicos)
│   ├── routes/                     # Rotas separadas por recurso
│   │   ├── equipamentos.js         # CRUD da AV1 (protegido por token)
│   │   ├── usuarios.js             # POST/GET de usuários (senha com bcrypt)
│   │   ├── login.js                # POST /login (gera o token JWT)
│   │   └── upload.js               # POST /upload (envio de imagem)
│   ├── middlewares/
│   │   ├── auth.js                 # Middleware de autenticação (token JWT)
│   │   └── upload.js               # Middleware do Multer (tipo + tamanho)
│   ├── docs/
│   │   └── swagger.js              # Configuração do Swagger (OpenAPI)
│   └── uploads/                    # Pasta onde as imagens são salvas
├── exemplos/
│   └── foto-teste.png              # Imagem usada no teste de upload
├── insomnia/
│   └── insomnia.json               # Coleção de testes do Insomnia (importável)
├── .env.example                    # Modelo das variáveis de ambiente
├── package.json
├── .gitignore
└── README.md
```

> O arquivo `src/app.js` é o **ponto de entrada** (`npm start`). Ele apenas cria o servidor,
> liga o Swagger e "monta" os arquivos da pasta `src/routes`.

---

## Como instalar e executar

### 1. Instalar as dependências

```bash
npm install
```

### 2. Configurar as variáveis de ambiente

Copie o arquivo de exemplo e ajuste os valores:

```bash
copy .env.example .env
```

Conteúdo do `.env`:

```
PORT=3000
JWT_SECRET=um-segredo-bem-dificil-de-adivinhar
```

> O arquivo `.env` **não vai para o GitHub** (está no `.gitignore`).
> Se ele não existir, o servidor ainda funciona usando a chave de desenvolvimento padrão do código.

### 3. Iniciar o servidor

```bash
npm start
```

Para desenvolvimento com reinício automático (nodemon):

```bash
npm run dev
```

O servidor fica disponível em: `http://localhost:3000`

### 4. Acessar o Swagger

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

> ⚠️ **E se o login der 401?** Os dados ficam em memória. Se você reiniciou o servidor,
> o usuário foi apagado — rode **`Cadastrar Usuário`** de novo antes do Login.

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

## Critérios da proposta da AV1/AV2 — onde está cada um

| Critério da proposta | Peso | Onde está no código |
|----------------------|------|---------------------|
| Estrutura do servidor e organização das rotas | 20% | `src/app.js` + `src/routes/` |
| Armazenamento em memória (lista de objetos, ID único) | 20% | `src/data/database.js` |
| Funcionamento completo do CRUD | 40% | `src/routes/equipamentos.js` |
| Validação no painel de testes (Insomnia/Postman) | 20% | Rotas documentadas abaixo |
| Cadastro e login | 20% | `src/routes/usuarios.js` + `src/routes/login.js` |
| Segurança de senhas com bcrypt | 20% | `bcrypt.hash` / `bcrypt.compare` em `usuarios.js` e `login.js` |
| Middleware e proteção de rotas | 25% | `src/middlewares/auth.js` (aplicado em `equipamentos.js` e `upload.js`) |
| Upload e validação de imagem | 20% | `src/routes/upload.js` + `src/middlewares/upload.js` |
| Documentação básica com Swagger | 15% | `src/docs/swagger.js` (acesso em `/api-docs`) |

---

## Resumo

- A **AV1** (CRUD de equipamentos) foi **mantida**, agora **protegida por token**.
- A **AV2** adicionou usuários, login JWT, middleware, upload e Swagger.
- Tudo sem banco de dados: os dados ficam em **memória** enquanto o servidor roda.
- O projeto continua simples e fácil de explicar em uma apresentação.
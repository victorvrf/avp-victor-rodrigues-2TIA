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

```
projeto/
├── src/
│   ├── app.js                  # Servidor e todas as rotas
│   ├── middlewares/
│   │   └── auth.js             # Middleware de autenticação (token)
│   ├── docs/
│   │   └── swagger.js          # Configuração do Swagger (OpenAPI)
│   └── uploads/                # Pasta onde as imagens são salvas
├── package.json
├── .gitignore
└── README.md
```

---

## Como instalar e executar

### 1. Instalar as dependências

```bash
npm install
```

### 2. Iniciar o servidor

```bash
npm start
```

Para desenvolvimento com reinício automático:

```bash
npm run dev
```

O servidor fica disponível em: `http://localhost:3000`

### 3. Acessar o Swagger

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

1. No Insomnia, crie a requisição `POST http://localhost:3000/upload`.
2. Altere o tipo do corpo para **Multipart Form**.
3. Adicione um campo chamado `imagem`.
4. Selecione um arquivo de imagem nesse campo.
5. Informe o token na aba **Authorization**.

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
| Equipamento não encontrado               | 404    | Equipamento não encontrado.                     |
| Arquivo não é imagem                     | 400    | Formato de arquivo inválido...                  |
| Arquivo maior que 5 MB                   | 400    | Arquivo muito grande. O limite máximo é 5 MB.   |

---

## Resumo

- A **AV1** (CRUD de equipamentos) foi **mantida**, agora **protegida por token**.
- A **AV2** adicionou usuários, login JWT, middleware, upload e Swagger.
- Tudo sem banco de dados: os dados ficam em **memória** enquanto o servidor roda.
- O projeto continua simples e fácil de explicar em uma apresentação.
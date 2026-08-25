# Sistema de Gerenciamento de Equipamentos de Segurança

API REST desenvolvida em **Node.js + Express** para cadastrar e gerenciar equipamentos de segurança.

> Trabalho AV1 da disciplina **Desenvolvimento de Websites**.
> Os dados são armazenados **temporariamente em memória** (somente enquanto o servidor está ativo).

---

## Tecnologias utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- JavaScript (sem TypeScript, sem banco de dados)

---

## Estrutura do projeto

```
projeto/
├── src/
│   └── app.js          # Arquivo principal com o servidor e as rotas
├── package.json        # Configurações e dependências do projeto
├── .gitignore          # Arquivos ignorados pelo Git
└── README.md           # Este arquivo de instruções
```

---

## Como executar o projeto

### 1. Instalar as dependências

Abra o terminal na pasta do projeto e execute:

```bash
npm install
```

> Isso instalará o Express e as demais dependências listadas no `package.json`.

### 2. Iniciar o servidor

```bash
npm start
```

O servidor ficará disponível em: `http://localhost:3000`

> Para desenvolvimento, com reinício automático ao alterar o código, use `npm run dev`.

### 3. Comando para encerrar o servidor

No terminal, pressione `Ctrl + C`.

---

## Endpoints da API

Abaixo estão todas as rotas da API para testar no **Insomnia** (ou Postman).

> Como a lista é mantida em memória, ao reiniciar o servidor os dados cadastrados são apagados.

### 1. Cadastrar um equipamento — `POST /equipamentos`

Cria um novo equipamento. O `id` é gerado automaticamente.

**URL:** `http://localhost:3000/equipamentos`
**Método:** `POST`
**Body (JSON):**

```json
{
  "nome": "Câmera IP",
  "categoria": "Monitoramento",
  "fabricante": "Intelbras",
  "quantidade": 10,
  "status": "disponível"
}
```

**Respostas esperadas:**
- `201 Created` — retorna o equipamento criado (com `id`).
- `400 Bad Request` — se faltar `nome`, `categoria`, `fabricante` ou `quantidade`.

> O campo `status` é opcional. Se não for enviado, assume o valor `"disponível"`.

---

### 2. Listar todos os equipamentos — `GET /equipamentos`

Retorna a lista completa dos equipamentos cadastrados.

**URL:** `http://localhost:3000/equipamentos`
**Método:** `GET`

**Resposta esperada:**

```json
[
  {
    "id": 1,
    "nome": "Câmera IP",
    "categoria": "Monitoramento",
    "fabricante": "Intelbras",
    "quantidade": 10,
    "status": "disponível"
  }
]
```

> Se não houver equipamentos, retorna uma lista vazia `[]`.

---

### 3. Buscar um equipamento pelo ID — `GET /equipamentos/:id`

Busca um equipamento específico.

**URL:** `http://localhost:3000/equipamentos/1`
**Método:** `GET`

**Respostas esperadas:**
- `200` — retorna o equipamento encontrado.
- `404 Not Found` — retorna `{ "erro": "Equipamento não encontrado." }` se o ID não existir.

---

### 4. Editar um equipamento — `PUT /equipamentos/:id`

Atualiza um equipamento existente. Envie somente os campos que deseja alterar.

**URL:** `http://localhost:3000/equipamentos/1`
**Método:** `PUT`

**Body (JSON):**

```json
{
  "quantidade": 5,
  "status": "em manutenção"
}
```

**Respostas esperadas:**
- `200` — retorna o equipamento atualizado.
- `404 Not Found` — se o ID não existir.

---

### 5. Excluir um equipamento — `DELETE /equipamentos/:id`

Remove um equipamento pelo ID.

**URL:** `http://localhost:3000/equipamentos/1`
**Método:** `DELETE`

**Respostas esperadas:**
- `200` — retorna `{ "mensagem": "Equipamento removido com sucesso.", "equipamento": {...} }`.
- `404 Not Found` — se o ID não existir.

---

## Exemplos de JSON para `POST` e `PUT`

**Exemplo de `POST`:**
```json
{
  "nome": "Detector de fumaça",
  "categoria": "Prevenção de incêndio",
  "fabricante": "Honeywell",
  "quantidade": 25,
  "status": "disponível"
}
```

**Exemplo de `PUT`:**
```json
{
  "quantidade": 8,
  "status": "em manutenção"
}
```

---

## Mensagens de erro

A API retorna mensagens de erro claras nos seguintes casos:

| Situação                                    | Status | Mensagem                                      |
|---------------------------------------------|--------|-----------------------------------------------|
| Faltam `nome`, `categoria` ou `fabricante`  | 400    | Os campos nome, categoria e fabricante são obrigatórios. |
| Faltou `quantidade` na criação              | 400    | O campo quantidade é obrigatório.             |
| ID não encontrado (`GET` / `PUT` / `DELETE`)| 404    | Equipamento não encontrado.                    |

---

## Resumo das rotas

| Método | Rota                  | Descrição                        |
|--------|-----------------------|----------------------------------|
| POST   | `/equipamentos`        | Cadastra um novo equipamento     |
| GET    | `/equipamentos`        | Lista todos os equipamentos      |
| GET    | `/equipamentos/:id`    | Busca um equipamento pelo ID     |
| PUT    | `/equipamentos/:id`    | Edita um equipamento existente   |
| DELETE | `/equipamentos/:id`    | Exclui um equipamento pelo ID    |

---

## Nota

Recursos como autenticação (login, JWT), banco de dados, upload de imagens e frontend **não estão implementados**, pois pertencem à **AV2**.
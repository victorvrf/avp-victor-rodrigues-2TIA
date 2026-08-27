// ============================================================
// SWAGGER (AV2)
// ============================================================
// Define a especificação OpenAPI da API e a configuração da
// interface gráfica. A documentação fica disponível em:
//
//   GET /api-docs
//
// Basta abrir essa URL no navegador.
// ============================================================

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sistema de Gerenciamento de Equipamentos de Segurança',
      version: '2.0.0',
      description:
        'API REST para gerenciar equipamentos de segurança. ' +
        'Evolução do projeto da AV1 para a AV2, com cadastro de usuários, ' +
        'login, token (JWT), proteção das rotas, upload de imagens e Swagger.'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local de desenvolvimento'
      }
    ],
    components: {
      // Esquema de segurança usado pelas rotas protegidas
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: []
};

const swaggerSpec = swaggerJsdoc(options);

// Adiciona o requisito de token (Bearer) às rotas protegidas
function comAuth(rotas) {
  return {
    ...rotas,
    security: [{ bearerAuth: [] }]
  };
}

swaggerSpec.paths = {
  '/usuarios': {
    post: {
      summary: 'Cadastra um novo usuário (não precisa de token)',
      description:
        'Recebe nome, email e senha. A senha é criptografada com bcrypt antes de ser guardada.',
      tags: ['Usuários'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['nome', 'email', 'senha'],
              properties: {
                nome: { type: 'string', example: 'Carlos Silva' },
                email: { type: 'string', example: 'carlos@email.com' },
                senha: { type: 'string', example: '123456' }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Usuário criado (sem expor a senha)',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: { id: 1, nome: 'Carlos Silva', email: 'carlos@email.com' }
              }
            }
          }
        },
        400: { description: 'Dados obrigatórios faltando ou e-mail já cadastrado' }
      }
    }
  },

  '/login': {
    post: {
      summary: 'Faz login e retorna um token JWT (crachá digital)',
      tags: ['Autenticação'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'senha'],
              properties: {
                email: { type: 'string', example: 'carlos@email.com' },
                senha: { type: 'string', example: '123456' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Login com sucesso. Retorna o token.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: {
                  mensagem: 'Login realizado com sucesso.',
                  token: 'eyJhbGciOiJIUzI1NiIs...',
                  usuario: { id: 1, nome: 'Carlos Silva', email: 'carlos@email.com' }
                }
              }
            }
          }
        },
        401: { description: 'E-mail ou senha incorretos' }
      }
    }
  },
'/equipamentos': comAuth({
    post: {
      summary: 'Cadastra um novo equipamento (exige token)',
      tags: ['Equipamentos'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['nome', 'categoria', 'fabricante', 'quantidade'],
              properties: {
                nome: { type: 'string', example: 'Alarme' },
                categoria: { type: 'string', example: 'Segurança' },
                fabricante: { type: 'string', example: 'Intelbras' },
                quantidade: { type: 'number', example: 5 },
                status: { type: 'string', example: 'disponível' }
              }
            }
          }
        }
      },
      responses: {
        201: { description: 'Equipamento criado com sucesso' },
        400: { description: 'Dados obrigatórios faltando' },
        401: { description: 'Acesso negado (sem token válido)' }
      }
    },
    get: {
      summary: 'Lista todos os equipamentos (exige token)',
      tags: ['Equipamentos'],
      responses: {
        200: {
          description: 'Lista de equipamentos',
          content: {
            'application/json': {
              schema: { type: 'array', items: { type: 'object' } }
            }
          }
        },
        401: { description: 'Acesso negado (sem token válido)' }
      }
    }
  }),

  '/equipamentos/{id}': comAuth({
    get: {
      summary: 'Busca um equipamento pelo ID (exige token)',
      tags: ['Equipamentos'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer', example: 1 }
        }
      ],
      responses: {
        200: { description: 'Equipamento encontrado' },
        404: { description: 'Equipamento não encontrado' },
        401: { description: 'Acesso negado (sem token válido)' }
      }
    },
    put: {
      summary: 'Edita um equipamento existente (exige token)',
      tags: ['Equipamentos'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer', example: 1 }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                nome: { type: 'string' },
                categoria: { type: 'string' },
                fabricante: { type: 'string' },
                quantidade: { type: 'number' },
                status: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Equipamento atualizado' },
        404: { description: 'Equipamento não encontrado' },
        401: { description: 'Acesso negado (sem token válido)' }
      }
    },
    delete: {
      summary: 'Exclui um equipamento pelo ID (exige token)',
      tags: ['Equipamentos'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer', example: 1 }
        }
      ],
      responses: {
        200: { description: 'Equipamento removido com sucesso' },
        404: { description: 'Equipamento não encontrado' },
        401: { description: 'Acesso negado (sem token válido)' }
      }
    }
  }),

  '/upload': comAuth({
    post: {
      summary: 'Envia uma imagem (exige token)',
      description:
        'Aceita apenas imagens (JPEG, PNG, GIF, WebP, BMP) de até 5 MB. ' +
        'Use o tipo multipart/form-data no Insomnia/Postman.',
      tags: ['Upload'],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                imagem: {
                  type: 'string',
                  format: 'binary',
                  description: 'Arquivo de imagem a ser enviado'
                }
              }
            }
          }
        }
      },
      responses: {
        201: { description: 'Imagem enviada com sucesso' },
        400: { description: 'Arquivo inválido ou muito grande' },
        401: { description: 'Acesso negado (sem token válido)' }
      }
    }
  })
};

module.exports = { swaggerSpec, swaggerUi };
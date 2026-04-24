const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Receitas da Vó API',
    version: '0.2.0',
    description: 'API do sistema Receitas da Vó para autenticação, consulta de receitas, interações de usuário e CRUD de receitas com regras administrativas.'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Ambiente local'
    }
  ],
  tags: [
    { name: 'Health', description: 'Verificação de disponibilidade da API' },
    { name: 'Autenticação', description: 'Cadastro e login de usuários' },
    { name: 'Receitas', description: 'Consulta e CRUD de receitas' },
    { name: 'Interações', description: 'Favoritos, comentários e avaliações' }
  ],
  paths: {
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'Verifica se a API está disponível',
        responses: {
          200: {
            description: 'API disponível',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthResponse' }
              }
            }
          }
        }
      }
    },
    '/api/auth/register': {
      post: {
        tags: ['Autenticação'],
        summary: 'Cadastra um visitante como usuário comum',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'Usuário cadastrado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserResponse' }
              }
            }
          },
          400: { $ref: '#/components/responses/BadRequest' },
          409: { $ref: '#/components/responses/Conflict' }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Autenticação'],
        summary: 'Realiza login de usuário',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Login realizado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' }
              }
            }
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' }
        }
      }
    },
    '/api/recipes': {
      get: {
        tags: ['Receitas'],
        summary: 'Lista receitas ativas em formato de prévia',
        parameters: [
          {
            name: 'search',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            description: 'Termo para buscar no título ou resumo da receita'
          },
          {
            name: 'category',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            description: 'Categoria da receita'
          }
        ],
        responses: {
          200: {
            description: 'Lista de receitas retornada com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RecipeListResponse' }
              }
            }
          }
        }
      },
      post: {
        tags: ['Receitas'],
        summary: 'Publica uma nova receita',
        description: 'Operação do CRUD de receitas. Permitida apenas para usuários com perfil admin.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RecipeInput' }
            }
          }
        },
        responses: {
          201: {
            description: 'Receita publicada com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RecipeResponse' }
              }
            }
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' }
        }
      }
    },
    '/api/recipes/{id}': {
      get: {
        tags: ['Receitas'],
        summary: 'Consulta detalhes de uma receita',
        description: 'Visitantes recebem apenas a prévia. Usuários autenticados recebem a receita completa. Receitas removidas por soft delete não são retornadas.',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/RecipeId' }],
        responses: {
          200: {
            description: 'Receita encontrada',
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    { $ref: '#/components/schemas/RecipePreviewDetailsResponse' },
                    { $ref: '#/components/schemas/RecipeCompleteDetailsResponse' }
                  ]
                }
              }
            }
          },
          404: { $ref: '#/components/responses/NotFound' }
        }
      },
      put: {
        tags: ['Receitas'],
        summary: 'Atualiza uma receita existente',
        description: 'Operação do CRUD de receitas. Permitida apenas para usuários com perfil admin.',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/RecipeId' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RecipeInput' }
            }
          }
        },
        responses: {
          200: {
            description: 'Receita atualizada com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RecipeResponse' }
              }
            }
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      },
      delete: {
        tags: ['Receitas'],
        summary: 'Exclui uma receita com soft delete',
        description: 'Operação do CRUD de receitas. Permitida apenas para usuários com perfil admin. A receita não é removida fisicamente do banco JSON.',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/RecipeId' }],
        responses: {
          200: {
            description: 'Receita marcada como removida',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SoftDeleteRecipeResponse' }
              }
            }
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      }
    },
    '/api/recipes/{id}/favorite': {
      post: {
        tags: ['Interações'],
        summary: 'Adiciona uma receita aos favoritos do usuário autenticado',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/RecipeId' }],
        responses: {
          200: {
            description: 'Receita favoritada com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/FavoritesIdsResponse' }
              }
            }
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      }
    },
    '/api/me/favorites': {
      get: {
        tags: ['Interações'],
        summary: 'Lista receitas favoritadas pelo usuário autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Favoritos retornados com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/FavoritesResponse' }
              }
            }
          },
          401: { $ref: '#/components/responses/Unauthorized' }
        }
      }
    },
    '/api/recipes/{id}/comments': {
      post: {
        tags: ['Interações'],
        summary: 'Adiciona comentário em uma receita',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/RecipeId' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CommentRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'Comentário criado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CommentResponse' }
              }
            }
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      }
    },
    '/api/recipes/{id}/ratings': {
      post: {
        tags: ['Interações'],
        summary: 'Avalia uma receita',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/RecipeId' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RatingRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'Avaliação criada com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RatingResponse' }
              }
            }
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'Token'
      }
    },
    parameters: {
      RecipeId: {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'integer', example: 1 },
        description: 'Identificador da receita'
      }
    },
    responses: {
      BadRequest: {
        description: 'Requisição inválida',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' }
          }
        }
      },
      Unauthorized: {
        description: 'Autenticação obrigatória ou credenciais inválidas',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' }
          }
        }
      },
      Forbidden: {
        description: 'Usuário sem permissão para executar a ação',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' }
          }
        }
      },
      Conflict: {
        description: 'Conflito de dados',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' }
          }
        }
      },
      NotFound: {
        description: 'Recurso não encontrado',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' }
          }
        }
      }
    },
    schemas: {
      HealthResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'ok' },
          app: { type: 'string', example: 'Receitas da Vó' }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Recurso não encontrado.' }
        }
      },
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Nova Guardiã' },
          email: { type: 'string', format: 'email', example: 'nova.guardiao@example.com' },
          password: { type: 'string', example: 'senha123' }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'usuario@receitasdavo.com' },
          password: { type: 'string', example: 'usuario123' }
        }
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 2 },
          name: { type: 'string', example: 'Guardião da Memória' },
          email: { type: 'string', example: 'usuario@receitasdavo.com' },
          role: { type: 'string', enum: ['admin', 'user'], example: 'user' },
          favorites: {
            type: 'array',
            items: { type: 'integer' },
            example: []
          }
        }
      },
      UserResponse: {
        type: 'object',
        properties: {
          user: { $ref: '#/components/schemas/User' }
        }
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'token-2-1710000000000' },
          user: { $ref: '#/components/schemas/User' }
        }
      },
      RecipePreview: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Bolo de Fubá da Vó Lurdes' },
          category: { type: 'string', example: 'Bolos' },
          summary: { type: 'string', example: 'Receita de fim de tarde, com cheiro de café passado e mesa cheia.' }
        }
      },
      Recipe: {
        allOf: [
          { $ref: '#/components/schemas/RecipePreview' },
          {
            type: 'object',
            properties: {
              successChecklist: {
                type: 'array',
                items: { type: 'string' },
                example: ['Separe todos os ingredientes antes de começar.']
              },
              steps: {
                type: 'array',
                items: { type: 'string' },
                example: ['Misture os ingredientes secos.', 'Leve ao forno até dourar.']
              },
              expertTip: {
                type: 'string',
                example: 'O pulo do gato é untar a forma com manteiga e fubá.'
              },
              deletedAt: {
                type: 'string',
                nullable: true,
                example: null
              },
              comments: {
                type: 'array',
                items: { $ref: '#/components/schemas/Comment' }
              },
              ratings: {
                type: 'array',
                items: { $ref: '#/components/schemas/Rating' }
              }
            }
          }
        ]
      },
      RecipeInput: {
        type: 'object',
        required: ['title', 'category', 'summary', 'successChecklist', 'steps', 'expertTip'],
        properties: {
          title: { type: 'string', example: 'Arroz Doce de Festa' },
          category: { type: 'string', example: 'Doces' },
          summary: { type: 'string', example: 'Receita servida nas festas de família.' },
          successChecklist: {
            type: 'array',
            items: { type: 'string' },
            example: ['Mexer sempre para não grudar.']
          },
          steps: {
            type: 'array',
            items: { type: 'string' },
            example: ['Cozinhar o arroz.', 'Adicionar leite e açúcar.']
          },
          expertTip: { type: 'string', example: 'Canela entra só no final para perfumar.' }
        }
      },
      RecipeListResponse: {
        type: 'object',
        properties: {
          recipes: {
            type: 'array',
            items: { $ref: '#/components/schemas/RecipePreview' }
          }
        }
      },
      RecipePreviewDetailsResponse: {
        type: 'object',
        properties: {
          recipe: { $ref: '#/components/schemas/RecipePreview' },
          access: { type: 'string', example: 'preview' },
          message: { type: 'string', example: 'Faça login ou cadastro para acessar a receita completa.' }
        }
      },
      RecipeCompleteDetailsResponse: {
        type: 'object',
        properties: {
          recipe: { $ref: '#/components/schemas/Recipe' },
          access: { type: 'string', example: 'complete' }
        }
      },
      RecipeResponse: {
        type: 'object',
        properties: {
          recipe: { $ref: '#/components/schemas/Recipe' }
        }
      },
      SoftDeleteRecipeResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Receita removida com soft delete.' },
          recipe: { $ref: '#/components/schemas/Recipe' }
        }
      },
      FavoritesIdsResponse: {
        type: 'object',
        properties: {
          favorites: {
            type: 'array',
            items: { type: 'integer' },
            example: [1]
          }
        }
      },
      FavoritesResponse: {
        type: 'object',
        properties: {
          favorites: {
            type: 'array',
            items: { $ref: '#/components/schemas/RecipePreview' }
          }
        }
      },
      CommentRequest: {
        type: 'object',
        required: ['text'],
        properties: {
          text: { type: 'string', example: 'Essa receita lembra minha infância.' }
        }
      },
      Comment: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1710000000000 },
          userId: { type: 'integer', example: 2 },
          userName: { type: 'string', example: 'Guardião da Memória' },
          text: { type: 'string', example: 'Essa receita lembra minha infância.' }
        }
      },
      CommentResponse: {
        type: 'object',
        properties: {
          comment: { $ref: '#/components/schemas/Comment' }
        }
      },
      RatingRequest: {
        type: 'object',
        required: ['value'],
        properties: {
          value: { type: 'integer', minimum: 1, maximum: 5, example: 5 }
        }
      },
      Rating: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1710000000000 },
          userId: { type: 'integer', example: 2 },
          value: { type: 'integer', example: 5 }
        }
      },
      RatingResponse: {
        type: 'object',
        properties: {
          rating: { $ref: '#/components/schemas/Rating' }
        }
      }
    }
  }
};

module.exports = {
  openApiDocument
};

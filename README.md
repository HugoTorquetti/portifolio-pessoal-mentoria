# Receitas da Vo - API

Este repositório concentra a API do projeto Receitas da Vo.

A aplicação web e o Backend For Frontend foram separados para o repositório `frontend-portifólio-pessoal-mentoria`.

## Responsabilidades

- autenticação e sessão
- CRUD de receitas
- regra de acesso para prévia e receita completa
- favoritos, comentários e avaliações
- documentação Swagger/OpenAPI
- testes unitários, API e smoke

## Como Executar

Pré-requisito:
- Node.js instalado

Instalar dependências:

```bash
npm install
```

Subir API:

```bash
npm start
```

API:
- `http://localhost:3000/api`

Health check:
- `http://localhost:3000/api/health`

Swagger:
- `http://localhost:3000/api-docs`

Contrato OpenAPI:
- `http://localhost:3000/api-docs.json`

## Autenticação

O login retorna um JWT assinado. Para acessar rotas protegidas, envie:

```text
Authorization: Bearer <token>
```

Variáveis de ambiente opcionais:

- `JWT_SECRET`: chave usada para assinar e validar o token
- `JWT_EXPIRES_IN`: tempo de expiração do token, com padrão `1h`

## Testes

Executar testes unitários, API e smoke:

```bash
npm test
```

Executar apenas testes de API:

```bash
npm run test:api
```

## Credenciais Iniciais

Admin:
- E-mail: `admin@receitasdavo.com`
- Senha: `admin123`

Usuário:
- E-mail: `usuario@receitasdavo.com`
- Senha: `usuario123`

# Receitas da Vó

## Visão Geral
`Receitas da Vó` é uma aplicação web voltada para pessoas que buscam conexão emocional através da comida, chamadas no contexto do projeto de `Guardiões da Memória`.

O produto tem como objetivo ajudar usuários a preservar memórias familiares por meio de receitas com valor afetivo, apresentando instruções claras para que qualquer pessoa consiga reproduzir o sabor e o sentimento de casa em sua própria cozinha.

## Objetivo Deste Repositório
Este repositório concentrará todo o ciclo de desenvolvimento do projeto:

- gestão do backlog
- documentação funcional e de qualidade
- registro de defeitos
- automação de testes
- pipeline de CI/CD

## Organização Planejada No GitHub
- `Projects`: gestão de épicos, user stories, bugs e progresso
- `Issues`: histórias, tarefas, bugs e rastreabilidade
- `Wiki`: estratégia de testes, plano de testes, casos de teste e documentação funcional
- `Actions`: execução da pipeline de qualidade
- `Pull Requests`: revisão e controle de mudanças

## Estrutura Inicial Do Repositório
- [docs/planning/product-backlog.md](/C:/projetos/portifolio-pessoal-mentoria/docs/planning/product-backlog.md)
- [docs/planning/github-project-setup.md](/C:/projetos/portifolio-pessoal-mentoria/docs/planning/github-project-setup.md)
- [docs/planning/quality-strategy.md](/C:/projetos/portifolio-pessoal-mentoria/docs/planning/quality-strategy.md)
- [docs/planning/roadmap.md](/C:/projetos/portifolio-pessoal-mentoria/docs/planning/roadmap.md)
- [docs/wiki/Home.md](/C:/projetos/portifolio-pessoal-mentoria/docs/wiki/Home.md)

## Status Atual
O projeto possui planejamento funcional, documentação de qualidade, estrutura web inicial, API base e esteira inicial de testes.

## Como Executar Localmente

Pré-requisito:
- Node.js instalado

Instalar dependências:

```bash
npm install
```

Subir aplicação:

```bash
npm start
```

Aplicação:
- `http://localhost:3000`

Health check:
- `http://localhost:3000/api/health`

## Como Executar Testes

Testes unitários, API e smoke:

```bash
npm test
```

Testes de API:

```bash
npm run test:api
```

Testes E2E com Cypress:

```bash
npm run test:e2e
```

## Credenciais Iniciais

Admin:
- E-mail: `admin@receitasdavo.com`
- Senha: `admin123`

Usuário:
- E-mail: `usuario@receitasdavo.com`
- Senha: `usuario123`

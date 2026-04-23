# GitHub Project Setup

## Objetivo
Padronizar a gestão do projeto `Receitas da Vó` dentro do GitHub, usando um único repositório como fonte de verdade.

## Estrutura Recomendada

### Project
Criar um `GitHub Project` para consolidar:
- épicos
- user stories
- tarefas técnicas
- bugs
- casos de teste de alto nível

### Issues
Usar `Issues` para registrar:
- `Epic`
- `User Story`
- `Task`
- `Bug`

### Wiki
Usar a `Wiki` para documentar:
- visão do produto
- estratégia de testes
- plano de testes
- casos de teste
- critérios de entrada e saída
- matriz de rastreabilidade
- fluxo de defeitos
- evidências

### Pull Requests
Usar `Pull Requests` para:
- revisão de código
- validação de critérios de aceite
- rastreabilidade com `Issues`

## Campos Sugeridos No Project
- `Tipo`: Epic, User Story, Task, Bug, Test Case
- `Status`: Backlog, Ready, In Progress, In Review, In Test, Done
- `Prioridade`: Alta, Média, Baixa
- `Perfil`: Visitante, Usuário, Admin
- `Sprint`: Sprint 1, Sprint 2, Sprint 3
- `Criticidade QA`: Alta, Média, Baixa

## Views Sugeridas
- `Backlog Geral`
- `Board da Sprint`
- `Bugs`
- `Visão QA`
- `Roadmap por Épico`

## Convenção De Labels
- `epic`
- `user-story`
- `task`
- `bug`
- `qa`
- `frontend`
- `backend`
- `api-test`
- `e2e-test`
- `smoke`
- `regression`
- `priority-high`
- `priority-medium`
- `priority-low`

## Modelo De Hierarquia
Como o repositório será usado como esteira ágil, a hierarquia recomendada é:
- 1 issue do tipo `Epic`
- N issues do tipo `User Story` ligadas ao épico
- N issues do tipo `Task` ligadas à user story
- N issues do tipo `Bug` ligadas à entrega afetada

## Regras Operacionais
- toda user story deve ter critérios de aceite em Gherkin
- toda user story deve possuir pelo menos um cenário positivo e um cenário negativo mapeado no plano de testes
- todo bug deve apontar para a user story afetada quando aplicável
- nenhum merge deve ocorrer sem pipeline verde
- toda entrega deve estar vinculada a issue e pull request

## Backlog Inicial Para Cadastro No Project
- EP01 - Fundação do Produto e Esteira
- EP02 - Autenticação e Controle de Acesso
- EP03 - Descoberta e Consulta de Receitas
- EP04 - Experiência da Receita Completa
- EP05 - Interações do Usuário
- EP06 - Gestão Administrativa de Conteúdo

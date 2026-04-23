# Estratégia de Qualidade

## Objetivo
Definir a abordagem de qualidade do projeto `Receitas da Vó` durante todo o ciclo de desenvolvimento.

## Princípios
- qualidade construída desde o início
- rastreabilidade entre requisito, teste e defeito
- automação progressiva
- validação funcional baseada em risco

## Tipos De Teste Obrigatórios

### Testes Unitários
Foco:
- funções de autenticação
- regras de autorização
- validações de payload
- manipulação de dados no arquivo `.json`

### Testes De Integração
Foco:
- integração entre rotas, serviços e persistência
- leitura e escrita no arquivo de dados
- consistência de regras entre camadas

### Testes De API
Ferramentas:
- `Mocha`
- `Chai`
- `Supertest`

Foco:
- status codes
- contrato básico das respostas
- validações
- autenticação e autorização
- regras por perfil

### Testes E2E
Ferramenta:
- `Cypress`

Foco:
- cadastro
- login
- navegação no catálogo
- bloqueio de visitante
- visualização da receita completa
- favoritar
- comentar
- avaliar

### Smoke Test
Executado após merge para validar:
- aplicação sobe com sucesso
- rota principal responde
- login básico funciona
- uma receita pode ser consultada

### Regressão
Executada antes de marcos importantes e entrega final.

## Priorização Por Risco

### Alta Prioridade
- autenticação
- autorização
- restrição de receita completa
- publicação por admin
- persistência de favoritos

### Média Prioridade
- busca
- filtro por categoria
- comentários
- avaliações

### Baixa Prioridade
- refinamentos visuais
- mensagens secundárias

## Critérios De Entrada Para Teste
- user story com critérios de aceite definidos
- ambiente disponível
- build executando
- massa mínima criada

## Critérios De Saída Para Homologação Interna
- critérios de aceite cobertos
- sem bugs bloqueadores ou críticos em aberto
- smoke test aprovado
- evidências registradas

## Rastreabilidade
Cada user story deverá se relacionar com:
- casos de teste
- evidências
- bugs encontrados
- pull request de implementação

## Estratégia De Defeitos
Os defeitos serão registrados em `Issues` com classificação por:
- severidade
- prioridade
- ambiente
- passo a passo
- impacto no negócio

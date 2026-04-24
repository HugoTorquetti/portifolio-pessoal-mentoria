# 08. Estratégia de CI/CD

## Objetivo
Garantir que o repositório utilize `GitHub Actions` como porta de entrada de qualidade.

## Pipeline Planejada
- instalar dependências
- executar lint
- executar testes unitários
- executar testes de integração
- executar testes de API
- executar smoke E2E
- validar endpoints documentados no Swagger/OpenAPI
- publicar artefatos de teste

## Regras
- merge condicionado à pipeline verde
- defeitos críticos bloqueiam release acadêmica
- regressão completa antes do marco interno de `30/04/2026`

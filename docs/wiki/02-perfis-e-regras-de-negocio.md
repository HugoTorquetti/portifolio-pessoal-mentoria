# 02. Perfis e Regras de Negócio

## Perfis
- `Visitante`
- `Usuário`
- `Admin`

## Permissões
- visitante visualiza página inicial, busca, filtros e prévia de receitas
- usuário autenticado acessa receita completa, favoritar, comentar e avaliar
- admin publica e edita receitas

## Regras Obrigatórias
- apenas admin pode publicar receita
- usuário comum não publica receita
- visitante não acessa conteúdo completo da receita
- receita deve conter título, resumo, checklist de sucesso, passo a passo e dica do especialista

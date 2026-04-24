# 02. Perfis e Regras de Negócio

## Perfis
- `Visitante`
- `Usuário`
- `Admin`

## Permissões
- visitante visualiza página inicial, busca, filtros e prévia de receitas
- usuário autenticado acessa receita completa, favoritar, comentar e avaliar
- admin cria, publica, edita e exclui receitas

## Regras Obrigatórias
- apenas admin pode criar, publicar, editar e excluir receita
- usuário comum não executa operações administrativas de receita
- visitante não acessa conteúdo completo da receita
- exclusão de receita deve ser por soft delete
- receita deve conter título, resumo, checklist de sucesso, passo a passo e dica do especialista

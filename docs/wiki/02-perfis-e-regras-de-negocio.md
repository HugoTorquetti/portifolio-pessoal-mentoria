# 02. Perfis e Regras de Negócio

## Perfis
- `Visitante`
- `Usuário`
- `Admin`

## Permissões
- visitante visualiza página inicial, busca, filtros e prévia de receitas
- usuário autenticado acessa receita completa, favoritar, remover favoritos, comentar, editar o próprio comentário, excluir o próprio comentário e avaliar
- admin cria, publica, edita e exclui receitas
- admin também pode editar e excluir comentários de qualquer usuário

## Regras Obrigatórias
- apenas admin pode criar, publicar, editar e excluir receita
- usuário comum não executa operações administrativas de receita
- visitante não acessa conteúdo completo da receita
- exclusão de receita deve ser por soft delete
- remoção de favoritos é permitida apenas ao próprio usuário autenticado
- comentário pode ser editado ou excluído pelo autor ou por admin
- receita deve conter título, resumo, checklist de sucesso, passo a passo e dica do especialista

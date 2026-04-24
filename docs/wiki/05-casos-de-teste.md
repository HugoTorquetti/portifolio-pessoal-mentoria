# 05. Casos de Teste

## Casos Prioritários

### CT01 - Cadastro com sucesso
- Pré-condição: visitante na tela de cadastro
- Passos: preencher dados válidos e enviar
- Resultado esperado: conta criada com sucesso

### CT02 - Login com sucesso
- Pré-condição: usuário cadastrado
- Passos: informar credenciais válidas
- Resultado esperado: autenticação realizada

### CT03 - Visitante bloqueado da receita completa
- Pré-condição: receita publicada existente
- Passos: acessar detalhes sem login
- Resultado esperado: exibição apenas da prévia

### CT04 - Usuário visualiza receita completa
- Pré-condição: usuário autenticado
- Passos: acessar uma receita publicada
- Resultado esperado: visualização de todos os campos obrigatórios

### CT05 - Usuário favorita receita
- Pré-condição: usuário autenticado
- Passos: acionar favorito em uma receita
- Resultado esperado: receita adicionada à lista de favoritos

### CT06 - Usuário comenta receita
- Pré-condição: usuário autenticado
- Passos: enviar comentário válido
- Resultado esperado: comentário salvo

### CT07 - Usuário avalia receita
- Pré-condição: usuário autenticado
- Passos: enviar avaliação válida
- Resultado esperado: avaliação registrada

### CT08 - Usuário comum bloqueado de publicar
- Pré-condição: usuário comum autenticado
- Passos: tentar publicar receita
- Resultado esperado: acesso negado

### CT09 - Admin publica receita
- Pré-condição: admin autenticado
- Passos: preencher campos obrigatórios e salvar
- Resultado esperado: receita publicada

### CT10 - Admin edita receita
- Pré-condição: admin autenticado e receita existente
- Passos: alterar dados válidos e salvar
- Resultado esperado: alterações persistidas

### CT11 - Admin exclui receita com soft delete
- Pré-condição: admin autenticado e receita existente
- Passos: solicitar exclusão
- Resultado esperado: receita marcada como excluída logicamente e oculta do catálogo

# Product Backlog - Receitas da Vó

## Visão Do Produto
- Nome do sistema: `Receitas da Vó`
- Público-alvo: `Guardiões da Memória`
- Objetivo principal: preservar memórias familiares por meio de receitas com valor afetivo

## Perfis De Usuário
- `Visitante`: usuário não autenticado
- `Usuário`: autenticado, pode consultar receitas completas, favoritar, comentar e avaliar
- `Admin`: responsável por cadastrar, publicar e editar receitas

## Regras De Negócio
- Somente o `admin` pode criar, publicar, editar e excluir receitas
- Usuário logado pode consultar receitas completas, favoritar, comentar e avaliar
- Visitante vê apenas uma prévia da receita e precisa se cadastrar/logar para acessar o conteúdo completo
- A exclusão de receita deve ser realizada com `soft delete`
- Toda receita deve seguir a estrutura:
  - Título
  - Resumo
  - Checklist de Sucesso
  - Passo a Passo
  - Dica do Especialista

## Épicos

### EP01 - Fundação do Produto e Esteira
Objetivo: preparar a base do projeto, governança, ambiente e qualidade.

### EP02 - Autenticação e Controle de Acesso
Objetivo: permitir cadastro, login e restrições por perfil.

### EP03 - Descoberta e Consulta de Receitas
Objetivo: permitir busca, filtro e navegação do catálogo.

### EP04 - Experiência da Receita Completa
Objetivo: exibir a receita com o template completo definido pelo negócio.

### EP05 - Interações do Usuário
Objetivo: permitir favoritar, comentar e avaliar receitas.

### EP06 - Gestão Administrativa de Conteúdo
Objetivo: garantir que apenas o admin realize o CRUD administrativo das receitas.

## User Stories

### US01 - Landing Page
Como visitante, quero acessar a página inicial para conhecer a proposta do sistema.

Critérios de aceite:

```gherkin
Cenário: Exibir proposta do produto para visitante
Dado que sou um visitante
Quando acesso a página inicial
Então devo visualizar a proposta emocional do sistema
E devo visualizar opções de cadastro e login
```

### US02 - Cadastro de usuário
Como visitante, quero me cadastrar para acessar receitas completas.

Critérios de aceite:

```gherkin
Cenário: Cadastro com sucesso
Dado que sou um visitante
Quando preencho os dados obrigatórios corretamente
E envio o formulário de cadastro
Então minha conta deve ser criada com perfil de usuário
```

### US03 - Login
Como usuário, quero fazer login para acessar funcionalidades autenticadas.

Critérios de aceite:

```gherkin
Cenário: Login com credenciais válidas
Dado que possuo uma conta cadastrada
Quando informo credenciais válidas
Então devo ser autenticado com sucesso
E devo acessar a área autenticada do sistema
```

### US04 - Prévia de receita para visitante
Como visitante, quero ver apenas uma prévia da receita para entender a proposta antes de me autenticar.

Critérios de aceite:

```gherkin
Cenário: Restringir receita completa para visitante
Dado que sou um visitante
Quando acesso uma receita publicada
Então devo visualizar somente uma prévia da receita
E devo visualizar uma mensagem orientando login ou cadastro para acesso completo
```

### US05 - Receita completa para usuário autenticado
Como usuário, quero consultar a receita completa para reproduzir o prato em casa.

Critérios de aceite:

```gherkin
Cenário: Exibir receita completa para usuário logado
Dado que estou autenticado
E existe uma receita publicada
Quando acesso os detalhes da receita
Então devo visualizar o título
E devo visualizar o resumo
E devo visualizar o checklist de sucesso
E devo visualizar o passo a passo
E devo visualizar a dica do especialista
```

### US06 - Busca de receitas
Como usuário, quero buscar receitas por texto para encontrar receitas específicas.

Critérios de aceite:

```gherkin
Cenário: Buscar receita por termo válido
Dado que existem receitas publicadas no sistema
Quando informo um termo de busca existente
Então devo visualizar as receitas compatíveis com o termo informado
```

### US07 - Filtro por categoria
Como visitante ou usuário, quero filtrar receitas por categoria para navegar melhor pelo catálogo.

Critérios de aceite:

```gherkin
Cenário: Filtrar receitas por categoria
Dado que existem receitas publicadas categorizadas
Quando seleciono uma categoria disponível
Então devo visualizar apenas receitas da categoria selecionada
```

### US08 - Favoritar receita
Como usuário, quero favoritar receitas para acessá-las novamente no futuro.

Critérios de aceite:

```gherkin
Cenário: Favoritar receita com sucesso
Dado que estou autenticado
E existe uma receita publicada
Quando aciono a opção de favoritar
Então a receita deve ser adicionada à minha lista de favoritos
```

### US09 - Comentar receita
Como usuário, quero comentar em receitas para compartilhar experiências.

Critérios de aceite:

```gherkin
Cenário: Comentar receita com sucesso
Dado que estou autenticado
E existe uma receita publicada
Quando envio um comentário válido
Então o comentário deve ser salvo e associado à receita
```

### US10 - Avaliar receita
Como usuário, quero avaliar receitas para ajudar outras pessoas.

Critérios de aceite:

```gherkin
Cenário: Avaliar receita com sucesso
Dado que estou autenticado
E existe uma receita publicada
Quando envio uma avaliação válida
Então a avaliação deve ser registrada para a receita
```

### US11 - Publicar receita como admin
Como admin, quero cadastrar e publicar receitas para disponibilizar conteúdo aprovado.

Critérios de aceite:

```gherkin
Cenário: Publicar receita como administrador
Dado que estou autenticado como admin
Quando preencho os campos obrigatórios da receita
E salvo a publicação
Então a receita deve ser publicada com sucesso
```

### US12 - Bloqueio de publicação para usuário comum
Como admin, quero garantir que apenas administradores publiquem receitas.

Critérios de aceite:

```gherkin
Cenário: Bloquear publicação para usuário comum
Dado que estou autenticado como usuário comum
Quando tento acessar funcionalidade de publicação de receita
Então o sistema deve negar o acesso
```

### US13 - Editar receita como admin
Como admin, quero editar receitas publicadas para corrigir ou melhorar o conteúdo.

Critérios de aceite:

```gherkin
Cenário: Editar receita publicada
Dado que estou autenticado como admin
E existe uma receita publicada
Quando altero dados válidos da receita
E salvo a edição
Então as alterações devem ser persistidas com sucesso
```

### US15 - Excluir receita com soft delete
Como admin, quero excluir receitas com soft delete para retirar conteúdos do catálogo sem apagá-los fisicamente.

Critérios de aceite:

```gherkin
Cenário: Excluir receita com soft delete
Dado que estou autenticado como admin
E existe uma receita publicada
Quando solicito a exclusão da receita
Então o sistema deve marcar a receita como excluída logicamente
E a receita não deve mais aparecer na listagem nem nos detalhes públicos
```

### US14 - Visualizar favoritos
Como usuário, quero visualizar minha lista de favoritos em uma área dedicada.

Critérios de aceite:

```gherkin
Cenário: Visualizar favoritos salvos
Dado que estou autenticado
E possuo receitas favoritadas
Quando acesso minha área de favoritos
Então devo visualizar somente as receitas que favoritei
```

## Tarefas Técnicas Iniciais
- definir estrutura de pastas do frontend e backend
- definir formato do arquivo `.json` que simulará o banco
- configurar lint
- configurar suíte de testes de API
- configurar suíte de testes E2E
- configurar pipeline no GitHub Actions
- preparar massa de dados inicial

## Dependências Funcionais
- cadastro e login devem existir antes de favoritar, comentar e avaliar
- listagem de receitas deve existir antes da busca e do filtro
- publicação por admin deve existir antes de validar consulta de receitas reais

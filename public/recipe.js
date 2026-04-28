const storedRecipeUser = localStorage.getItem('receitasDaVoUser');
const storedRecipeToken = localStorage.getItem('receitasDaVoToken');
const recipeBrandLink = document.querySelector('#recipe-brand-link');
const recipeBackLink = document.querySelector('#recipe-back-link');
const recipeAuthShell = document.querySelector('#recipe-auth-shell');
const recipePublicActions = document.querySelector('#recipe-public-actions');
const recipeLogoutButton = document.querySelector('#logout-button');
const recipeUserAvatar = document.querySelector('#user-avatar');
const recipeSessionUserName = document.querySelector('#session-user-name');
const recipeCategory = document.querySelector('#recipe-category');
const recipeTitle = document.querySelector('#recipe-title');
const recipeSummary = document.querySelector('#recipe-summary');
const recipeSummaryDetail = document.querySelector('#recipe-summary-detail');
const recipeChecklist = document.querySelector('#recipe-checklist');
const recipeSteps = document.querySelector('#recipe-steps');
const recipeTip = document.querySelector('#recipe-tip');
const recipeContent = document.querySelector('#recipe-content');
const recipeGatedSections = document.querySelector('#recipe-gated-sections');
const recipePreviewCta = document.querySelector('#recipe-preview-cta');
const recipePreviewMessage = document.querySelector('#recipe-preview-message');
const recipeTipCard = document.querySelector('#recipe-tip-card');
const recipeError = document.querySelector('#recipe-error');
const recipeErrorMessage = document.querySelector('#recipe-error-message');

const isAuthenticated = Boolean(storedRecipeUser && storedRecipeToken);
const currentRecipeUser = isAuthenticated ? JSON.parse(storedRecipeUser) : null;

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

function updateSessionHeader(user) {
  if (!user || !isAuthenticated) {
    return;
  }

  if (recipeUserAvatar) {
    recipeUserAvatar.textContent = getInitials(user.name);
  }

  if (recipeSessionUserName) {
    recipeSessionUserName.textContent = user.name;
  }
}

function updateHeaderForAccess() {
  if (isAuthenticated) {
    if (recipeBrandLink) {
      recipeBrandLink.setAttribute('href', './app.html');
    }

    if (recipeBackLink) {
      recipeBackLink.setAttribute('href', './app.html#receitas');
    }

    if (recipeAuthShell) {
      recipeAuthShell.hidden = false;
    }

    if (recipePublicActions) {
      recipePublicActions.hidden = true;
    }

    return;
  }

  if (recipeBrandLink) {
    recipeBrandLink.setAttribute('href', './index.html');
  }

  if (recipeBackLink) {
    recipeBackLink.setAttribute('href', './index.html#recipes');
  }

  if (recipeAuthShell) {
    recipeAuthShell.hidden = true;
  }

  if (recipePublicActions) {
    recipePublicActions.hidden = false;
  }
}

function renderRecipe(recipe) {
  if (recipeCategory) {
    recipeCategory.textContent = recipe.category;
  }

  if (recipeTitle) {
    recipeTitle.textContent = recipe.title;
  }

  if (recipeSummary) {
    recipeSummary.textContent = recipe.summary;
  }

  if (recipeSummaryDetail) {
    recipeSummaryDetail.textContent = recipe.summary;
  }

  if (recipeChecklist) {
    recipeChecklist.innerHTML = (recipe.successChecklist || [])
      .map((item) => `<li>${item}</li>`)
      .join('');
  }

  if (recipeSteps) {
    recipeSteps.innerHTML = (recipe.steps || [])
      .map((item) => `<li>${item}</li>`)
      .join('');
  }

  if (recipeTip) {
    recipeTip.textContent = recipe.expertTip || '';
  }

  if (recipeContent) {
    recipeContent.hidden = false;
  }
}

function enablePreviewMode(message) {
  if (recipeChecklist) {
    recipeChecklist.innerHTML = [
      'O restante do checklist é liberado após o login.',
      'Entre para consultar utensílios, preparo e cuidados prévios.'
    ]
      .map((item) => `<li>${item}</li>`)
      .join('');
  }

  if (recipeSteps) {
    recipeSteps.innerHTML = [
      'O passo a passo completo fica disponível para usuários autenticados.',
      'Crie sua conta para continuar esta receita do ponto em que parou.'
    ]
      .map((item) => `<li>${item}</li>`)
      .join('');
  }

  if (recipeTip) {
    recipeTip.textContent = 'O segredo de família desta receita é exibido somente após o acesso autenticado.';
  }

  if (recipeGatedSections) {
    recipeGatedSections.classList.add('is-preview');
  }

  if (recipeTipCard) {
    recipeTipCard.classList.add('is-preview');
  }

  if (recipePreviewMessage) {
    recipePreviewMessage.textContent = `${message} Entre ou crie sua conta para continuar.`;
  }

  if (recipePreviewCta) {
    recipePreviewCta.hidden = false;
  }
}

function showRecipeError(message) {
  if (recipeSummary) {
    recipeSummary.textContent = 'Confira a lista de receitas e tente novamente.';
  }

  if (recipeErrorMessage) {
    recipeErrorMessage.textContent = message;
  }

  if (recipeError) {
    recipeError.hidden = false;
  }
}

async function fetchRecipeDetails() {
  const searchParams = new URLSearchParams(window.location.search);
  const recipeId = searchParams.get('id');

  if (!recipeId) {
    showRecipeError('Nenhum identificador de receita foi informado.');
    return;
  }

  const headers = isAuthenticated
    ? { Authorization: `Bearer ${storedRecipeToken}` }
    : {};

  const response = await fetch(`/api/recipes/${recipeId}`, { headers });
  const data = await response.json();

  if (!response.ok) {
    showRecipeError(data.message || 'Esta receita não está disponível para sua sessão.');
    return;
  }

  renderRecipe(data.recipe);

  if (data.access === 'preview') {
    enablePreviewMode(data.message || 'Faça login ou cadastro para acessar a receita completa.');
  }
}

updateHeaderForAccess();
updateSessionHeader(currentRecipeUser);
fetchRecipeDetails();

if (recipeLogoutButton && isAuthenticated) {
  recipeLogoutButton.addEventListener('click', () => {
    localStorage.removeItem('receitasDaVoUser');
    localStorage.removeItem('receitasDaVoToken');
    window.location.replace('./index.html');
  });
}

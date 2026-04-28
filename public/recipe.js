const storedRecipeUser = localStorage.getItem('receitasDaVoUser');
const storedRecipeToken = localStorage.getItem('receitasDaVoToken');
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
const recipeError = document.querySelector('#recipe-error');
const recipeErrorMessage = document.querySelector('#recipe-error-message');

if (!storedRecipeUser || !storedRecipeToken) {
  window.location.replace('./index.html');
}

const currentRecipeUser = storedRecipeUser ? JSON.parse(storedRecipeUser) : null;

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

function updateSessionHeader(user) {
  if (!user) {
    return;
  }

  if (recipeUserAvatar) {
    recipeUserAvatar.textContent = getInitials(user.name);
  }

  if (recipeSessionUserName) {
    recipeSessionUserName.textContent = user.name;
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
    recipeChecklist.innerHTML = recipe.successChecklist
      .map((item) => `<li>${item}</li>`)
      .join('');
  }

  if (recipeSteps) {
    recipeSteps.innerHTML = recipe.steps
      .map((item) => `<li>${item}</li>`)
      .join('');
  }

  if (recipeTip) {
    recipeTip.textContent = recipe.expertTip;
  }

  if (recipeContent) {
    recipeContent.hidden = false;
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

  const response = await fetch(`/api/recipes/${recipeId}`, {
    headers: {
      Authorization: `Bearer ${storedRecipeToken}`
    }
  });
  const data = await response.json();

  if (!response.ok || data.access !== 'complete') {
    showRecipeError(data.message || 'Esta receita não está disponível para sua sessão.');
    return;
  }

  renderRecipe(data.recipe);
}

updateSessionHeader(currentRecipeUser);
fetchRecipeDetails();

if (recipeLogoutButton) {
  recipeLogoutButton.addEventListener('click', () => {
    localStorage.removeItem('receitasDaVoUser');
    localStorage.removeItem('receitasDaVoToken');
    window.location.replace('./index.html');
  });
}

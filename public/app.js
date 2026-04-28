const storedUser = localStorage.getItem('receitasDaVoUser');
const storedToken = localStorage.getItem('receitasDaVoToken');
const logoutButton = document.querySelector('#logout-button');
const userAvatar = document.querySelector('#user-avatar');
const sessionUserName = document.querySelector('#session-user-name');
const dashboardTitle = document.querySelector('#dashboard-title');
const dashboardText = document.querySelector('#dashboard-text');
const authenticatedRecipesContainer = document.querySelector('#authenticated-recipes');
const authenticatedRecipesEmpty = document.querySelector('#authenticated-recipes-empty');

if (!storedUser || !storedToken) {
  window.location.replace('./index.html');
}

const user = storedUser ? JSON.parse(storedUser) : null;

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

if (user) {
  const initials = getInitials(user.name);

  if (userAvatar) {
    userAvatar.textContent = initials;
  }

  if (sessionUserName) {
    sessionUserName.textContent = user.name;
  }

  if (dashboardTitle) {
    dashboardTitle.textContent = `Olá, ${user.name}.`;
  }

  if (dashboardText) {
    dashboardText.textContent = 'Sua sessão está ativa. Agora você pode explorar receitas completas, rever suas favoritas e continuar sua jornada afetiva pela plataforma.';
  }
}

function renderAuthenticatedRecipes(recipes) {
  if (!authenticatedRecipesContainer) {
    return;
  }

  if (!recipes.length) {
    authenticatedRecipesContainer.innerHTML = '';

    if (authenticatedRecipesEmpty) {
      authenticatedRecipesEmpty.hidden = false;
    }

    return;
  }

  if (authenticatedRecipesEmpty) {
    authenticatedRecipesEmpty.hidden = true;
  }

  authenticatedRecipesContainer.innerHTML = recipes
    .map((recipe) => `
      <article class="recipe-preview-card">
        <p class="recipe-preview-category">${recipe.category}</p>
        <h3>${recipe.title}</h3>
        <p>${recipe.summary}</p>
        <a class="button-link" href="./recipe.html?id=${recipe.id}">Ver receita completa</a>
      </article>
    `)
    .join('');
}

async function loadAuthenticatedRecipes() {
  if (!authenticatedRecipesContainer) {
    return;
  }

  const response = await fetch('/api/recipes', {
    headers: {
      Authorization: `Bearer ${storedToken}`
    }
  });
  const data = await response.json();

  renderAuthenticatedRecipes(data.recipes || []);
}

loadAuthenticatedRecipes();

if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('receitasDaVoUser');
    localStorage.removeItem('receitasDaVoToken');
    window.location.replace('./index.html');
  });
}

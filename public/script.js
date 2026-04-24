const recipesContainer = document.querySelector('#recipes');
const filtersForm = document.querySelector('#filters');
const loginForm = document.querySelector('#login-form');
const loginMessage = document.querySelector('#login-message');

let authToken = '';

async function fetchRecipes(params = {}) {
  if (!recipesContainer) {
    return;
  }

  const query = new URLSearchParams(params);
  const response = await fetch(`/api/recipes?${query.toString()}`);
  const data = await response.json();

  recipesContainer.innerHTML = data.recipes
    .map((recipe) => `
      <article class="recipe-card">
        <h3>${recipe.title}</h3>
        <p><strong>Categoria:</strong> ${recipe.category}</p>
        <p>${recipe.summary}</p>
        <button type="button" data-recipe-id="${recipe.id}">Ver detalhes</button>
      </article>
    `)
    .join('');
}

if (filtersForm) {
  filtersForm.addEventListener('submit', (event) => {
    event.preventDefault();
    fetchRecipes({
      search: document.querySelector('#search').value,
      category: document.querySelector('#category').value
    });
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: document.querySelector('#email').value,
        password: document.querySelector('#password').value
      })
    });

    const data = await response.json();
    authToken = data.token || '';
    loginMessage.textContent = authToken
      ? `Bem-vindo, ${data.user.name}.`
      : data.message;
  });
}

if (recipesContainer) {
  recipesContainer.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-recipe-id]');

    if (!button) return;

    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
    const response = await fetch(`/api/recipes/${button.dataset.recipeId}`, { headers });
    const data = await response.json();

    alert(data.access === 'complete'
      ? `Pulo do gato: ${data.recipe.expertTip}`
      : data.message);
  });

  fetchRecipes();
}

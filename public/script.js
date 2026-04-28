const recipesContainer = document.querySelector('#recipes');
const filtersForm = document.querySelector('#filters');
const signupForm = document.querySelector('#signup-form');
const loginForm = document.querySelector('#login-form');
const loginMessage = document.querySelector('#login-message');
const feedbackModal = document.querySelector('#feedback-modal');
const feedbackTag = document.querySelector('#feedback-tag');
const feedbackTitle = document.querySelector('#feedback-title');
const feedbackText = document.querySelector('#feedback-text');
const feedbackCloseButton = document.querySelector('#feedback-close');

let authToken = '';

function showMessage(element, message) {
  if (element) {
    element.textContent = message;
  }
}

function openFeedbackModal({ status, title, message }) {
  if (!feedbackModal) {
    return;
  }

  feedbackTag.textContent = status === 'success' ? 'Cadastro concluído' : 'Não foi possível concluir';
  feedbackTitle.textContent = title;
  feedbackText.textContent = message;
  feedbackModal.hidden = false;
  document.body.classList.add('modal-open');
}

function closeFeedbackModal() {
  if (!feedbackModal) {
    return;
  }

  feedbackModal.hidden = true;
  document.body.classList.remove('modal-open');
}

function storeAuthenticatedSession(token, user) {
  localStorage.setItem('receitasDaVoToken', token);
  localStorage.setItem('receitasDaVoUser', JSON.stringify(user));
}

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

if (feedbackCloseButton) {
  feedbackCloseButton.addEventListener('click', () => {
    closeFeedbackModal();
  });
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

if (signupForm) {
  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = {
      name: document.querySelector('#signup-name').value.trim(),
      email: document.querySelector('#signup-email').value.trim(),
      password: document.querySelector('#signup-password').value
    };

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    const isSuccess = response.ok;

    openFeedbackModal({
      status: isSuccess ? 'success' : 'error',
      title: isSuccess ? 'Sua conta foi criada.' : 'Seu cadastro não pôde ser concluído.',
      message: isSuccess
        ? 'Conta criada com sucesso. Agora você já pode entrar.'
        : data.message
    });

    if (!isSuccess) {
      return;
    }

    signupForm.reset();
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
    const isSuccess = response.ok;

    authToken = isSuccess ? data.token : '';
    showMessage(loginMessage, isSuccess ? `Bem-vindo, ${data.user.name}.` : data.message);

    if (!isSuccess) {
      openFeedbackModal({
        status: 'error',
        title: 'Não foi possível entrar.',
        message: data.message
      });
      return;
    }

    storeAuthenticatedSession(data.token, data.user);
    window.location.assign('./app.html');
  });
}

if (recipesContainer) {
  recipesContainer.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-recipe-id]');

    if (!button) {
      return;
    }

    window.location.assign(`./recipe.html?id=${button.dataset.recipeId}`);
  });

  fetchRecipes();
}

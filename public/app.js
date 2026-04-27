const storedUser = localStorage.getItem('receitasDaVoUser');
const storedToken = localStorage.getItem('receitasDaVoToken');
const logoutButton = document.querySelector('#logout-button');
const userAvatar = document.querySelector('#user-avatar');
const sessionUserName = document.querySelector('#session-user-name');
const dashboardTitle = document.querySelector('#dashboard-title');
const dashboardText = document.querySelector('#dashboard-text');

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

if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('receitasDaVoUser');
    localStorage.removeItem('receitasDaVoToken');
    window.location.replace('./index.html');
  });
}

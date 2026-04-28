const { readDatabase, writeDatabase } = require('../data/db');

function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function registerUser({ name, email, password }) {
  if (!name || !email || !password) {
    return { status: 400, body: { message: 'Nome, e-mail e senha são obrigatórios.' } };
  }

  if (!isValidEmail(email)) {
    return { status: 400, body: { message: 'E-mail em formato inválido.' } };
  }

  const database = readDatabase();
  const existingUser = database.users.find((user) => user.email === email);

  if (existingUser) {
    return { status: 409, body: { message: 'E-mail já cadastrado.' } };
  }

  const user = {
    id: Date.now(),
    name,
    email,
    password,
    role: 'user',
    favorites: []
  };

  database.users.push(user);
  writeDatabase(database);

  return { status: 201, body: { user: sanitizeUser(user) } };
}

function loginUser({ email, password }) {
  if (!email || !password) {
    return { status: 400, body: { message: 'E-mail e senha são obrigatórios.' } };
  }

  const database = readDatabase();
  const user = database.users.find(
    (candidate) => candidate.email === email && candidate.password === password
  );

  if (!user) {
    return { status: 401, body: { message: 'Credenciais inválidas.' } };
  }

  const token = `token-${user.id}-${Date.now()}`;
  database.sessions.push({ token, userId: user.id });
  writeDatabase(database);

  return { status: 200, body: { token, user: sanitizeUser(user) } };
}

function getAuthenticatedUser(authorizationHeader) {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authorizationHeader.replace('Bearer ', '');
  const database = readDatabase();
  const session = database.sessions.find((item) => item.token === token);

  if (!session) {
    return null;
  }

  return database.users.find((user) => user.id === session.userId) || null;
}

module.exports = {
  getAuthenticatedUser,
  isValidEmail,
  loginUser,
  registerUser,
  sanitizeUser
};

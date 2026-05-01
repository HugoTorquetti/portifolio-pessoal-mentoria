const jwt = require('jsonwebtoken');
const { readDatabase, writeDatabase } = require('../data/db');

const JWT_SECRET = process.env.JWT_SECRET || 'receitas-da-vo-dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

function generateToken(user) {
  return jwt.sign(
    {
      name: user.name,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    {
      subject: String(user.id),
      expiresIn: JWT_EXPIRES_IN
    }
  );
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

  const token = generateToken(user);

  return { status: 200, body: { token, user: sanitizeUser(user) } };
}

function getAuthenticatedUser(authorizationHeader) {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authorizationHeader.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const database = readDatabase();

    return database.users.find((user) => user.id === Number(payload.sub)) || null;
  } catch (_error) {
    return null;
  }
}

module.exports = {
  generateToken,
  getAuthenticatedUser,
  isValidEmail,
  loginUser,
  registerUser,
  sanitizeUser
};

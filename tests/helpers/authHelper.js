const request = require('supertest');
const app = require('../../src/app');

async function login(email, password) {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email, password });

  return response.body.token;
}

function loginAsAdmin() {
  return login('admin@receitasdavo.com', 'admin123');
}

function loginAsUser() {
  return login('usuario@receitasdavo.com', 'usuario123');
}

module.exports = {
  login,
  loginAsAdmin,
  loginAsUser
};

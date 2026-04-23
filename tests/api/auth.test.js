const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/app');
const { restoreDatabase } = require('../helpers/databaseSnapshot');

describe('API - Autenticação', () => {
  beforeEach(() => {
    restoreDatabase();
  });

  it('cadastra visitante como usuário comum', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Nova Guardiã',
        email: 'nova.guardiao@example.com',
        password: 'senha123'
      });

    expect(response.status).to.equal(201);
    expect(response.body.user.role).to.equal('user');
    expect(response.body.user).to.not.have.property('password');
  });

  it('realiza login com credenciais válidas', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'usuario@receitasdavo.com',
        password: 'usuario123'
      });

    expect(response.status).to.equal(200);
    expect(response.body.token).to.be.a('string');
    expect(response.body.user.role).to.equal('user');
  });

  it('bloqueia login com credenciais inválidas', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'usuario@receitasdavo.com',
        password: 'senha-incorreta'
      });

    expect(response.status).to.equal(401);
  });
});

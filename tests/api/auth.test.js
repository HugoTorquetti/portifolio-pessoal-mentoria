const request = require('supertest');
const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');
const { restoreDatabase } = require('../helpers/databaseSnapshot');

describe('API - Autenticacao', () => {
  beforeEach(() => {
    restoreDatabase();
  });

  it('cadastra visitante como usuario comum', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Nova Guardia',
        email: 'nova.guardiao@example.com',
        password: 'senha123'
      });

    expect(response.status).to.equal(201);
    expect(response.body.user.role).to.equal('user');
    expect(response.body.user).to.not.have.property('password');
  });

  it('bloqueia cadastro com e-mail em formato invalido', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Luke Skywalker',
        email: 'luke@jedi',
        password: '123456'
      });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('E-mail em formato inválido.');
  });

  it('bloqueia cadastro com e-mail ja cadastrado', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Guardia repetida',
        email: 'usuario@receitasdavo.com',
        password: 'senha123'
      });

    expect(response.status).to.equal(409);
    expect(response.body.message).to.equal('E-mail já cadastrado.');
  });

  it('realiza login com credenciais validas e retorna JWT', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'usuario@receitasdavo.com',
        password: 'usuario123'
      });

    expect(response.status).to.equal(200);
    expect(response.body.token).to.be.a('string');
    expect(response.body.token.split('.')).to.have.length(3);
    expect(jwt.decode(response.body.token)).to.include({
      email: 'usuario@receitasdavo.com',
      role: 'user'
    });
    expect(response.body.user.role).to.equal('user');
  });

  it('permite acessar rota protegida com JWT valido', async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'usuario@receitasdavo.com',
        password: 'usuario123'
      });

    const response = await request(app)
      .get('/api/recipes/1')
      .set('Authorization', `Bearer ${loginResponse.body.token}`);

    expect(response.status).to.equal(200);
    expect(response.body.access).to.equal('complete');
  });

  it('bloqueia rota protegida com JWT invalido', async () => {
    const response = await request(app)
      .get('/api/me/favorites')
      .set('Authorization', 'Bearer token-invalido');

    expect(response.status).to.equal(401);
    expect(response.body.message).to.equal('Autenticação obrigatória.');
  });

  it('bloqueia login com credenciais invalidas', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'usuario@receitasdavo.com',
        password: 'senha-incorreta'
      });

    expect(response.status).to.equal(401);
  });
});

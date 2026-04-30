const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/app');
const { restoreDatabase } = require('../helpers/databaseSnapshot');

async function login(email, password) {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email, password });

  return response.body.token;
}

const validRecipe = {
  title: 'Arroz Doce de Festa',
  category: 'Doces',
  summary: 'Receita servida nas festas de familia.',
  successChecklist: ['Mexer sempre para nao grudar.'],
  steps: ['Cozinhar o arroz.', 'Adicionar leite e acucar.'],
  expertTip: 'Canela entra so no final para perfumar.'
};

describe('API - Administracao de receitas', () => {
  beforeEach(() => {
    restoreDatabase();
  });

  it('permite admin publicar receita', async () => {
    const token = await login('admin@receitasdavo.com', 'admin123');
    const response = await request(app)
      .post('/api/recipes')
      .set('Authorization', `Bearer ${token}`)
      .send(validRecipe);

    expect(response.status).to.equal(201);
    expect(response.body.recipe.title).to.equal(validRecipe.title);
  });

  it('permite admin substituir receita completa com PUT', async () => {
    const token = await login('admin@receitasdavo.com', 'admin123');
    const response = await request(app)
      .put('/api/recipes/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...validRecipe,
        title: 'Bolo de Fuba Atualizado'
      });

    expect(response.status).to.equal(200);
    expect(response.body.recipe.title).to.equal('Bolo de Fuba Atualizado');
  });

  it('exige receita completa ao atualizar com PUT', async () => {
    const token = await login('admin@receitasdavo.com', 'admin123');
    const response = await request(app)
      .put('/api/recipes/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Bolo de Fuba Atualizado' });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Todos os campos obrigatórios da receita devem ser informados.');
  });

  it('permite admin atualizar parcialmente receita com PATCH', async () => {
    const token = await login('admin@receitasdavo.com', 'admin123');
    const beforeResponse = await request(app)
      .get('/api/recipes/1')
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .patch('/api/recipes/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        successChecklist: [
          'Separe os ingredientes em temperatura ambiente.',
          'Preaqueça o forno antes de começar.'
        ]
      });

    expect(response.status).to.equal(200);
    expect(response.body.recipe.successChecklist).to.deep.equal([
      'Separe os ingredientes em temperatura ambiente.',
      'Preaqueça o forno antes de começar.'
    ]);
    expect(response.body.recipe.title).to.equal(beforeResponse.body.recipe.title);
    expect(response.body.recipe.summary).to.equal(beforeResponse.body.recipe.summary);
  });

  it('bloqueia PATCH sem campos validos de receita', async () => {
    const token = await login('admin@receitasdavo.com', 'admin123');
    const response = await request(app)
      .patch('/api/recipes/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ id: 99 });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Informe ao menos um campo válido da receita para atualizar.');
  });

  it('permite admin excluir receita com soft delete', async () => {
    const token = await login('admin@receitasdavo.com', 'admin123');
    const deleteResponse = await request(app)
      .delete('/api/recipes/1')
      .set('Authorization', `Bearer ${token}`);

    const listResponse = await request(app).get('/api/recipes');
    const detailsResponse = await request(app).get('/api/recipes/1');

    expect(deleteResponse.status).to.equal(200);
    expect(deleteResponse.body.recipe.deletedAt).to.be.a('string');
    expect(listResponse.body.recipes.map((recipe) => recipe.id)).to.not.include(1);
    expect(detailsResponse.status).to.equal(404);
  });

  it('bloqueia usuario comum de publicar receita', async () => {
    const token = await login('usuario@receitasdavo.com', 'usuario123');
    const response = await request(app)
      .post('/api/recipes')
      .set('Authorization', `Bearer ${token}`)
      .send(validRecipe);

    expect(response.status).to.equal(403);
  });

  it('bloqueia usuario comum de substituir receita com PUT', async () => {
    const token = await login('usuario@receitasdavo.com', 'usuario123');
    const response = await request(app)
      .put('/api/recipes/1')
      .set('Authorization', `Bearer ${token}`)
      .send(validRecipe);

    expect(response.status).to.equal(403);
  });

  it('bloqueia usuario comum de atualizar parcialmente receita com PATCH', async () => {
    const token = await login('usuario@receitasdavo.com', 'usuario123');
    const response = await request(app)
      .patch('/api/recipes/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Tentativa indevida' });

    expect(response.status).to.equal(403);
  });

  it('bloqueia usuario comum de excluir receita', async () => {
    const token = await login('usuario@receitasdavo.com', 'usuario123');
    const response = await request(app)
      .delete('/api/recipes/1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(403);
  });
});

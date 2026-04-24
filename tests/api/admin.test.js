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
  summary: 'Receita servida nas festas de família.',
  successChecklist: ['Mexer sempre para não grudar.'],
  steps: ['Cozinhar o arroz.', 'Adicionar leite e açúcar.'],
  expertTip: 'Canela entra só no final para perfumar.'
};

describe('API - Administração de receitas', () => {
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

  it('permite admin editar receita', async () => {
    const token = await login('admin@receitasdavo.com', 'admin123');
    const response = await request(app)
      .put('/api/recipes/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Bolo de Fubá Atualizado' });

    expect(response.status).to.equal(200);
    expect(response.body.recipe.title).to.equal('Bolo de Fubá Atualizado');
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

  it('bloqueia usuário comum de publicar receita', async () => {
    const token = await login('usuario@receitasdavo.com', 'usuario123');
    const response = await request(app)
      .post('/api/recipes')
      .set('Authorization', `Bearer ${token}`)
      .send(validRecipe);

    expect(response.status).to.equal(403);
  });

  it('bloqueia usuário comum de editar receita', async () => {
    const token = await login('usuario@receitasdavo.com', 'usuario123');
    const response = await request(app)
      .put('/api/recipes/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Tentativa indevida' });

    expect(response.status).to.equal(403);
  });

  it('bloqueia usuário comum de excluir receita', async () => {
    const token = await login('usuario@receitasdavo.com', 'usuario123');
    const response = await request(app)
      .delete('/api/recipes/1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(403);
  });
});

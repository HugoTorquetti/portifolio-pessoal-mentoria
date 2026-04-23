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
      .post('/api/admin/recipes')
      .set('Authorization', `Bearer ${token}`)
      .send(validRecipe);

    expect(response.status).to.equal(201);
    expect(response.body.recipe.title).to.equal(validRecipe.title);
  });

  it('bloqueia usuário comum de publicar receita', async () => {
    const token = await login('usuario@receitasdavo.com', 'usuario123');
    const response = await request(app)
      .post('/api/admin/recipes')
      .set('Authorization', `Bearer ${token}`)
      .send(validRecipe);

    expect(response.status).to.equal(403);
  });
});

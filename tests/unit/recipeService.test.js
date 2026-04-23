const { expect } = require('chai');
const { listRecipes } = require('../../src/services/recipeService');
const { restoreDatabase } = require('../helpers/databaseSnapshot');

describe('recipeService', () => {
  beforeEach(() => {
    restoreDatabase();
  });

  it('lista receitas publicadas em formato de prévia', () => {
    const recipes = listRecipes({});

    expect(recipes).to.have.length.greaterThan(0);
    expect(recipes[0]).to.include.keys(['id', 'title', 'category', 'summary']);
    expect(recipes[0]).to.not.have.property('steps');
  });

  it('filtra receitas por categoria', () => {
    const recipes = listRecipes({ category: 'Bolos' });

    expect(recipes).to.have.length(1);
    expect(recipes[0].category).to.equal('Bolos');
  });
});

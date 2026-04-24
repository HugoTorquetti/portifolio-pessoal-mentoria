describe('US01 - Landing Page', () => {
  it('exibe a proposta emocional do produto e as opções de cadastro e login', () => {
    cy.visit('/');

    cy.contains('Receitas da Vó').should('be.visible');
    cy.contains('Um lugar para preservar memórias familiares através da comida').should('be.visible');
    cy.contains('Receitas que guardam histórias, não só ingredientes.').should('be.visible');

    cy.contains('Quero me cadastrar')
      .should('be.visible')
      .and('have.attr', 'href', '#acesso');

    cy.contains('Já tenho conta')
      .should('be.visible')
      .and('have.attr', 'href', '#login');
  });
});

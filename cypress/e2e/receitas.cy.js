describe('Receitas da Vó - fluxo inicial', () => {
  it('permite login a partir da landing page', () => {
    cy.visit('/');

    cy.contains('Receitas da Vó').should('be.visible');
    cy.contains('Quero me cadastrar').should('be.visible');
    cy.get('#login-form').should('be.visible');

    cy.get('#login-form button[type="submit"]').click();
    cy.contains('Bem-vindo, Guardião da Memória.').should('be.visible');
  });
});

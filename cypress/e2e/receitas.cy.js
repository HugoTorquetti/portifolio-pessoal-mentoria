describe('Receitas da Vó - fluxo inicial', () => {
  it('permite login a partir da landing page e redireciona para a área autenticada', () => {
    cy.visit('/');

    cy.contains('Receitas da Vó').should('be.visible');
    cy.get('#login-form').should('be.visible');

    cy.get('#login-form button[type="submit"]').click();

    cy.url().should('include', '/app.html');
    cy.contains('Olá, Guardião da Memória.').should('be.visible');
    cy.get('#session-user-name').should('contain', 'Guardião da Memória');
    cy.contains('Receitas').should('be.visible');
  });
});

describe('US05 - Receita completa para usuário autenticado', () => {
  it('exibe a receita completa para usuário logado', () => {
    cy.visit('/');

    cy.get('#email').clear().type('usuario@receitasdavo.com');
    cy.get('#password').clear().type('usuario123');
    cy.get('#login-form button[type="submit"]').click();

    cy.url().should('include', '/app.html');
    cy.contains('Receitas publicadas').should('be.visible');

    cy.contains('.recipe-preview-card', 'Bolo de Fubá da Vó Lurdes').within(() => {
      cy.contains('Ver receita completa').click();
    });

    cy.url().should('include', '/recipe.html?id=1');
    cy.contains('Bolo de Fubá da Vó Lurdes').should('be.visible');
    cy.contains('Resumo').should('be.visible');
    cy.contains('Checklist de sucesso').should('be.visible');
    cy.contains('Passo a passo').should('be.visible');
    cy.contains('Dica do especialista').should('be.visible');
    cy.get('#recipe-checklist li').should('have.length.at.least', 1);
    cy.get('#recipe-steps li').should('have.length.at.least', 1);
  });
});

describe('US04 - Prévia de receita para visitante', () => {
  it('exibe apenas uma prévia da receita e orienta login ou cadastro', () => {
    cy.visit('/', {
      onBeforeLoad(window) {
        window.localStorage.clear();
      }
    });

    cy.contains('.recipe-card', 'Bolo de Fubá da Vó Lurdes').within(() => {
      cy.contains('Ver detalhes').click();
    });

    cy.url().should('include', '/recipe.html?id=1');
    cy.contains('Bolo de Fubá da Vó Lurdes').should('be.visible');
    cy.contains('Resumo').should('be.visible');
    cy.contains('Receita de fim de tarde').should('be.visible');
    cy.get('#recipe-preview-cta').should('be.visible');
    cy.contains('Entre ou crie sua conta').should('be.visible');
    cy.get('#recipe-public-actions').should('be.visible');
    cy.get('#recipe-auth-shell').should('not.be.visible');
  });
});

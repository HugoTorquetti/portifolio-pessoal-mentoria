describe('Receitas da Vó - fluxo inicial', () => {
  it('exibe catálogo, permite login e consulta detalhe da receita', () => {
    cy.visit('/');

    cy.contains('Receitas da Vó').should('be.visible');
    cy.contains('Bolo de Fubá da Vó Lurdes').should('be.visible');

    cy.contains('Entrar como usuário').click();
    cy.contains('Bem-vindo, Guardião da Memória.').should('be.visible');

    cy.contains('Ver detalhes').first().click();
  });
});

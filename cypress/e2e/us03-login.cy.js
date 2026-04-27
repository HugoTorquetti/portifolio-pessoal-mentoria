describe('US03 - Login', () => {
  it('autentica o usuário com credenciais válidas', () => {
    cy.visit('/');

    cy.get('#email').clear().type('usuario@receitasdavo.com');
    cy.get('#password').clear().type('usuario123');
    cy.get('#login-form button[type="submit"]').click();

    cy.url().should('include', '/app.html');
    cy.contains('Olá, Guardião da Memória.').should('be.visible');
    cy.contains('Sua sessão está ativa').should('be.visible');
  });

  it('bloqueia login com credenciais inválidas', () => {
    cy.visit('/');

    cy.get('#email').clear().type('usuario@receitasdavo.com');
    cy.get('#password').clear().type('senha-incorreta');
    cy.get('#login-form button[type="submit"]').click();

    cy.url().should('not.include', '/app.html');
    cy.get('#feedback-modal').should('be.visible');
    cy.contains('Não foi possível entrar.').should('be.visible');
    cy.contains('Credenciais inválidas.').should('be.visible');
    cy.contains('Sessão autenticada').should('not.exist');
  });
});

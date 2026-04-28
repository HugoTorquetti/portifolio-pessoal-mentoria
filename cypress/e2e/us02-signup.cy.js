describe('US02 - Cadastro de usuário', () => {
  it('cadastra um visitante com dados válidos', () => {
    const uniqueEmail = `nova.guardiao.${Date.now()}@example.com`;

    cy.visit('/');

    cy.get('#signup-name').type('Nova Guardiã');
    cy.get('#signup-email').type(uniqueEmail);
    cy.get('#signup-password').type('senha123');
    cy.get('#signup-form button[type="submit"]').click();

    cy.get('#feedback-modal').should('be.visible');
    cy.contains('Sua conta foi criada.').should('be.visible');
    cy.contains('Conta criada com sucesso. Agora você já pode entrar.').should('be.visible');
    cy.get('body').should('have.class', 'modal-open');
    cy.get('#feedback-close').click();
    cy.get('#feedback-modal').should('not.be.visible');
    cy.get('body').should('not.have.class', 'modal-open');
    cy.get('#signup-name').should('have.value', '');
    cy.get('#signup-email').should('have.value', '');
  });

  it('impede cadastro com e-mail já existente', () => {
    cy.visit('/');

    cy.get('#signup-name').type('Guardiã repetida');
    cy.get('#signup-email').type('usuario@receitasdavo.com');
    cy.get('#signup-password').type('senha123');
    cy.get('#signup-form button[type="submit"]').click();

    cy.get('#feedback-modal').should('be.visible');
    cy.contains('Seu cadastro não pôde ser concluído.').should('be.visible');
    cy.contains('E-mail já cadastrado.').should('be.visible');
    cy.get('#feedback-close').click();
    cy.get('#feedback-modal').should('not.be.visible');
  });

  it('impede cadastro com e-mail em formato inválido', () => {
    cy.visit('/');

    cy.get('#signup-name').type('Luke Skywalker');
    cy.get('#signup-email').type('luke@jedi');
    cy.get('#signup-password').type('123456');
    cy.get('#signup-form button[type="submit"]').click();

    cy.get('#feedback-modal').should('be.visible');
    cy.contains('Seu cadastro não pôde ser concluído.').should('be.visible');
    cy.contains('E-mail em formato inválido.').should('be.visible');
  });
});

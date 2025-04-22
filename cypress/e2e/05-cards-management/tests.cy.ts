describe('cards-management', () => {
  beforeEach(() => {
    cy.task('resetDb');
  });

  it('client requests a card for himself', () => {
    cy.loginBaseClient();
    const secret = cy.perform2FASetup();
    cy.get('button[id="cards-tab"]').click();
    cy.get('button[id="card-myself"]').click();
    secret.then((s) => {
      cy.generateTotp(s).then((code) => {
        cy.get('input[name="otp"]').type(`${code}{enter}`);
      });
    });

    cy.contains('No results.').should('not.exist');
  });

  it('client should be able to block his card', () => {
    cy.loginBaseClient();
    const secret = cy.perform2FASetup();
    cy.get('button[id="cards-tab"]').click();
    cy.get('button[id="card-myself"]').click();
    secret.then((s) => {
      cy.generateTotp(s).then((code) => {
        cy.get('input[name="otp"]').type(`${code}{enter}`);
      });
    });

    cy.contains('No results.').should('not.exist');
    cy.get('button[id="block-0"]').click({ force: true });
    cy.get('button[id="confirm-dialog-confirm"]').click();
    cy.get('tbody > tr > td:nth-of-type(5)')
      .invoke('text')
      .should('eq', 'BLOCKED');
  });

  it('employee should be able to unblock a card', () => {
    cy.loginBaseClient();
    const secret = cy.perform2FASetup();
    cy.get('button[id="cards-tab"]').click();
    cy.get('button[id="card-myself"]').click();
    secret.then((s) => {
      cy.generateTotp(s).then((code) => {
        cy.get('input[name="otp"]').type(`${code}{enter}`);
      });
    });

    cy.contains('No results.').should('not.exist');
    cy.get('button[id="block-0"]').click({ force: true });
    cy.get('button[id="confirm-dialog-confirm"]').click();
    cy.get('tbody > tr > td:nth-of-type(5)')
      .invoke('text')
      .should('eq', 'BLOCKED');

    cy.logout();
    cy.loginAdminEmployee();

    cy.visit('/e/cards');
    cy.contains('button', 'Unblock').click();
    cy.get('button[id="confirm-dialog-confirm"]').click();

    cy.contains('Card unblocked successfully').should('be.visible');
  });
});

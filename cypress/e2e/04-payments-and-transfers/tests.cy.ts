describe('payments-and-transfers', () => {
  beforeEach(() => {
    cy.task('resetDb');
  });

  it('client makes a payment to another client', () => {
    cy.loginBaseClient();
    const secret = cy.perform2FASetup();
    cy.contains('1,000 RSD').should('exist');
    cy.visit('/c/transactions/new-payment');
    cy.get('button[name="savedRecipient"]').click();
    cy.contains('span', 'Jane Smith').click();
    cy.get('button[id="payerAccount"]').click();
    cy.get('span[id="account-0"]').click();
    cy.get('input[name="amount"]').clear();
    cy.get('input[name="amount"]').type('100');
    cy.get('input[name="paymentPurpose"]').type('clown college tuition');
    cy.get('button[type="submit"]').click();
    secret.then((s) => {
      cy.generateTotp(s).then((code) => {
        cy.get('input[name="otp"]').type(`${code}{enter}`);
      });
    });

    cy.visit('/c');
    cy.contains('1,000 RSD').should('not.exist');
  });

  it('client cannot make a payment due do insufficient funds', () => {
    cy.loginBaseClient();
    const secret = cy.perform2FASetup();
    cy.contains('1,000 RSD').should('exist');
    cy.visit('/c/transactions/new-payment');
    cy.get('button[name="savedRecipient"]').click();
    cy.contains('span', 'Jane Smith').click();
    cy.get('button[id="payerAccount"]').click();
    cy.get('span[id="account-0"]').click();
    cy.get('input[name="amount"]').clear();
    cy.get('input[name="amount"]').type('1000000');
    cy.get('input[name="paymentPurpose"]').type('clown college tuition');
    cy.get('button[type="submit"]').click();
    secret.then((s) => {
      cy.generateTotp(s).then((code) => {
        cy.get('input[name="otp"]').type(`${code}{enter}`);
      });
    });

    cy.visit('/c');
    cy.contains('1,000 RSD').should('exist');
  });
});

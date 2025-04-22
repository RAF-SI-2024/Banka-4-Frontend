describe('loan-management', () => {
  beforeEach(() => {
    cy.task('resetDb');
  });

  it('client should be able to request a loan', () => {
    cy.loginBaseClient();
    cy.perform2FASetup();

    cy.visit('/c/loans/request');
    cy.get('select[name="loanType"]').select(1, { force: true });
    cy.get('select[name="interestType"]').select(1, { force: true });
    cy.get('input[name="amount"]').type('10000');
    cy.get('select[name="currency"]').select('RSD', { force: true });
    cy.get('input[name="purposeOfLoan"]').type('clown college payment');
    cy.get('input[name="monthlyIncome"]').clear();
    cy.get('input[name="monthlyIncome"]').type('69000');
    cy.get('select[name="employmentStatus"]').select('PERMANENT', {
      force: true,
    });
    cy.get('input[name="employmentPeriod"]').type('1');
    cy.get('select[name="repaymentPeriod"]').select(1, { force: true });
    cy.get('input[name="contactPhone"]').type('+381634597632');
    cy.contains('Select account').click();
    cy.contains('span', '4440001000000000512').click();

    cy.get('button[type="submit"]').click();

    cy.location('pathname').should('eq', '/c/loans/request/success');
  });

  it('employee should be able to approve a loan', () => {
    cy.loginBaseClient();
    cy.perform2FASetup();

    cy.visit('/c/loans/request');
    cy.get('select[name="loanType"]').select(1, { force: true });
    cy.get('select[name="interestType"]').select(1, { force: true });
    cy.get('input[name="amount"]').type('10000');
    cy.get('select[name="currency"]').select('RSD', { force: true });
    cy.get('input[name="purposeOfLoan"]').type('clown college payment');
    cy.get('input[name="monthlyIncome"]').clear();
    cy.get('input[name="monthlyIncome"]').type('69000');
    cy.get('select[name="employmentStatus"]').select('PERMANENT', {
      force: true,
    });
    cy.get('input[name="employmentPeriod"]').type('1');
    cy.get('select[name="repaymentPeriod"]').select(1, { force: true });
    cy.get('input[name="contactPhone"]').type('+381634597632');
    cy.contains('Select account').click();
    cy.contains('span', '4440001000000000512').click();

    cy.get('button[type="submit"]').click();

    cy.location('pathname').should('eq', '/c/loans/request/success');
    cy.visit('/c');

    cy.logout();
    cy.loginAdminEmployee();
    cy.visit('/e/loans/requests');
    cy.contains('Approve').click();
    cy.get('button[id="confirm-dialog-confirm"]').click();
    cy.contains('No results.').should('exist');

    cy.logout();
    cy.loginBaseClient();
    cy.contains('11,000 RSD').should('be.visible');
  });
});

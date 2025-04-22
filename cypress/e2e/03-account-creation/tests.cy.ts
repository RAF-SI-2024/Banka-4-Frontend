describe('account-creation', () => {
  beforeEach(() => {
    cy.task('resetDb');
  });

  it('employee should be able to create a personal checking account for client', () => {
    cy.loginAdminEmployee();
    cy.visit('/e/accounts/new');
    cy.get('button:first-child');
    cy.contains('span', 'pick an existing client').click();
    cy.get('input[name="firstName"]').type('Daniel{enter}');
    cy.get('tbody > tr:nth-child(1)').click();
    cy.contains('span', 'Personal').click();
    cy.get('input[name="amount"]').type('10000{enter}');
    cy.contains('Account was successfully created. Congrats!').should(
      'be.visible'
    );
  });

  it('employee should be able to create a personal fx account for client', () => {
    cy.loginAdminEmployee();
    cy.visit('/e/accounts/new');
    cy.get('button:first-child');
    cy.contains('span', 'pick an existing client').click();
    cy.get('input[name="firstName"]').type('Daniel{enter}');
    cy.get('tbody > tr:nth-child(1)').click();
    cy.contains('span', 'Personal').click();
    cy.get('input[name="amount"]').clear();
    cy.get('input[name="amount"]').type('500');
    cy.get("button[role='combobox']").click();
    cy.contains('span', 'EUR').click();
    cy.get("button[type='submit']").click();
    cy.contains('Account was successfully created. Congrats!').should(
      'be.visible'
    );
  });
});

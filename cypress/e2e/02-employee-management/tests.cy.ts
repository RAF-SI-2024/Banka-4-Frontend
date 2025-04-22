describe('employee-management', () => {
  beforeEach(() => {
    cy.task('resetDb');
  });

  it('admin should be able to create a new employee', () => {
    cy.loginAdminEmployee();
    cy.visit('/e/employee/new');
    cy.get("input[name='firstName']").type('Test');
    cy.get("input[name='lastName']").type('Testović');
    cy.get('#dateOfBirth').click();
    cy.get("button[name='previous-month']").click();
    cy.get("button[tabindex='0']").click();
    cy.get("input[name='email']").type('test.testovic@gmail.com');
    cy.get("input[name='address']").type('Trg Mučenika 5');
    cy.get("input[name='phoneNumber']").type('+381634859324');
    cy.get("input[name='position']").type('Klovn');
    cy.get("input[name='username']").type('kys');
    cy.get("input[name='department']").type('Cirkus');
    cy.get("button[type='submit']").click();

    cy.contains('Employee created successfully').should('be.visible');
  });

  it('admin should be able to change employee information', () => {
    cy.loginAdminEmployee();
    cy.visit('/e/employee');
    cy.get("input[name='firstName']").type('Robert{enter}');
    cy.get('tbody > tr:nth-child(1)').click();
    cy.get("input[name='firstName']").type('changed{enter}');
    cy.contains('Employee updated successfully').should('be.visible');
  });

  it('admin should be able to deactivate employee', () => {
    cy.loginAdminEmployee();
    cy.visit('/e/employee');
    cy.get("input[name='firstName']").type('Robert{enter}');
    cy.get('tbody > tr:nth-child(1)').click();
    cy.get("button[role='switch']").click();
    cy.get("button[type='submit']").click();
    cy.contains('Employee updated successfully').should('be.visible');
    cy.get("input[name='firstName']").type('Rober{enter}');
    cy.get('tbody > tr:nth-child(1) > td:last-child').should('have.text', 'No');
  });
});

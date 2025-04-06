const LOGIN_PAGE_PATH = 'auth/login';
const EMPLOYEE_HOME_PATH = '/e';

describe('user-auth', () => {
  beforeEach(() => {
    /* TODO: get base url from env */
    cy.visit(`http://localhost:3000/${LOGIN_PAGE_PATH}`);
  });
  it('visit login page and login with valid employee account', () => {
    cy.get('#employee-tab').click();

    cy.fixture('valid-employee-admin').then((creds) => {
      cy.get('input[name="email"]').type(creds.email);
      cy.get('input[name="password"]').type(creds.password);
    });
    cy.get('button[type="submit"]').click();
    cy.url().should('include', EMPLOYEE_HOME_PATH);
  });

  it('visit login page and login with invalid employee account', () => {
    cy.get('#employee-tab').click();

    cy.get('input[name="email"]').type('asdf@asdf.com');
    cy.get('input[name="password"]').type('invalidPassword');

    cy.get('button[type="submit"]').click();
    cy.url().should('include', LOGIN_PAGE_PATH);
    cy.contains('Incorrect credentials').should('be.visible');
  });

  it('employee requests a forgot password link', () => {
    cy.get('#employee-tab').click();

    cy.get('span[aria-haspopup=\'dialog\']').click();
    cy.fixture('valid-employee-admin').then((creds) => {
      cy.get('#forgot-password-input').type(`${creds.email}{enter}`);
    })
    cy.contains('Reset password email sent.').should('exist');
  });
});

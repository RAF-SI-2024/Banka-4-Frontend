/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
import { authenticator } from 'otplib';
import { LOGIN_PAGE_PATH } from './consts';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      loginAdminEmployee(): Chainable<void>;

      loginBaseClient(): Chainable<void>;

      logout(): Chainable<void>;

      perform2FASetup(): Chainable<string>;

      generateTotp(secret: string): Chainable<string>;
    }
  }
}

Cypress.Commands.add('loginAdminEmployee', () => {
  cy.visit(LOGIN_PAGE_PATH);
  cy.get('#employee-tab').click();
  cy.fixture('valid-employee-admin').then((creds) => {
    cy.get('input[name="email"]').type(creds.email);
    cy.get('input[name="password"]').type(creds.password);
    cy.get('button[type=submit]').click();
  });
  cy.location('pathname').should('eq', '/e');
});

Cypress.Commands.add('loginBaseClient', () => {
  cy.visit(LOGIN_PAGE_PATH);
  cy.get('#client-tab').click();
  cy.fixture('valid-client-base').then((creds) => {
    cy.get('input[name="email"]').type(creds.email);
    cy.get('input[name="password"]').type(creds.password);
    cy.get('button[type=submit]').click();
  });

  cy.location('pathname').should('eq', '/c');
});

Cypress.Commands.add('perform2FASetup', () => {
  cy.location('pathname').should('eq', '/c/onboarding');
  cy.contains('button', '2FA').click();
  cy.get('#secret')
    .invoke('text')
    .then((secret) => {
      cy.generateTotp(secret).then((code) => {
        cy.get('input[name="otp"]').type(code);
        cy.get('#verify').click();
        cy.wrap(secret);
      });
    });
});

Cypress.Commands.add('logout', () => {
  cy.get('#sidebar-me').click();
  cy.get('#sidebar-logout').click();
  cy.location('pathname').should('eq', '/auth/login');
});

Cypress.Commands.add('generateTotp', (secret) => {
  const code = authenticator.generate(secret);
  return cy.wrap(code);
});

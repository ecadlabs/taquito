/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton } from './base'

describe('Taquito Live Code Examples - Originate - wallet', () => {

  Cypress.config('defaultCommandTimeout', 30000);
  beforeEach(() => { cy.visit(base_url + "originate").contains(disclaimer) })

  it('a. Initializing storage using a Plain Old JavaScript Object - wallet', () => {
    cy.get(runButton).eq(1).click({ force: true })
    cy.window().then(function (p) {
      cy.stub(p, "prompt").returns("Beacon");
    });
  })

  it('b. Initializing storage using a plain Michelson Expression for initial storage - wallet', () => {
    cy.get(runButton).eq(3).click({ force: true })
    cy.window().then(function (p) {
      cy.stub(p, "prompt").returns("Beacon");
    });
  })

  it('c. Initializing storage using a JSON encoded Michelson Expression for initial storage - wallet', () => {
    cy.get(runButton).eq(5).click({ force: true })
    cy.window().then(function (p) {
      cy.stub(p, "prompt").returns("Beacon");
    });
  })
})
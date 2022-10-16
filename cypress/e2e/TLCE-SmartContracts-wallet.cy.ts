/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton } from './base'

describe('Taquito Live Code Examples - Smart Contract Interaction  - wallet', () => {

  Cypress.config('defaultCommandTimeout', 30000);
  const page_under_test = base_url + 'smartcontracts'

  it('Loading the contract in Taquito - wallet', () => {
    // requires Contract "IncrementContract"
    cy.visit(page_under_test).contains(disclaimer)
    cy.get(runButton).eq(1).click({ force: true })
    cy.window().then(function (p) {
      cy.stub(p, "prompt").returns("Beacon");
    });
  })

  it('Calling the Increment function - wallet', () => {
    // requires Contract "IncrementContract"
    cy.visit(page_under_test).contains(disclaimer)
    cy.get(runButton).eq(3).click({ force: true })
    cy.window().then(function (p) {
      cy.stub(p, "prompt").returns("Beacon");
    });
  })

  it('Inspect the transfer params produced by Taquito using the toTransferParams() method - wallet', () => {
    // requires Contract "IncrementContract"
    cy.visit(page_under_test).contains(disclaimer)
    cy.get(runButton).eq(3).click({ force: true })
    cy.window().then(function (p) {
      cy.stub(p, "prompt").returns("Beacon");
    });
  })
})
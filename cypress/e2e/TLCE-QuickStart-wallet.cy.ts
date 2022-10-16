/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton } from './base'

describe('Taquito Live Code Examples', () => {

  Cypress.config('defaultCommandTimeout', 20000);
  const page_under_test = base_url + 'quick_start/'

  it('Transfer - wallet', () => {
    cy.visit(page_under_test).contains(disclaimer)
    cy.get(runButton).eq(2).click({ force: true })
    cy.window().then(function (p) {
      cy.stub(p, "prompt").returns("Beacon");
    });
  })

  it('Interact with a smart contract - wallet', () => {
    // requires Contract "IncrementContract"
    cy.visit(page_under_test).contains(disclaimer)
    cy.get(runButton).eq(4).click({ force: true })
    cy.window().then(function (p) {
      cy.stub(p, "prompt").returns("Beacon");
    });
  })
})
/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton } from './base'

describe('Taquito Live Code Examples - On-chain views  - wallet', () => {

  Cypress.config('defaultCommandTimeout', 30000);
  const page_under_test = base_url + 'on_chain_views'

  it('Calling a contract entrypoint that makes a call to a view  - wallet', () => {
    // requires Contract "ContractCallFib"
    // requires Contract "ContractOnChainViews"
    cy.visit(page_under_test).contains(disclaimer)
    cy.get(runButton).eq(1).click({ force: true })
    cy.window().then(function (p) {
      cy.stub(p, "prompt").returns("Beacon");
    });
  })

  it('Simulate a view execution - wallet', () => {
    // requires Contract "ContractCallFib"
    // requires Contract "ContractOnChainViews"
    cy.visit(page_under_test).contains(disclaimer)
    cy.get(runButton).eq(3).click({ force: true })
    cy.window().then(function (p) {
      cy.stub(p, "prompt").returns("Beacon");
    });
  })

  it('Inspect the transfer params produced by Taquito using the toTransferParams() method - wallet', () => {
    cy.visit(page_under_test).contains(disclaimer)
    cy.get(runButton).eq(3).click({ force: true })
    cy.window().then(function (p) {
      cy.stub(p, "prompt").returns("Beacon");
    });
  })
})
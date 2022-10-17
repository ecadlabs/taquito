/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton } from './base'

describe('Taquito Live Code Examples - Estimate Page', () => {

  Cypress.config('defaultCommandTimeout', 30000);
  const page_under_test = base_url + 'estimate'

  beforeEach(() => {
    cy.visit(page_under_test).contains(disclaimer)
  })

  it('Estimate a transfer operation - wallet', () => {
    
    cy.get(runButton).eq(1).click({ force: true })
    cy.window().then(function (p) {
      cy.stub(p, "prompt").returns("Beacon");
    });
  })

  it('Estimate a smart contract call - wallet', () => {
     // requires Contract "IncrementContract"
    
    cy.get(runButton).eq(3).click({ force: true })
    cy.window().then(function (p) {
      cy.stub(p, "prompt").returns("Beacon");
    });
  })

  it('Estimate a contract origination - wallet', () => { /// Taquito Test Contract "IncrementContract" at example/deploy-docs-live-code-contracts.ts
    
    cy.get(runButton).eq(5).click({ force: true })
    cy.window().then(function (p) {
      cy.stub(p, "prompt").returns("Beacon");
    });
  })
})
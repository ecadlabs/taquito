/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer } from './base'

describe('Taquito Live Code Examples', () => {

  Cypress.config('defaultCommandTimeout', 30000);
  beforeEach(() => { cy.visit(base_url + 'estimate').contains(disclaimer) })

  it('Estimate a transfer operation - contract', () => {
    cy.get("[class='button_G4Yn runButton_oaHB']").eq(0).click()
    cy.waitUntil(() => cy.get("[class='playgroundPreview_bb8I']").eq(0).contains('usingBaseFeeMutez'))
  })

  it('Estimate a smart contract call - contract', () => {
    // requires Contract "IncrementContract"
    cy.get("[class='button_G4Yn runButton_oaHB']").eq(2).click()
    cy.waitUntil(() => cy.get("[class='playgroundPreview_bb8I']").eq(2).contains('usingBaseFeeMutez'))
  })

  it('Estimate a contract origination - contract', () => { /// Taquito Test Contract "IncrementContract" at example/deploy-docs-live-code-contracts.ts
    cy.get("[class='button_G4Yn runButton_oaHB']").eq(4).click()
    cy.waitUntil(() => cy.get("[class='playgroundPreview_bb8I']").eq(4).contains('usingBaseFeeMutez'))
  })
})
/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton } from './base'

describe('Taquito Live Code Examples - Ledger Signer', () => {

  Cypress.config('defaultCommandTimeout', 30000);
  const page_under_test = base_url + "ledger_signer"

  it("Live example that iterates from the path 44'/1729'/0'/0' to 44'/1729'/9'/0'", () => {
    cy.visit(page_under_test).contains(disclaimer)
    cy.on('uncaught:exception', (err, runnable) => {
      console.log("err :" + err)
      console.log("runnable :" + runnable)
      return false
  })
    cy.get(runButton).eq(0).click()
  })
})
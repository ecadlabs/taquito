/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton, playgroundPreview } from './base'

describe('Taquito Live Code Examples - On-chain views - contract', () => {

  Cypress.config('defaultCommandTimeout', 60000);
  const page_under_test = base_url + "on_chain_views"

  beforeEach(() => {
    cy.visit(page_under_test).contains(disclaimer)
  })
  
  it('calling a contract entrypoint that makes a call to a view - contract', () => {
    // requires Contract "ContractCallFib"
    // requires Contract "ContractOnChainViews"
    
    cy.get(runButton).eq(0).click()
    cy.waitUntil(() => cy.get(playgroundPreview).eq(0).contains('corresponds to the value of the Fibonacci sequence'))
  })

  it('simulate a view execution - contract', () => {
    // requires Contract "ContractCallFib"
    // requires Contract "ContractOnChainViews"
    
    cy.get(runButton).eq(2).click()
    cy.waitUntil(() => cy.get(playgroundPreview).eq(2).contains('The result of the view simulation is'))
  })
})
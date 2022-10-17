/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton, playgroundPreview } from './base'

describe('Taquito Live Code Examples - Smart Contract Interaction - contract', () => {

  Cypress.config('defaultCommandTimeout', 60000);
  const page_under_test = base_url + "smartcontracts"

  beforeEach(() => {
    cy.visit(page_under_test).contains(disclaimer)
  })

  it('Loading the contract in Taquito - contract', () => {
    // requires Contract "IncrementContract"
    
    cy.get(runButton).eq(0).click()
    cy.waitUntil(() => cy.get(playgroundPreview).eq(0).contains('decrement'))
  })

  it('Inspect the transfer params produced by Taquito using the toTransferParams() method - contract', () => {
    // requires Contract "IncrementContract"
    
    cy.get(runButton).eq(2).click()
    cy.waitUntil(() => cy.get(playgroundPreview).eq(2).contains('amount'))
  })

  it('Calling the Increment function - contract', () => {
    // requires Contract "IncrementContract"
    
    cy.get(runButton).eq(4).click()
    cy.waitUntil(() => cy.get(playgroundPreview).eq(4).contains('Operation injected'))
  })

  it('Choosing between the methods or methodsObject members to interact with smart contracts - flattened arguments', () => {
    // requires Contract "BigMapsComplexStorageContract"
    
    cy.get(runButton).eq(6).click()
    cy.waitUntil(() => cy.get(playgroundPreview).eq(6).contains('"address",'))
  })

  it('Choosing between the methods or methodsObject members to interact with smart contracts - parameter as object', () => {
    // requires Contract "BigMapsComplexStorageContract"
    
    cy.get(runButton).eq(7).click({ force: true })
    cy.waitUntil(() => cy.get(playgroundPreview).eq(7).contains('Operation injected'))
  })
})
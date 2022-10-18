/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton, playgroundPreview } from './base'

describe('Taquito Live Code Examples - Lambda Views', () => {

  Cypress.config('defaultCommandTimeout', 30000);
  beforeEach(() => { cy.visit(base_url + 'lambda_view').contains(disclaimer) })

  it('Return contract.views.getTotalSupply', () => {
    // requires Contract "LambdaViewContract"        
    cy.get(runButton).eq(0).click()
    cy.waitUntil(() => cy.get(playgroundPreview).eq(0).contains('100'))
  })

  it('Return contract.views.getBalance for tz address', () => {
    // requires Contract from integration-tests/contract-lambda-view.spec.ts      
    cy.get(runButton).eq(1).click()
    cy.waitUntil(() => cy.get(playgroundPreview).eq(1).contains('50'))
  })

  it('Return contract.views.balance_of', () => {
    // requires Contract "LambdaViewTwo"      
    cy.get(runButton).eq(2).click()
    cy.waitUntil(() => cy.get(playgroundPreview).eq(2).contains('balance'))
  })

  it('Return contract.views.getBalance for KT1 address', () => {
    // requires Contract "LambdaViewContract" 
    cy.get(runButton).eq(3).click()
    cy.waitUntil(() => cy.get(playgroundPreview).eq(3).contains('50'))
  })
})
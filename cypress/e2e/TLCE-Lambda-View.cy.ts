/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton, playgroundPreview } from './base'

describe('Taquito Live Code Examples - Lambda Views', () => {

  Cypress.config('defaultCommandTimeout', 30000);
  const page_under_test = base_url + 'lambda_view'

  it('Return contract.views.getTotalSupply', () => {
    cy.visit(page_under_test).contains(disclaimer)
    cy.get(runButton).eq(0).click()
    cy.waitUntil(() => cy.get(playgroundPreview).eq(0).contains('100'))
  })

  it('Return contract.views.getBalance for tz address', () => {
    cy.visit(page_under_test).contains(disclaimer)
    cy.get(runButton).eq(1).click()
    cy.waitUntil(() => cy.get(playgroundPreview).eq(1).contains('50'))
  })

  it('Return contract.views.balance_of', () => {
    cy.visit(page_under_test).contains(disclaimer)
    cy.get(runButton).eq(2).click()
    cy.waitUntil(() => cy.get(playgroundPreview).eq(2).contains('balance'))
  })

  it('Return contract.views.getBalance for KT1 address', () => {
    cy.visit(page_under_test).contains(disclaimer)
    cy.get(runButton).eq(3).click()
    cy.waitUntil(() => cy.get(playgroundPreview).eq(3).contains('50'))
  })
})
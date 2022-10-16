/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton, playgroundPreview } from './base'

describe('Taquito Live Code Examples - Tzip12 Token Metadata - contract', () => {

  Cypress.config('defaultCommandTimeout', 60000);
  const page_under_test = base_url + "tzip12"

  it('The token metadata are obtained from an off-chain view token_metadata - contract', () => {
    cy.visit(page_under_test).contains(disclaimer)
    cy.get(runButton).eq(0).click()
    cy.waitUntil(() => cy.get(playgroundPreview).eq(0).contains('AliceToken'))
    })

  it('Calling the off-chain view token_metadata using the taquito-tzip16 package - contract', () => {
    cy.visit(page_under_test).contains(disclaimer)
    cy.get(runButton).eq(2).click()
    cy.waitUntil(() => cy.get(playgroundPreview).eq(2).contains('AliceToken'))
  })

  it('The token metadata are found in the big map %token_metadata - contract', () => {
    cy.visit(page_under_test).contains(disclaimer)
    cy.get(runButton).eq(4).click()
    cy.waitUntil(() => cy.get(playgroundPreview).eq(4).contains('token_id'))
  })
})
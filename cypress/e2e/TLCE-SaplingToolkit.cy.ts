/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton, playgroundPreview } from './base'

describe('Taquito Live Code Examples - Sapling Toolkit', () => {

  Cypress.config('defaultCommandTimeout', 60000);
  const page_under_test = base_url + 'sapling'

  describe('Sapling Toolkit', () => {

    it('How to retrieve my balance in the Sapling shielded pool?', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(0).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(0).contains("Alice's balance is"))
    })

    it('How to retrieve my transaction history?', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(1).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(1).contains("Alice's transaction history is"))
    })

    it('How to prepare a shielded transaction?', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(2).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(2).contains('Operation injected'))
    })

    it('How to prepare a Sapling transaction?', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(3).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(3).contains('Operation injected'))
    })

    it('How to prepare an unshielded transaction?', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(4).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(4).contains('prim'))
    })

    it('The Execute method', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(5).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(5).contains('stored_counter'))
    })

    it('Example for the big_map type', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(6).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(6).contains('Default value returned by the Michelson Encoder for big_map'))
    })

    it('Example for the ticket type', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(7).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(7).contains('Default representation of the ticket value returned by the Michelson Encoder'))
    })
  })
  describe('The ParameterSchema class', () => {

    it('The Encode method expects flattened parameters instead of a javascript object.', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(8).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(8).contains('string'))
    })
  })
})
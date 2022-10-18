/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton, playgroundPreview } from './base'

describe('Taquito Live Code Examples - Sapling Toolkit', () => {

  Cypress.config('defaultCommandTimeout', 120000);
  beforeEach(() => { cy.visit(base_url + 'sapling').contains(disclaimer) })

  describe('Sapling Toolkit', () => {

    it('How to retrieve my balance in the Sapling shielded pool?', () => {
      cy.get(runButton).eq(0).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(0).contains("Alice's balance is"))
    })

    it('How to retrieve my transaction history?', () => {
      cy.get(runButton).eq(1).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(1).contains("Alice's transaction history is"))
    })

    it('How to prepare a shielded transaction?', () => {
      cy.get(runButton).eq(2).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(2).contains('Operation injected'))
    })

    it('How to prepare a Sapling transaction?', () => {
      cy.get(runButton).eq(3).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(3).contains('Operation injected'))
    })

    it('How to prepare an unshielded transaction?', () => {
      cy.get(runButton).eq(4).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(4).contains('Operation injected'))
    })
  })
})
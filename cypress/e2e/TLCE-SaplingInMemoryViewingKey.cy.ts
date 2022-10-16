/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton, playgroundPreview } from './base'

describe('Taquito Live Code Examples - Sapling In Memory Viewing Key', () => {

  Cypress.config('defaultCommandTimeout', 60000);
  const page_under_test = base_url + 'sapling'

  describe('Sapling InMemoryViewingKey', () => {

    it('Instantiation from an unencrypted spending key', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(0).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(0).contains('The viewing key is'))
    })

    it('Instantiation from an encrypted spending key', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(1).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(1).contains('The viewing key is'))
    })

    it('How to retrieve payment addresses from the viewing key', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(2).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(2).contains('The address is'))
    })
  })
})
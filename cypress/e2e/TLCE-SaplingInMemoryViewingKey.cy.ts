/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton, playgroundPreview } from './base'

describe('Taquito Live Code Examples - Sapling In Memory Viewing Key', () => {

  Cypress.config('defaultCommandTimeout', 60000);
  beforeEach(() => { cy.visit(base_url + 'sapling_in_memory_viewing_key').contains(disclaimer) })

  describe('Sapling InMemoryViewingKey', () => {

    it('Instantiation from an unencrypted spending key', () => {
      cy.get(runButton).eq(0).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(0).contains('The viewing key is'))
    })

    it('Instantiation from an encrypted spending key', () => {
      cy.get(runButton).eq(1).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(1).contains('The viewing key is'))
    })

    it('How to retrieve payment addresses from the viewing key', () => {
      cy.get(runButton).eq(2).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(2).contains('The address is'))
    })
  })
})
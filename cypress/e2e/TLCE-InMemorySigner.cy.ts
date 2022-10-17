/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton, playgroundPreview } from './base'

describe('Taquito Live Code Examples - In Memory Signer', () => {

  Cypress.config('defaultCommandTimeout', 30000);
  const page_under_test = base_url + 'inmemory_signer'

  describe('Loading an unencrypted private key', () => {

    beforeEach(() => {
      cy.visit(page_under_test).contains(disclaimer)
    }) 

    it('Example with unencrypted private keys #1', () => {
      
      cy.get(runButton).eq(0).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(0).contains('The public key hash associated is'))
    })

    it('Example with unencrypted private keys #2', () => {
      
      cy.get(runButton).eq(1).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(1).contains('The public key hash associated i'))
    })

    it('Example with a hex string', () => {
      
      cy.get(runButton).eq(2).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(2).contains('The secret is encoded in base58'))
    })
  })

  describe('Loading an encrypted private key with a passphrase', () => {

    it('Example with encrypted private keys where the passphrase used is test #1', () => {
      
      cy.get(runButton).eq(3).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(3).contains('The public key hash associated is'))
    })

    it('Example with encrypted private keys where the passphrase used is test #2', () => {
      
      cy.get(runButton).eq(4).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(4).contains('The public key hash associated is'))
    })

    it('Example with encrypted private keys where the passphrase used is test #3', () => {
      
      cy.get(runButton).eq(5).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(5).contains('The public key hash associated is'))
    })
  })
})
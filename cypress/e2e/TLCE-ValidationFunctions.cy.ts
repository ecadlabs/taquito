/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton, playgroundPreview } from './base'

describe('Taquito Live Code Examples - Validation functions', () => {

  Cypress.config('defaultCommandTimeout', 30000);
  const page_under_test = base_url + 'validators'

  describe('Validate an address', () => {

    it('Call with a valid public key hash and then call with same pkh with one character different', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(0).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(0).contains('returns 3'))
      cy.waitUntil(() => cy.get(playgroundPreview).eq(0).contains('returns 1'))
    })

    it('Example with a pkh and an invalid one where the prefix is missing', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(1).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(1).contains('returns 3'))
      cy.waitUntil(() => cy.get(playgroundPreview).eq(1).contains('returns 0'))
    })

    it('Example with the address of an existing contract', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(2).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(2).contains('returns 3'))
    })
  })

  describe('Validate a chain', () => {

    it('Valid result when using the mainnet chain id and an invalid result if the prefix is missing', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(3).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(3).contains('returns 3'))
      cy.waitUntil(() => cy.get(playgroundPreview).eq(3).contains('returns 0'))
    })
  })

  describe('Validate a public key', () => {

    it('Check if a public key is valid', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(4).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(4).contains('returns 3'))
      cy.waitUntil(() => cy.get(playgroundPreview).eq(4).contains('returns 0'))
    })
  })

  describe('Validate a Signature', () => {

    it('Check if a signature is valid', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(5).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(5).contains('returns 3'))
      cy.waitUntil(() => cy.get(playgroundPreview).eq(5).contains('returns 1'))
    })
  })

  describe('Validate a Block Hash', () => {

    it('Check whether a block hash is valid', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(6).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(6).contains('returns 3'))
      cy.waitUntil(() => cy.get(playgroundPreview).eq(6).contains('returns 1'))
    })
  })

  describe('Validate an Operation Hash', () => {

    it('Check whether an operation hash is valid', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(7).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(7).contains('returns 3'))
      cy.waitUntil(() => cy.get(playgroundPreview).eq(7).contains('returns 1'))
    })
  })

  describe('Validate a Protocol Hash', () => {

    it('Check whether a protocol hash is valid', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(8).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(8).contains('returns 3'))
      cy.waitUntil(() => cy.get(playgroundPreview).eq(8).contains('returns 1'))
    })
  })

  describe('Verification of a signature', () => {

    it('Example of a successful verification', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(9).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(9).contains('true'))
    })
  })
})
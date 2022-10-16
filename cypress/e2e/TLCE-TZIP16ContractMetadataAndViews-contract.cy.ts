/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton, playgroundPreview } from './base'

describe('Taquito Live Code Examples - TZIP-16 Contract Metadata and Views - contract', () => {

  Cypress.config('defaultCommandTimeout', 60000);
  const page_under_test = base_url + "metadata-tzip16"

  describe('Get the metadata - contract', () => {

    it('Tezos-storage example - contract', () => {
      // requires Contract "Tzip16StorageContract"
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(0).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(0).contains('A metadata test'))
    })

    it('HTTPS example - contract', () => {
      // requires Contract " Tzip16HTTPSContract"
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(2).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(2).contains('Taquito test with valid metadata'))
    })

    it('Example having a SHA256 hash - contract', () => {
      // requires Contract "Tzip16SHA256Contract"
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(4).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(4).contains('This is metadata test for Taquito integration tests'))
    })

    it('IPFS example - contract', () => {
      // requires Contract "Tzip16IPFSContract"
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(6).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(6).contains('The MIT License'))
    })
  })

  describe('Execute off-chain views - contract', () => {

    it('Run a view named someJson - contract', () => {
      // requires Contract "Tzip16OnChainContractJSON"
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(8).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(8).contains('1000RandomCharacters'))
    })

    it('Run a view named multiply-the-nat-in-storage - contract', () => {
      // requires Contract "Tzip16OnChainContractMultiply"
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(10).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(10).contains('multiply-negative-number-or-call-failwith'))
    })
  })

  describe('Execute a custom view - contract', () => {
    // requires Contract "Tzip16OnChainContractMultiply"
    it('Execute the view multiply-the-nat-in-storage in a custom way - contract', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(12).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(12).contains('Result of the custom view'))
    })
  })
})
/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton, playgroundPreview } from './base'

describe('Taquito Live Code Examples - TZIP-16 Contract Metadata and Views - contract', () => {

  Cypress.config('defaultCommandTimeout', 60000);
  const page_under_test = base_url + "metadata-tzip16"

  describe('Get the metadata - contract', () => {

    it('Tezos-storage example - contract', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(0).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(0).contains('AliceToken'))
    })

    it('HTTPS example - contract', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(2).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(2).contains('AliceToken'))
    })

    it('Example having a SHA256 hash - contract', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(4).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(4).contains('token_id'))
    })

    it('IPFS example - contract', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(6).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(6).contains('token_id'))
    })
  })

  describe('Execute off-chain views - contract', () => {

    it('Run a view named someJson - contract', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(8).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(8).contains('token_id'))
    })

    it('Run a view named multiply-the-nat-in-storage - contract', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(10).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(10).contains('token_id'))
    })
  })

  describe('Execute a custom view - contract', () => {

    it('Execute the view multiply-the-nat-in-storage in a custom way - contract', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(12).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(12).contains('token_id'))
    })
  })
})
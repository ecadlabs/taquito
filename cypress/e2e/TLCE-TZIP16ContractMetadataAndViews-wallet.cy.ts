/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton } from './base'

describe('Taquito Live Code Examples - TZIP-16 Contract Metadata and Views  - wallet', () => {

  Cypress.config('defaultCommandTimeout', 30000);
  const page_under_test = base_url + 'metadata-tzip16'

  describe('Get the metadata - contract', () => {

    it('Tezos-storage example  - wallet', () => {
      // requires Contract "Tzip16StorageContract"
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(1).click({ force: true })
      cy.window().then(function (p) {
        cy.stub(p, "prompt").returns("Beacon");
      });
    })

    it('HTTPS example - wallet', () => {
      // requires Contract " Tzip16HTTPSContract"
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(3).click({ force: true })
      cy.window().then(function (p) {
        cy.stub(p, "prompt").returns("Beacon");
      });
    })

    it('Example having a SHA256 hash - wallet', () => {
      // requires Contract "Tzip16SHA256Contract"
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(5).click({ force: true })
      cy.window().then(function (p) {
        cy.stub(p, "prompt").returns("Beacon");
      });
    })

    it('IPFS example - wallet', () => {
      // requires Contract "Tzip16IPFSContract"
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(7).click({ force: true })
      cy.window().then(function (p) {
        cy.stub(p, "prompt").returns("Beacon");
      });
    })
  })

  describe('Execute off-chain views - contract', () => {

    it('Run a view named someJson - wallet', () => {
      // requires Contract "Tzip16OnChainContractJSON"
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(9).click({ force: true })
      cy.window().then(function (p) {
        cy.stub(p, "prompt").returns("Beacon");
      });
    })

    it('Run a view named multiply-the-nat-in-storage - wallet', () => {
      // requires Contract "Tzip16OnChainContractMultiply"
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(11).click({ force: true })
      cy.window().then(function (p) {
        cy.stub(p, "prompt").returns("Beacon");
      });
    })
  })

  describe('Execute a custom view - contract', () => {

    it('Execute the view multiply-the-nat-in-storage in a custom way - wallet', () => {
      // requires Contract "Tzip16OnChainContractMultiply"
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(13).click({ force: true })
      cy.window().then(function (p) {
        cy.stub(p, "prompt").returns("Beacon");
      });
    })
  })
})
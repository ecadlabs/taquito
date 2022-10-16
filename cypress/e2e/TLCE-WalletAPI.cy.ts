/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton } from './base'

describe('Taquito Live Code Examples - Wallet API', () => {

  Cypress.config('defaultCommandTimeout', 30000);
  const page_under_test = base_url + 'wallet_API'

  describe('Connecting the wallet', () => {

    it('Try the Beacon wallet!', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(0).click({ force: true })
      cy.window().then(function (p) {
        cy.stub(p, "prompt").returns("Beacon");
      });
    })

    it('Try the Temple wallet!', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(1).click({ force: true })
      cy.window().then(function (p) {
        cy.stub(p, "prompt").returns("Beacon");
      });
    })
  })

  describe('Making transfers', () => {

    it('Transfer between implicit accounts', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(2).click({ force: true })
      cy.window().then(function (p) {
        cy.stub(p, "prompt").returns("Beacon");
      });
    })

    it('Transfer to smart contracts', () => {
      // requires Contract "WalletContract"      
      cy.get(runButton).eq(3).click({ force: true })
      cy.window().then(function (p) {
        cy.stub(p, "prompt").returns("Beacon");
      });
    })
  })

  describe('Calling a smart contract', () => {

    it('Contract entrypoint argument', () => {
      // requires Contract "WalletAreYouThereContract" 
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(4).click({ force: true })
      cy.window().then(function (p) {
        cy.stub(p, "prompt").returns("Beacon");
      });
    })

    it('Contract entrypoint multiple arguments', () => {
      // requires Contract "WalletAreYouThereContract" 
      cy.get(runButton).eq(5).click({ force: true })
      cy.window().then(function (p) {
        cy.stub(p, "prompt").returns("Beacon");
      });
    })
  })
})
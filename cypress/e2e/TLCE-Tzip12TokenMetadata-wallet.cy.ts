/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton } from './base'

describe('Taquito Live Code Examples - Tzip12 Token Metadata  - wallet', () => {

  Cypress.config('defaultCommandTimeout', 30000);
  beforeEach(() => { cy.visit(base_url + 'tzip12').contains(disclaimer) })

  it('The token metadata are obtained from an off-chain view token_metadata - wallet', () => {
    // requires Contract "Tzip12BigMapOffChainContract"    
    cy.get(runButton).eq(1).click({ force: true })
    cy.window().then(function (p) {
      cy.stub(p, "prompt").returns("Beacon");
    });
  })

  it('Calling the off-chain view token_metadata using the taquito-tzip16 package - wallet', () => {
    // requires Contract "Tzip12BigMapOffChainContract"    
    cy.get(runButton).eq(3).click({ force: true })
    cy.window().then(function (p) {
      cy.stub(p, "prompt").returns("Beacon");
    });
  })

  it('The token metadata are found in the big map %token_metadata - wallet', () => {
    // requires Contract "Tzip12BigMapOffChainContract"    
    cy.get(runButton).eq(3).click({ force: true })
    cy.window().then(function (p) {
      cy.stub(p, "prompt").returns("Beacon");
    });
  })
})
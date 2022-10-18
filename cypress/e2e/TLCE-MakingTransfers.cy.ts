/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton, playgroundPreview } from './base'

describe('Taquito Live Code Examples - Making Transfers', () => {

  Cypress.config('defaultCommandTimeout', 50000);
  beforeEach(() => {cy.visit(base_url + "making_transfers").contains(disclaimer)})

  it('Transfer from an implicit tz1 address to a tz1 address', () => {
    cy.get(runButton).eq(0).click()
    cy.waitUntil(() => cy.get(playgroundPreview).eq(0).contains('Operation injected'))
  })
})
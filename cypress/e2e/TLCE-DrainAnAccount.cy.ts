/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton, playgroundPreview } from './base'

describe('Taquito Live Code Examples - Drain an Account', () => {

  Cypress.config('defaultCommandTimeout', 30000);
  const page_under_test = base_url + "drain_account"

  it('Draining implicit accounts (tz1, tz2, tz3)', () => {
    cy.visit(page_under_test).contains(disclaimer)
    cy.get(runButton).eq(0).click()
    cy.waitUntil(() => cy.get(playgroundPreview).eq(0).contains('The balance is now 0 ꜩ'))
  })

  it('Draining originated accounts (KT1)', () => {
    cy.visit(page_under_test).contains(disclaimer)
    cy.get(runButton).eq(0).click()
    cy.waitUntil(() => cy.get(playgroundPreview).eq(0).contains('The balance is now 0 ꜩ'))
  })
})
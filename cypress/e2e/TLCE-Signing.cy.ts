/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton, playgroundPreview } from './base'

describe('Taquito Live Code Examples - Signing', () => {

  Cypress.config('defaultCommandTimeout', 30000);
  const page_under_test = base_url + "signing"

  it('Signing Michelson data', () => {
    cy.visit(page_under_test).contains(disclaimer)
    cy.get(runButton).eq(0).click()
    cy.waitUntil(() => cy.get(playgroundPreview).eq(0).contains('sbytes'))
  })
})
/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton, playgroundPreview } from './base'

describe('Taquito Live Code Examples - Signing', () => {

  Cypress.config('defaultCommandTimeout', 30000);
  beforeEach(() => { cy.visit(base_url + 'signing').contains(disclaimer) })

  it('Signing Michelson data', () => {
    cy.get(runButton).eq(0).click()
    cy.waitUntil(() => cy.get(playgroundPreview).eq(0).contains('sbytes'))
  })
})
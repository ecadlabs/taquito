/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton, playgroundPreview } from './base'

describe('Taquito Live Code Examples - Originate - contract', () => {

  Cypress.config('defaultCommandTimeout', 30000);
  const page_under_test = base_url + "originate"

  it('a. Initializing storage using a Plain Old JavaScript Object - contract', () => {
    cy.visit(page_under_test).contains(disclaimer)
    cy.get(runButton).eq(0).click()
    cy.waitUntil(() => cy.get(playgroundPreview).eq(0).contains('Origination completed.'))
  })

  it('b. Initializing storage using a plain Michelson Expression for initial storage - contract', () => {
    cy.visit(page_under_test).contains(disclaimer)
    cy.get(runButton).eq(2).click()
    cy.waitUntil(() => cy.get(playgroundPreview).eq(2).contains('Origination completed.'))
  })

  it('c. Initializing storage using a JSON encoded Michelson Expression for initial storage - contract', () => {
    cy.visit(page_under_test).contains(disclaimer)
    cy.get(runButton).eq(4).click()
    cy.waitUntil(() => cy.get(playgroundPreview).eq(4).contains('Operation completed.'))
  })
})
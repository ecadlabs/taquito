/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton, playgroundPreview } from './base'

describe('Taquito Live Code Examples - Storage with/without annotations - contract', () => {

  Cypress.config('defaultCommandTimeout', 50000);
  const page_under_test = base_url + 'storage_annotations'

  describe('When all the properties are annotated', () => {

    it('Write the storage as a Javascript object and include the annotated names in it - contract', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(0).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(0).contains('Origination completed'))
    })
  })

  describe('When there is no annotation', () => {

    it('All properties in storage are accessible by the index corresponding to the order that the storage is defined - contract', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(2).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(2).contains('Origination completed'))
    })
  })

  describe('When some arguments are annotated and others are not', () => {

    it('The elements in positions 2 and 3 have an annotation. Access these elements with their annotated name and the others with corresponding indexes - contract', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(4).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(4).contains('Origination completed'))
    })
  })
})
/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton } from './base'

describe('Taquito Live Code Examples - Storage with/without annotations - wallet', () => {

  Cypress.config('defaultCommandTimeout', 50000);
  const page_under_test = base_url + 'storage_annotations'

  beforeEach(() => {
    cy.visit(page_under_test).contains(disclaimer)
  })

  describe('When all the properties are annotated', () => {

    it('Write the storage as a Javascript object and include the annotated names in it - wallet', () => {
      
      cy.get(runButton).eq(1).click({ force: true })
      cy.window().then(function (p) {
        cy.stub(p, "prompt").returns("Beacon");
      });
    })
  })

  describe('When there is no annotation', () => {

    it('All properties in storage are accessible by the index corresponding to the order that the storage is defined - contract', () => {
      
      cy.get(runButton).eq(3).click({ force: true })
      cy.window().then(function (p) {
        cy.stub(p, "prompt").returns("Beacon");
      });
    })
  })

  describe('When some arguments are annotated and others are not', () => {

    it('The elements in positions 2 and 3 have an annotation. Access these elements with their annotated name and the others with corresponding indexes - wallet', () => {
      
      cy.get(runButton).eq(5).click({ force: true })
      cy.window().then(function (p) {
        cy.stub(p, "prompt").returns("Beacon");
      });
    })
  })
})
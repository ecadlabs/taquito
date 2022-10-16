/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton } from './base'

describe('Taquito Live Code Examples - maps and Bigmaps - wallet', () => {

  Cypress.config('defaultCommandTimeout', 30000);
  const page_under_test = base_url+'maps_bigmaps'

  describe('Maps - wallet', () => {

    it('Origination of the contract with an initial storage - wallet', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(1).click({force : true})
      cy.window().then(function (p) {
        cy.stub(p, "prompt").returns("Beacon");
      });
    })

    it('Origination of the contract with an initial storage but using fromLiteral - wallet', () => {
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(3).click({force : true})
      cy.window().then(function (p) {
        cy.stub(p, "prompt").returns("Beacon");
      });
    })

    it('Accessing the values of the map - wallet', () => { 
      // requires Contract " MapWithSingleMapForStorage" 
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(5).click({force : true})
      cy.window().then(function (p) {
        cy.stub(p, "prompt").returns("Beacon");
      });
    })

    it('Origination of the contract with Pair as Map keys - wallet', () => { 
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(7).click({force : true})
      cy.window().then(function (p) {
        cy.stub(p, "prompt").returns("Beacon");
      });
    })

    it('Accessing Map values using Pairs - wallet', () => { 
      // requires Contract " MapWithPairasMapContract"
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(9).click({force : true})
      cy.window().then(function (p) {
        cy.stub(p, "prompt").returns("Beacon");
      });
    })

    it('Origination of a contract with complex keys - wallet', () => { 
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(11).click({force : true})
      cy.window().then(function (p) {
        cy.stub(p, "prompt").returns("Beacon");
      });
    })

    it('Accessing Map values with complex keys - wallet', () => { 
      // requires Contract "MapWithComplexKeysContract" 
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(13).click({force : true})
      cy.window().then(function (p) {
        cy.stub(p, "prompt").returns("Beacon");
      });
    })
  })

  describe('BigMaps - wallet', () => {

    it('Origination of the bigmap contract with an initial storage - wallet', () => { 
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(15).click({force : true})
      cy.window().then(function (p) {
        cy.stub(p, "prompt").returns("Beacon");
      });
    })

    it('Accessing the values of the map and the bigMap- wallet', () => {
      // requires Contract "MapWithInitialStorageContract"  
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(17).click({force : true})
      cy.window().then(function (p) {
        cy.stub(p, "prompt").returns("Beacon");
      });
    })

    it('Fetch multiple big map values at once - wallet', () => { 
      // requires Contract "BigMapsMultipleValuesContract"
      cy.visit(page_under_test).contains(disclaimer)
      cy.get(runButton).eq(19).click({force : true})
      cy.window().then(function (p) {
        cy.stub(p, "prompt").returns("Beacon");
      });
    })
  })
})
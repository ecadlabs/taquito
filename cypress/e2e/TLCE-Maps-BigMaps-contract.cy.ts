/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton, playgroundPreview } from './base'

describe('Taquito Live Code Examples - Maps and Bigmaps - contract', () => {

  Cypress.config('defaultCommandTimeout', 90000);
  beforeEach(() => { cy.visit(base_url + "/maps_bigmaps").contains(disclaimer) })

  describe('Maps - contract', () => {

    it('Origination of the contract with an initial storage - contract', () => {
      cy.get(runButton).eq(0).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(0).contains('Origination completed.'))
    })

    it('Origination of the contract with an initial storage but using fromLiteral - contract', () => {
      cy.get(runButton).eq(2).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(2).contains('Origination completed.'))
    })

    it('Accessing the values of the map - contract', () => {
      // requires Contract " MapWithSingleMapForStorage"       
      cy.get(runButton).eq(4).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(4).contains('Operation injected.'))
    })

    it('Origination of the contract with Pair as Map keys - contract', () => {
      cy.get(runButton).eq(6).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(6).contains('Origination completed.'))
    })

    it('Accessing Map values using Pairs - contract', () => {
      // requires Contract " MapWithPairasMapContract"       
      cy.get(runButton).eq(8).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(8).contains('quantity'))
    })

    it('Origination of a contract with complex keys - contract', () => {
      cy.get(runButton).eq(10).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(10).contains('Origination completed.'))
    })

    it('Accessing Map values with complex keys - contract', () => {
      // requires Contract "MapWithComplexKeysContract" 
      cy.get(runButton).eq(12).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(12).contains('The value associated to this key is 100'))
    })
  })

  describe('BigMaps - contract', () => {

    it('Origination of the bigmap contract with an initial storage - contract', () => {
      cy.get(runButton).eq(14).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(14).contains('Origination completed'))
    })

    it('Accessing the values of the map and the bigMap- contract', () => {
      // requires Contract "MapWithInitialStorageContract" 
      cy.get(runButton).eq(16).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(16).contains('The value associated with the specified key of the bigMap is 100.'))
    })

    it('Fetch multiple big map values at once - contract', () => {
      // requires Contract "BigMapsMultipleValuesContract" 
      cy.get(runButton).eq(18).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(18).contains('The value of the key'))
    })
  })
})
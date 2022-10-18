/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton, playgroundPreview } from './base'

describe('Taquito Live Code Examples - Michaelson Encoder', () => {

  Cypress.config('defaultCommandTimeout', 30000);
  beforeEach(() => { cy.visit(base_url + 'michelson_encoder').contains(disclaimer) })

  describe('The Schema class', () => {

    it('The ExtractSchema method', () => {
      cy.get(runButton).eq(0).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(0).contains('stored_counter'))
    })

    it('When there is no annotation, the keys of the object are indexes starting from 0', () => {
      cy.get(runButton).eq(1).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(1).contains('key'))
    })

    it('Example using a complex storage', () => {
      cy.get(runButton).eq(2).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(2).contains('big_map'))
    })

    it('The Typecheck method', () => {
      cy.get(runButton).eq(3).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(3).contains('false'))
    })

    it('The Encode method', () => {
      cy.get(runButton).eq(4).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(4).contains('prim'))
    })

    it('The Execute method', () => {
      cy.get(runButton).eq(5).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(5).contains('stored_counter'))
    })

    it('Example for the big_map type', () => {
      cy.get(runButton).eq(6).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(6).contains('Default value returned by the Michelson Encoder for big_map'))
    })

    it('Example for the ticket type', () => {
      cy.get(runButton).eq(7).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(7).contains('Default representation of the ticket value returned by the Michelson Encoder'))
    })
  })

  describe('The ParameterSchema class', () => {

    it('The Encode method expects flattened parameters instead of a javascript object.', () => {
      cy.get(runButton).eq(8).click()
      cy.waitUntil(() => cy.get(playgroundPreview).eq(8).contains('string'))
    })
  })
})
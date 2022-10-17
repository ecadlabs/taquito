/// <reference types='cypress' />
import 'cypress-wait-until';
import { base_url, disclaimer, runButton } from './base'

describe('Taquito Live Code Examples - Wallet API', () => {

  Cypress.config('defaultCommandTimeout', 30000);
  const page_under_test = base_url + 'wallet_API'

  beforeEach(() => {
    cy.visit(page_under_test).contains(disclaimer)
  })

  describe('Connecting the wallet', () => {

    it('Try the Beacon wallet!', () => {
      cy.get(runButton).eq(0).click({ force: true })
      cy.get('*[id^="beacon-alert-wrapper"]').eq(0).then(($dialog) => {
        cy.wrap($dialog).find('#beacon-switch').click({ force: true })

        // cy.get('*[id^="beacon-alert-wrapper"]').eq(0).then(($dialog)=>{
        //   cy.wrap($dialog).find('#beacon-switch').click()
        //   });
        // cy.window().then(win => {
        //   cy.stub(win, "prompt").returns("Beacon");
        //   cy.get('button#beacon-switch').click({ force: true })

        //   //cy.contains('button#beacon-switch').click({force: true})
        // });
        // cy.get('*[id^="beacon-alert-wrapper"]').click({force: true})

        // cy.contains('button#beacon-switch').click({force: true})
        //cy.get('#beacon-switch.beacon-modal__button--outline').click({ force: true })
        //cy.contains('beacon-modal__content').get('beacon--switch__container').get('#beacon-switch').click({ force: true })
        //*[@id="beacon-switch"]
        //cy.get('#beacon-switch').click({ force: true })

        /* ==== Generated with Cypress Studio ==== */
        //cy.get('#beacon-alert-wrapper-a3bb58fe5086b400d28575aa28c864c4').click();
        /* ==== End Cypress Studio ==== */
      })

      //   it('Try the Temple wallet!', () => {
      //     cy.get(runButton).eq(1).click({ force: true })
      //     cy.window().then(function (p) {
      //       cy.stub(p, "prompt").returns("Beacon");
      //     });
      //   })
      // })

      // describe('Making transfers', () => {

      //   it('Transfer between implicit accounts', () => {
      //     cy.get(runButton).eq(2).click({ force: true })
      //     cy.window().then(function (p) {
      //       cy.stub(p, "prompt").returns("Beacon");
      //     });
      //   })

      //   it('Transfer to smart contracts', () => {
      //     // requires Contract "WalletContract"      
      //     cy.get(runButton).eq(3).click({ force: true })
      //     cy.window().then(function (p) {
      //       cy.stub(p, "prompt").returns("Beacon");
      //     });
      //   })
      // })

      // describe('Calling a smart contract', () => {

      //   it('Contract entrypoint argument', () => {
      //     // requires Contract "WalletAreYouThereContract" 
      //     cy.get(runButton).eq(4).click({ force: true })
      //     cy.window().then(function (p) {
      //       cy.stub(p, "prompt").returns("Beacon");
      //     });
      //   })

      //   it('Contract entrypoint multiple arguments', () => {
      //     // requires Contract "WalletAreYouThereContract" 
      //     cy.get(runButton).eq(5).click({ force: true })
      //     cy.window().then(function (p) {
      //       cy.stub(p, "prompt").returns("Beacon");
      //     });
      //   })
    })
  })
})
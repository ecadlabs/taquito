import { codeViewsTopLevel } from "../packages/taquito-local-forging/test/data/contract_views_top_level";
import { CONFIGS } from "./config";
import BigNumber from 'bignumber.js';
import { Protocols } from "@taquito/taquito";
import { HttpResponseError } from "@taquito/http-utils";

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const hangzhounetOrHigher = (protocol === Protocols.PtHangz2 || protocol === Protocols.PsiThaCa) ? test : test.skip;
  describe(`On chain views using the contract API: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup(true)
      done()
    })
    hangzhounetOrHigher(`As a user I want to originate a smart contract having top level views and simulate the views execution`, async (done) => {
      // Contract origination
      const op = await Tezos.contract.originate({
        code: codeViewsTopLevel,
        storage: 2,
        balance: '2',
        mutez: false
      });
      await op.confirmation();
      const contract = await op.contract();

      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      const source = await Tezos.signer.publicKeyHash();

      // views simulation

      // The view "add" returns the result of adding the nat passed as a parameter to the nat in the storage.
      expect(contract.contractViews.add().getSignature()).toEqual({
        parameter: 'nat',
        result: 'nat'
      });
      const viewAddResult = await contract.contractViews.add(5).executeView({ viewCaller: contract.address });
      expect(viewAddResult).toEqual(new BigNumber(7));

      // return the current execution context of the view
      expect(contract.contractViews.step_constants().getSignature()).toEqual({
        parameter: 'unit',
        result: {
          '0': 'mutez',
          '1': 'mutez',
          '2': 'address',
          '3': 'address',
          '4': 'address'
        }
      });
      const viewStepConstantsResult = await contract.contractViews.step_constants().executeView({ source, viewCaller: contract.address });
      expect(viewStepConstantsResult).toEqual({
        '0': new BigNumber(0), // AMOUNT is always 0
        '1': new BigNumber(2000000), // BALANCE is the balance of the contract where the view is
        '2': contract.address, // SELF_ADDRESS is the address of the contract where the view is
        '3': contract.address, // SENDER
        '4': await Tezos.wallet.pkh() // SOURCE
      });

      // return parameter of the view and storage value
      const viewIdResult = await contract.contractViews.id(3).executeView({ viewCaller: contract.address });
      expect(contract.contractViews.id().getSignature()).toEqual({
        parameter: 'nat',
        result: { '0': 'nat', '1': 'nat' }
      });
      expect(viewIdResult).toEqual({
        '0': new BigNumber(3), // int passed in parameter
        '1': new BigNumber(2) // in storage
      });

      try {
        // view that always fails
        await contract.contractViews.test_failwith(3).executeView({ viewCaller: contract.address });
      } catch (error: any) {
        expect(error).toBeInstanceOf(HttpResponseError)
      }

      const viewSuccResult = await contract.contractViews.succ({ 0: 16, 1: contract.address }).executeView({ source, viewCaller: contract.address });
      expect(contract.contractViews.succ().getSignature()).toEqual({
        parameter: { '0': 'nat', '1': 'address' },
        result: 'nat'
      });
      expect(viewSuccResult).toEqual(new BigNumber(20));

      const viewIsTwentyResult = await contract.contractViews.is_twenty({ 0: 20, 1: contract.address }).executeView({ viewCaller: contract.address });
      expect(contract.contractViews.is_twenty().getSignature()).toEqual({
        parameter: { '0': 'nat', '1': 'address' },
        result: 'nat'
      });
      expect(viewIsTwentyResult).toEqual(new BigNumber(20));

      // The view "fib" takes a number (position) as a parameter and returns the value of the Fibonacci sequence at this position.
      const viewFibResult = await contract.contractViews.fib(10).executeView({ viewCaller: contract.address });
      expect(contract.contractViews.fib().getSignature()).toEqual({
        parameter: 'nat',
        result: 'nat'
      });
      expect(viewFibResult).toEqual(new BigNumber(55));

      done();
    });
  });
});
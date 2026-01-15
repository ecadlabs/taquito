import { Protocols } from '@taquito/taquito';
import { CONFIGS } from '../../config';

// TC-008: Obtained balance of a smart contract using the BALANCE instruction does not change during the execution of the entrypoint's own code.
// Testcase just checks whether this is still the case.

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const weeklynet = protocol === Protocols.ProtoALpha ? test : test.skip;

  describe(`Test contracts using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup();
    });

    weeklynet("Verify Obtained balance of a smart contract using the BALANCE instruction does not change during the execution of the entrypoint's own code", async () => {
      const opTezTransferA = await Tezos.contract.originate({
        balance: '0.00001',
        code: `        { parameter (option address) ;
            storage (pair (mutez %at_end) (mutez %at_start)) ;
            code { UNPAIR ;
                   SWAP ;
                   BALANCE ;
                   SWAP ;
                   CAR ;
                   PAIR ;
                   SWAP ;
                   IF_NONE
                     { NIL operation }
                     { CONTRACT (option address) ;
                       IF_NONE { PUSH string "none" ; FAILWITH } {} ;
                       PUSH mutez 5 ;
                       NONE address ;
                       TRANSFER_TOKENS ;
                       NIL operation ;
                       SWAP ;
                       CONS } ;
                   SWAP ;
                   CDR ;
                   BALANCE ;
                   PAIR ;
                   SWAP ;
                   PAIR } }`,
        init: '(Pair 0 0)',
      });

      await opTezTransferA.confirmation();
      expect(opTezTransferA.hash).toBeDefined();
      expect(opTezTransferA.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      const TezTransferAContract = await opTezTransferA.contract();
      expect(await TezTransferAContract.storage()).toBeTruthy();
      Tezos.contract.at(TezTransferAContract.address).then((contract) => {
        const objects = Object.keys(contract.methodsObject);
        expect(objects).toContain('default');
      });

      const opTezTransferB = await Tezos.contract.originate({
        code: `        { parameter (option address) ;
             storage (pair (mutez %at_end) (mutez %at_start)) ;
             code { UNPAIR ;
                    SWAP ;
                    BALANCE ;
                    SWAP ;
                    CAR ;
                    PAIR ;
                    SWAP ;
                    IF_NONE
                      { NIL operation }
                      { CONTRACT (option address) ;
                        IF_NONE { PUSH string "none" ; FAILWITH } {} ;
                        PUSH mutez 5 ;
                        NONE address ;
                        TRANSFER_TOKENS ;
                        NIL operation ;
                        SWAP ;
                        CONS } ;
                    SWAP ;
                    CDR ;
                    BALANCE ;
                    PAIR ;
                    SWAP ;
                    PAIR } }`,
        init: '(Pair 0 0)',
      });

      await opTezTransferB.confirmation();
      expect(opTezTransferB.hash).toBeDefined();
      expect(opTezTransferB.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      const TezTransferBContract = await opTezTransferB.contract();
      expect(await TezTransferBContract.storage()).toBeTruthy();
      Tezos.contract.at(TezTransferBContract.address).then((contract) => {
        const objects2 = Object.keys(contract.methodsObject);
        expect(objects2).toContain('default');
      });

      await Tezos.contract
        .at(TezTransferAContract.address)
        .then((contract) => {
          return contract.methodsObject.default(`${TezTransferBContract.address}`).send();
        })
        .then((op) => {
          return op.confirmation().then(() => op.hash);
        });
      const storageA: any = await TezTransferAContract.storage();
      expect(storageA.at_start.toString()).toEqual("10");
      expect(storageA.at_end.toString()).toEqual("10");
      const storageB: any = await TezTransferBContract.storage();
      expect(storageB.at_start.toString()).toEqual("5");
      expect(storageB.at_end.toString()).toEqual("5");
    });
  });
});

// This test was transcribed to Taquito from bash scripts at https://github.com/InferenceAG/TezosSecurityBaselineChecking

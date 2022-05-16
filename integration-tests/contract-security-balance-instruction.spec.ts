import { CONFIGS } from './config';

// TC-008: Obtained balance of a smart contract using the BALANCE instruction does not change during the execution of the entrypoint's own code.
// Testcase just checks whether this is still the case.

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test contracts using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });

    it("Verify Obtained balance of a smart contract using the BALANCE instruction does not change during the execution of the entrypoint's own code", async (done) => {
      try {
        const opTezTransferA = await Tezos.contract.originate({
          balance: '0.000010',
          code: `        { parameter (option address) ;
            storage (pair (mutez %atEnd) (mutez %atStart)) ;
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

        const opTezTransferB = await Tezos.contract.originate({
          code: `        { parameter (option address) ;
            storage (pair (mutez %atEnd) (mutez %atStart)) ;
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
        const TezTransferBContract = await opTezTransferA.contract();
        expect(await TezTransferBContract.storage()).toBeTruthy();

        await Tezos.contract
          .at(TezTransferAContract.address)
          .then((contract) => {
            return contract.methods.default(TezTransferBContract.address).send();
          })
          .then((op) => {
            return op.confirmation().then(() => op.hash);
          })

           const storageA = await TezTransferAContract.storage();
           expect(storageA).toContain({atEnd: "10", atStart: "10"});
           /// Should be {"atEnd": "5", "atStart": "5"}

           const storageB = await TezTransferBContract.storage();
           expect(storageB).toContain({atEnd: "10", atStart: "10"});
           /// Should be {"atEnd": "5", "atStart": "5"}
      } catch (error: any) {
        console.log(error.message);
      }
      done();
    });
  });
});

// This test was transcribed to Taquito from bash scripts at https://github.com/Inference/TezosSecurityBaselineCheckingFramework

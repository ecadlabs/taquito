import { Protocols } from '@taquito/taquito';
import { CONFIGS } from './config';

/**
 * TC-002/003 This test case originates a contract with a "payout" entrypoint. When calling the payout entrypoint, a contract can transfer
 * all available tez amounts except a "minLockedValue," which can be shared by a contract to a provided destination address.
 * The test case tries to move the balance to an "attacker contract," which immediately calls the "payout" entrypoint again.
 * Not updating the balance would make the Attacker glad.   The attacker should not be successful since the credit is instantly
 * updated when executing the transfer transaction. Any reentrancy (after the transfer transaction operation) to the contract finds the updated balance.
 */

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const mondaynet = protocol === Protocols.ProtoALpha ? test : test.skip;
  const address = 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys';

  describe(`Test contracts using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup(true);
    });

    mondaynet('Reentrance attack test', async () => {
      const vestingContractOp = await Tezos.contract.originate({
        balance: '8',
        code: `{ parameter
            (or (pair %adminPayout (mutez %amount) (address %destination))
                (pair %payout (mutez %amount) (address %destination))) ;
          storage (pair (address %admin) (mutez %minLockedValue)) ;
          code { UNPAIR ;
                 IF_LEFT
                   { SWAP ;
                     DUP ;
                     DUG 2 ;
                     CAR ;
                     SENDER ;
                     COMPARE ;
                     EQ ;
                     IF {} { PUSH string "failed assertion" ; FAILWITH } ;
                     DUP ;
                     CDR ;
                     CONTRACT unit ;
                     IF_NONE { PUSH string "none" ; FAILWITH } {} ;
                     SWAP ;
                     CAR ;
                     UNIT ;
                     TRANSFER_TOKENS ;
                     SWAP ;
                     NIL operation ;
                     DIG 2 ;
                     CONS ;
                     PAIR }
                   { DUP ;
                     CDR ;
                     CONTRACT unit ;
                     IF_NONE { PUSH string "none" ; FAILWITH } {} ;
                     SWAP ;
                     CAR ;
                     UNIT ;
                     TRANSFER_TOKENS ;
                     SWAP ;
                     NIL operation ;
                     DIG 2 ;
                     CONS ;
                     PAIR } } }`,
        init: `(Pair "tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys" 4000000)`,
      });

      await vestingContractOp.confirmation();
      expect(vestingContractOp.hash).toBeDefined();
      expect(vestingContractOp.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      const vestingContract = await vestingContractOp.contract();
      expect(await vestingContract.storage()).toBeTruthy();

      const publicKeyHash = await Tezos.signer.publicKeyHash();
      const opTransfer = await Tezos.contract.transfer({ to: publicKeyHash, amount: 1 });
      await opTransfer.confirmation();

      const attackContractOp = await Tezos.contract.originate({
        code: `{ parameter unit ;
               storage unit ;
               code { CDR ;
                 PUSH address "${vestingContract.address}" ;
                    CONTRACT %payout (pair (mutez %amount) (address %destination)) ;
                      IF_NONE { PUSH string "none" ; FAILWITH } {} ;
                      PUSH mutez 0 ;
                      PUSH address "${address}" ;
                      PUSH mutez 3000000 ;
                      PAIR ;
                      TRANSFER_TOKENS ;
                      SWAP ;
                      NIL operation ;
                      DIG 2 ;
                      CONS ;
                      PAIR } }
             `,
        init: `Unit`,
      });

      await attackContractOp.confirmation();
      expect(attackContractOp.hash).toBeDefined();
      expect(attackContractOp.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      const attackContract = await attackContractOp.contract();
      expect(await attackContract.storage()).toBeTruthy();

      const opSend = await vestingContract.methodsObject
        .payout({ amount: 3000000, destination: attackContract.address })
        .send();
      await opSend.confirmation();

      /** If the reentry had succeeded the vesting contract would have had less than 5 remaining
       * Since there are still 5 the reentry failed
       */

      Tezos.tz.getBalance(vestingContract.address).then((vbalance) => {
        let result = vbalance.toNumber();
        expect((result = 5000000));
      });
    });
  });
});

// This test was transcribed to Taquito from bash scripts at https://github.com/InferenceAG/TezosSecurityBaselineChecking

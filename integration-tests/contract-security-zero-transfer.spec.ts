import { CONFIGS } from './config';
import { Protocols } from '@taquito/taquito';
import { _describe, _it } from "./test-utils";

// TC-007 - A 0tez transaction to an implicit account should fail.

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const mondaynet = protocol === Protocols.ProtoALpha ? test : test.skip;

  _describe(`Test contracts using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup();

    });

    mondaynet('Verify that Transactions of 0ꜩ towards a contract without code are forbidden', async () => {
      try {
        const op = await Tezos.contract.originate({
          code: `{ parameter address ;
                      storage unit ;
                      code { UNPAIR ;
                             CONTRACT unit ;
                             IF_NONE { PUSH string "none" ; FAILWITH } {} ;
                             PUSH mutez 0 ;
                             UNIT ;
                             TRANSFER_TOKENS ;
                             SWAP ;
                             NIL operation ;
                             DIG 2 ;
                             CONS ;
                             PAIR } }
                          `,
          init: { prim: 'Unit' },
        });

        await op.confirmation();
        expect(op.hash).toBeDefined();
        expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        const contract = await op.contract();
        expect(await contract.storage()).toBeTruthy();

        const publicKeyHash = await Tezos.signer.publicKeyHash();

        const opSend = await contract.methods.default(publicKeyHash).send();
        await opSend.confirmation();

      } catch (error: any) {
        expect(error.message).toContain('contract.empty_transaction');
      }
    });
  });
});

// This test was transcribed to Taquito from bash scripts at https://github.com/InferenceAG/TezosSecurityBaselineChecking

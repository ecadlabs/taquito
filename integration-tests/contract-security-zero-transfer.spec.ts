import { CONFIGS } from './config';
import { RpcClient } from '@taquito/rpc';

// TC-007 - A 0tez transaction to an implicit account should fail.

const client = new RpcClient(' https://ithacanet.ecadinfra.com');

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test contracts using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();

      done();
    });

    it('Verify that Transactions of 0ꜩ towards a contract without code are forbidden', async () => {
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

      try {
        const publicKeyHash = await Tezos.signer.publicKeyHash();
        const opTransfer = await Tezos.contract.transfer({ to: publicKeyHash, amount: 0 });
        await opTransfer.confirmation();
      } catch (error: any) {
        expect(error.message).toContain('contract.empty_transaction');
      }
    });
  });
});

// This test was transcribed to Taquito from bash scripts at https://github.com/InferenceAG/TezosSecurityBaselineChecking

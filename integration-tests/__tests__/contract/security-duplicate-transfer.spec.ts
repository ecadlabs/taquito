import { Protocols } from '@taquito/taquito';
import { CONFIGS } from '../../config';

/**
 * TC-006: Check that the type "operation" is not duplicable and that the error will be "internal_operation_replay"
 */

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const weeklynet = protocol === Protocols.ProtoALpha ? test : test.skip;

  describe(`Test contracts using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup();
    });

    weeklynet(
      'Verify Type "operation" is not duplicable with error internal_operation_replay.',
      async () => {
        try {
          const publicKeyHash = await Tezos.signer.publicKeyHash();
          const op = await Tezos.contract.originate({
            balance: '8',
            code: `{
            parameter unit;
            storage unit;
            code
              {
                DROP ; # drop storage and input
                PUSH address "${publicKeyHash}";
                CONTRACT unit;
                IF_NONE { FAIL } {};
                PUSH mutez 1;
                UNIT;
                TRANSFER_TOKENS;
                DUP;
                NIL operation;
                SWAP;
                CONS;
                SWAP;
                CONS;
                UNIT;
                SWAP;
                PAIR;
              }; }`,
            storage: 0,
          });

          await op.confirmation();
          expect(op.hash).toBeDefined();
          expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
          const contract = await op.contract();
          expect(await contract.storage()).toBeTruthy();

          const opContract = await op.contract();
          const opSend = await opContract.methodsObject.default(0).send();
          await opSend.confirmation();

        } catch (error: any) {
          expect(error.message).toContain('internal_operation_replay');
        }
      }
    );
  });
});

// This test was transcribed to Taquito from bash scripts at https://github.com/InferenceAG/TezosSecurityBaselineChecking

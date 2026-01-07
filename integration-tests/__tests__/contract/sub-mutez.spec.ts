import { CONFIGS } from '../../config';

CONFIGS().forEach(({ lib, rpc, setup, networkName }) => {
  const Tezos = lib;

  describe(`Test contract call with amount using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup();
    });

    it(
      'originate a contract with SUB MUTEZ',
      async () => {
        const op = await Tezos.contract.originate({
          code: `{ parameter (or (or (mutez %decrement) (mutez %increment)) (mutez %reset)) ;
               storage mutez ;
               code { UNPAIR ;
                      IF_LEFT { IF_LEFT { SWAP ; SUB_MUTEZ; ASSERT_SOME } { ADD } } { SWAP ; DROP } ;
                      NIL operation ;
                      PAIR } }
                   `,
          init: `0`,
        });
        await op.confirmation()
        expect(op.hash).toBeDefined();
        expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
        const contract = await op.contract();

        expect(await contract.storage()).toBeTruthy();
      }
    );

    it('fail to originate a contract on Ithaca with SUB', async () => {
      try {
        await Tezos.contract.originate({
          code: `{ parameter (or (or (mutez %decrement) (mutez %increment)) (mutez %reset)) ;
                 storage mutez ;
                 code { UNPAIR ;
                        IF_LEFT { IF_LEFT { SWAP ; SUB } { ADD } } { SWAP ; DROP } ;
                        NIL operation ;
                        PAIR } }
                   `,
          init: `0`,
        });
      } catch (error: any) {
        if (networkName === 'TEZLINKNET') {
          expect(error.lastError.error_message).toContain("(\"Script : no matching overload for SUB")
        } else {
          expect(error.message).toContain("michelson_v1.deprecated_instruction")
        }
      }
    });

  });
});

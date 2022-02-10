import { Protocols } from '@taquito/taquito';
import { CONFIGS } from './config';

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const ithacanet = protocol === Protocols.Psithaca2 ? test: test.skip;
  const hangzhounet = protocol === Protocols.PtHangz2 ? test: test.skip;

  describe(`Test contract call with amount using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });
    hangzhounet(
      'originate a contract on Hangzhou with SUB',
      async () => {
        const op = await Tezos.contract.originate({
            code: `{ parameter (or (or (mutez %decrement) (mutez %increment)) (mutez %reset)) ;
                storage mutez ;
                code { UNPAIR ;
                       IF_LEFT { IF_LEFT { SWAP ; SUB } { ADD } } { SWAP ; DROP } ;
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

    hangzhounet('fail to originate a contract on Hangzhou with SUB_MUTEZ', async () => {
       try {
         await Tezos.contract.originate({
             code: `{ parameter (or (or (mutez %decrement) (mutez %increment)) (mutez %reset)) ;
               storage mutez ;
               code { UNPAIR ;
                      IF_LEFT { IF_LEFT { SWAP ; SUB_MUTEZ; ASSERT_SOME } { ADD } } { SWAP ; DROP } ;
                      NIL operation ;
                      PAIR } }
                   `,
             init: `0`,
           });
       } catch (error: any) {
         expect(error.message).toContain("Http error response: (400) Failed to parse the request body: No case matched:")
       }
     });

     ithacanet(
       'originate a contract on Ithaca with SUB MUTEZ',
       //restore to skipHangzhou when forger supports new sub_mutez for Ithaca
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

     ithacanet('fail to originate a contract on Ithaca with SUB', async () => {
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
         expect(error.message).toContain("(permanent) proto.012-Psithaca.michelson_v1.deprecated_instruction")
       }
     });
  });
});

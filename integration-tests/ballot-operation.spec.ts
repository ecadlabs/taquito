import { CONFIGS } from './config';
import { Protocols } from '@taquito/taquito';

CONFIGS().forEach(({ lib, protocol, setup } ) => {
  const Tezos = lib;
  const kathmandunet = protocol === Protocols.PtKathman ? test: test.skip;

  describe(`Ballot operation test (${protocol})`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });

    kathmandunet('Inject Ballot operation (ballot vote)', async (done) => {
      const op = await Tezos.contract.ballot({
        proposal: 'ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK',
        ballot: 'yay'
      });
      
      await op.confirmation();

      expect(op.operationResults).toBeDefined();
      expect(op.includedInBlock).toBeDefined();

      done();
    })
  })
})
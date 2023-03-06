import { CONFIGS } from './config';
import { Protocols } from '@taquito/taquito';

CONFIGS().forEach(({ lib, rpc, protocol, setup }) => {
  const Tezos = lib;
  const mumbaiAndAlpha = protocol === Protocols.PtMumbaii || protocol === Protocols.ProtoALpha ? test : test.skip;
  
  describe(`Smart Rollup Add Messages operation test using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup(true);

      done();
    });

    mumbaiAndAlpha('Should be able to inject a Smart Rollup Add Messages operation', async (done) => {
      const op = await Tezos.contract.smartRollupAddMessages({
        message: [
          '0000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74'
        ],
      });
      await op.confirmation();

      expect(op.status).toEqual('applied');
      expect(op.message).toEqual(['0000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74']);
      expect(op.results).toBeDefined();

      done();
    });
  });
});
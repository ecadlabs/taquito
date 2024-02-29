import { CONFIGS } from '../../../config';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Smart Rollup Add Messages operation test using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup(true);

    });

    it('Should be able to inject a Smart Rollup Add Messages operation', async () => {
      const op = await Tezos.contract.smartRollupAddMessages({
        message: [
          '0000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74'
        ],
      });
      await op.confirmation();

      expect(op.status).toEqual('applied');
      expect(op.message).toEqual(['0000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74']);
      expect(op.results).toBeDefined();

    });
  });
});

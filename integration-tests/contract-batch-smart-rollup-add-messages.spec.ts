import { CONFIGS } from './config';
import { ligoSample } from './data/ligo-simple-contract';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test contract.batch with smart rollup add messages using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup(true);
    });

    it('should be able to batch smart rollup add messages with other operations', async () => {
      const batch = Tezos.contract
        .batch()
        .withSmartRollupAddMessages({
          message: ['0000000031010000000b48656c6c6f20776f726c6401cc9e352a850d7475bf9b6cf103aa17ca404bc9dd000000000764656661756c74'],
          gasLimit: 1100
        })
        .withOrigination({
          balance: '1',
          code: ligoSample,
          storage: 0
        });
      const op = await batch.send();
      await op.confirmation();

      expect(op.status).toEqual('applied');
      expect(op.includedInBlock).toBeDefined();
    });
  });
});

import { CONFIGS } from '../../config';
import { singleSaplingStateContractJProtocol } from '../../data/single_sapling_state_contract_jakarta_michelson';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test origination of contracts with sapling using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup();
    });

    test('Originates a contract with a single sapling state in its storage', async () => {
      const op = await Tezos.contract.originate({
        code: singleSaplingStateContractJProtocol(),
        init: '{}'
      });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      const contract = await op.contract();
    });
  });
});
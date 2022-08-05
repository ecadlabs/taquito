import { CONFIGS } from "./config";
import { SaplingStateValue } from '../packages/taquito-michelson-encoder/src/taquito-michelson-encoder';
import { saplingContractDoubleJProto } from "./data/sapling_test_contracts";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test origination of contracts made with wallet api with sapling using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup();
      done()
    })

    test('Originates a contract made with wallet api with sapling states in its storage', async (done) => {
      const op = await Tezos.wallet.originate({
        code: saplingContractDoubleJProto,
        storage: {
          left: SaplingStateValue,
          right: SaplingStateValue
        }
      }).send();
      await op.confirmation();
      expect(op.opHash).toBeDefined();
      done();
    });
  });
})
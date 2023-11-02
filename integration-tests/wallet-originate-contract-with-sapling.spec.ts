import { CONFIGS } from "./config";
import { SaplingStateValue } from '@taquito/michelson-encoder';
import { saplingContractDoubleJProto } from "./data/sapling_test_contracts";
import { _describe, _it } from "./test-utils";

CONFIGS().forEach(({ lib, rpc, setup, }) => {
  const Tezos = lib;

  _describe(`Test contract origination with sapling through wallet api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup();
    })

    _it('Originates a contract made with wallet api with sapling states in its storage', async () => {
      const op = await Tezos.wallet.originate({
        code: saplingContractDoubleJProto,
        storage: {
          left: SaplingStateValue,
          right: SaplingStateValue
        }
      }).send();
      await op.confirmation();
      expect(op.opHash).toBeDefined();
    });
  });
})

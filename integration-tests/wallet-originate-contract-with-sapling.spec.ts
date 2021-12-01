import { CONFIGS } from "./config";
import { saplingContract } from "./data/sapling_contracts";
import { SaplingStateValue } from '../packages/taquito-michelson-encoder/src/taquito-michelson-encoder';


CONFIGS().forEach(({ lib, rpc, setup,  }) => {
  const Tezos = lib;

  describe(`Test contract origination with sapling through wallet api using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup();
      done()
    })

    it('Verify wallet.originate for a contract with sapling states in its storage', async (done) => {
      const op = await Tezos.wallet.originate({
        code: saplingContract,
        storage: {
          balance: 1,
          ledger1: SaplingStateValue,
          ledger2: SaplingStateValue
        }
      }).send();
      await op.confirmation();
      expect(op.opHash).toBeDefined();
      done();
    });

  });
})

import { CONFIGS } from "./config";
import { saplingContract } from "./data/sapling_contracts";
import { SaplingStateValue } from '../packages/taquito-michelson-encoder/src/taquito-michelson-encoder';


CONFIGS().forEach(({ lib, rpc, setup,  }) => {
  const Tezos = lib;

  describe(`Test origination of contracts made with wallet api with sapling using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup();
      done()
    })

    it('Originates a contract made with wallet api with sapling states in its storage', async (done) => {
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
import { CONFIGS } from "./config";
import { SaplingStateValue } from '../packages/taquito-michelson-encoder/src/taquito-michelson-encoder';
import { saplingContractDoubleJProto } from "./data/sapling_test_contracts";

CONFIGS().forEach(({ lib, rpc, setup, }) => {
  const Tezos = lib;

  describe(`Test contract origination with sapling through wallet api using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup();
      done()
    })

<<<<<<< Updated upstream
     it('Originates a contract made with wallet api with sapling states in its storage', async (done) => {
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
=======
    it('Verify wallet.originate for a contract with sapling states in its storage', async (done) => {
      const op = await Tezos.wallet.originate({
        code: saplingContractDouble,
        storage: {
          left: SaplingStateValue,
          right: SaplingStateValue
        }
      }).send();
      await op.confirmation();
      expect(op.opHash).toBeDefined();
      done();
    });

    jakartanetAndMondaynet('Originates a contract made with wallet api with sapling states in its storage', async (done) => {
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
>>>>>>> Stashed changes
  });
})

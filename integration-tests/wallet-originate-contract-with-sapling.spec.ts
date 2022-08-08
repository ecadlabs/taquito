import { CONFIGS } from "./config";
import { SaplingStateValue } from '../packages/taquito-michelson-encoder/src/taquito-michelson-encoder';
import { saplingContractDoubleJProto } from "./data/sapling_test_contracts";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
<<<<<<< HEAD
=======
  const jakartanetAndMondaynet = protocol === Protocols.ProtoALpha || protocol === Protocols.PtJakart2 ? test: test.skip;
  const kathmandunet = protocol === Protocols.PtKathma ? test : test.skip;
>>>>>>> 020b74181 (initial rendition of intengration tests change to kathmandunet)

  describe(`Test origination of contracts made with wallet api with sapling using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup();
      done()
    })

<<<<<<< HEAD
    test('Originates a contract made with wallet api with sapling states in its storage', async (done) => {
=======
    kathmandunet('Originates a contract made with wallet api with sapling states in its storage', async (done) => {
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
>>>>>>> 020b74181 (initial rendition of intengration tests change to kathmandunet)
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
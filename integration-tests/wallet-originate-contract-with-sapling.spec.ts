import { CONFIGS } from "./config";
import { SaplingStateValue } from '../packages/taquito-michelson-encoder/src/taquito-michelson-encoder';
import { saplingContractDouble, saplingContractDoubleJProto } from "./data/sapling_test_contracts";
import { Protocols } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const jakartanetAndMondaynet = protocol === Protocols.ProtoALpha || protocol === Protocols.PtJakart2 ? test: test.skip;
  const ithacanet = protocol === Protocols.Psithaca2 ? test : test.skip;

  describe(`Test contract origination with sapling through wallet api using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup();
      done()
    })

<<<<<<< HEAD
    it('Verify wallet.originate for a contract with sapling states in its storage', async (done) => {
=======
    ithacanet('Originates a contract made with wallet api with sapling states in its storage', async (done) => {
>>>>>>> master
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
  });
})

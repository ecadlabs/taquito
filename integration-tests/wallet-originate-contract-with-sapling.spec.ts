import { CONFIGS } from "./config";
import { SaplingStateValue } from '../packages/taquito-michelson-encoder/src/taquito-michelson-encoder';
import { saplingContractDouble, saplingContractDoubleJProto } from "./data/sapling_test_contracts";
import { Protocols } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const mondaynet = (protocol === Protocols.ProtoALpha) ? test : test.skip;
  const ithacanetAndPrior = (protocol === Protocols.Psithaca2) || (protocol === Protocols.PtHangz2) ? test : test.skip;

  describe(`Test origination of contracts made with wallet api with sapling using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup();
      done()
    })

    ithacanetAndPrior('Originates a contract made with wallet api with sapling states in its storage', async (done) => {
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

    mondaynet('Originates a contract made with wallet api with sapling states in its storage', async (done) => {
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
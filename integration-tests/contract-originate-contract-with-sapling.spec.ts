import { CONFIGS } from "./config";
import { rpcContractResponse, rpcContractResponse4 } from '../packages/taquito-michelson-encoder/data/sample19_sapling';
import { Protocols } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, protocol, setup,  }) => {
  const Tezos = lib;

  const edonet = (protocol === Protocols.PtEdo27k) ? test : test.skip;

  describe(`Test origination of contracts with sapling using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup();
      done()
    })

     edonet('Originates a contract having an empty sapling state in its storage', async (done) => {
      const op = await Tezos.contract.originate({
        code: rpcContractResponse.script.code,
        init: `{}` // empty sapling state
      });

      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      done();
    }); 
  });
})
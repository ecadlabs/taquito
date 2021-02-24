import { CONFIGS } from "./config";
import { rpcContractResponse, rpcContractResponse2, rpcContractResponse4 } from '../packages/taquito-michelson-encoder/data/sample19_sapling';
import { Protocols } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, protocol, setup,  }) => {
  const Tezos = lib;

  const edonet = (protocol === Protocols.PtEdo2Zk) ? test : test.skip;

  describe(`Test origination of contracts made with wallet api with sapling using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup();
      done()
    })

     edonet('Originates a contract made with wallet api having an empty sapling state in its storage', async (done) => {
      const op = await Tezos.wallet.originate({
        code: rpcContractResponse.script.code,
        init: `{}` // empty sapling state
      }).send();

      await op.confirmation();
      expect(op.opHash).toBeDefined();

      done();
    }); 

    edonet('Originates a contract made with wallet api with sapling states in its storage', async (done) => {
      const op = await Tezos.wallet.originate({
        code: rpcContractResponse2.script.code,
        init: `(Pair 0 {} {})`
      }).send();
      await op.confirmation();
      expect(op.opHash).toBeDefined();
      done();
    }); 
    
    edonet('Originates a contract made with wallet api with sapling states in its storage and init in JSON', async (done) => {
        const op = await Tezos.wallet.originate({
        code: rpcContractResponse4.script.code,
        init: { prim: 'Pair', args: [ [], [] ] }
      }).send();
      await op.confirmation();
      expect(op.opHash).toBeDefined();
      expect(op.isInCurrentBranch).toBeTruthy;
      done();
    });

  });
})
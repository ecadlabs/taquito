import { CONFIGS } from "./config";
import { rpcContractResponse, rpcContractResponse2, rpcContractResponse4 } from '../packages/taquito-michelson-encoder/data/sample19_sapling';

const test = require('jest-retries');

CONFIGS().forEach(({ lib, rpc, setup,  }) => {
  const Tezos = lib;

  describe(`Test origination of contracts with sapling using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup();
      done()
    })
    test('Originates a contract having an empty sapling state in its storage', 2, async (done: () => void) => {  
        const op = await Tezos.contract.originate({
        code: rpcContractResponse.script.code,
        init: `{}` // empty sapling state
      });

      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      done();
    });

    test('Originates a contract with sapling states in its storage', 2, async (done: () => void) => {
      const op = await Tezos.contract.originate({
        code: rpcContractResponse2.script.code,
        init: `(Pair 0 {} {})`
      });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      done();
    });

    test('Originates a contract with sapling states in its storage and init in JSON', 2, async (done: () => void) => {
        const op = await Tezos.contract.originate({
        code: rpcContractResponse4.script.code,
        init: { prim: 'Pair', args: [ [], [] ] }
      });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      done();
    });

  });
})

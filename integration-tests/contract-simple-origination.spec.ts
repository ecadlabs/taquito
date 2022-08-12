import { Schema } from "@taquito/michelson-encoder";
import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  const test = require('jest-retries');

  describe(`Originating a contract api using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    test('Simple origination scenario', 2, async (done: () => void) => {
      const schema = new Schema({
        "prim": "sapling_transaction",
        "args": [{ "prim":"8" }]
    });
      console.log(schema.generateSchema())
      done();
    });
  });
})

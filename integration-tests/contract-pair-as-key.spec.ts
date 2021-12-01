import { CONFIGS } from "./config";
import { BigMapAbstraction, MichelsonMap } from "@taquito/taquito";
import { storageContractWithPairAsKey } from "./data/storage-contract-with-pair-as-key";
import { mapWithPairAsKeyCode, mapWithPairAsKeyStorage } from "./data/bigmap_with_pair_as_key";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  const test = require('jest-retries');

  describe(`Test contract origination with pair as key in storage through contract api using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
      test('Verify contract.originate for a contract with pair as a key', 2, async (done: () => void) => {
        const storageMap = new MichelsonMap();
        // The contract schema in this example has a key with 8 nested pairs
        // (int(nat(string(bytes(mutez(bool(key_hash(timestamp(address)))))))))
        // and a value of `int`
        // The contract schema in this particular test does not have map
        // annotations which means that each value needs to have an index
        // as property name.
        storageMap.set({
          0: "1",                                    // int
          1: "2",                                    // nat
          2: "test",                                 // string
          3: "cafe",                                 // bytes
          4: "10",                                   // mutez
          5: true,                                   // bool
          6: "tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5", // key_hash
          7: "2019-09-06T15:08:29.000Z",             // timestamp
          8: "tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5"  // address
        }, 100)
        storageMap.set({
          0: "1",
          1: "2",
          2: "test",
          3: "cafe",
          4: "10",
          5: false,
          6: "tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5",
          7: "2019-09-06T15:08:29.000Z",
          8: "tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5"
        }, 100)
        storageMap.set({
          0: "2",
          1: "2",
          2: "test",
          3: "cafe",
          4: "10",
          5: true,
          6: "tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5",
          7: "2019-09-06T15:08:29.000Z",
          8: "tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5"
        }, 100)
        storageMap.set({
          0: "1",
          1: "2",
          2: "test",
          3: "cafe",
          4: "10",
          5: true,
          6: "tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5",
          7: "2018-09-06T15:08:29.000Z",
          8: "tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5"
        }, 100)
        const op = await Tezos.contract.originate({
          balance: "0",
          code: storageContractWithPairAsKey,
          storage: storageMap
        })
        await op.contract()
        expect(op.hash).toBeDefined();
        expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
        done();
      })

    test('Verify contract.originate for a contract with pair as a key in map ', 2, async (done: () => void) => {
        const op = await Tezos.contract.originate({
          balance: "0",
          code: mapWithPairAsKeyCode,
          init: mapWithPairAsKeyStorage
        })
        const contract = await op.contract()
        const storage2: BigMapAbstraction = await contract.storage();
        const value = await storage2.get({ 'test': 'test2', 'test2': 'test3' })
        expect(value).toEqual('test')
        done();
      });
  });
})

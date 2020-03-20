import { CONFIGS } from "./config";
import { Protocols, MichelsonMap } from "@taquito/taquito";
import { storageContractWithPairAsKey } from "./data/storage-contract-with-pair-as-key";
import { mapWithPairAsKeyCode, mapWithPairAsKeyStorage } from "./data/bigmap_with_pair_as_key";

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  describe(`Storage contract with pair as key using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    // Pair as key is only supported since proto 006
    if (protocol === Protocols.PsCARTHA) {
      it('Storage contract with pair as key', async (done) => {
        const storageMap = new MichelsonMap();
        storageMap.set({
          0: "1",
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

      it('originate contract and init storage with pair as key in map', async (done) => {
        const op = await Tezos.contract.originate({
          balance: "0",
          code: mapWithPairAsKeyCode,
          init: mapWithPairAsKeyStorage
        })
        const contract = await op.contract()
        const storage2 = await contract.storage<any>();
        const value = await storage2.get({ 'test': 'test2', 'test2': 'test3' })
        expect(value).toEqual('test')
        done();
      });
    }
  });
})

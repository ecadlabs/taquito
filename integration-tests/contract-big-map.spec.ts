import { CONFIGS } from "./config";
import { storageContract } from "./data/storage-contract";
import { MichelsonMap } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test contract with multiple bigmap variations using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('originates a contract and initlizes bigmaps with variants of data', async (done) => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: storageContract,
        storage: {
          "map1": MichelsonMap.fromLiteral({
            "tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD": 1,
            'KT1CDEg2oY3VfMa1neB7hK5LoVMButvivKYv': 2,
            "tz3YjfexGakCDeCseXFUpcXPSAN9xHxE9TH2": 2,
            "tz1ccqAEwfPgeoipnXtjAv1iucrpQv3DFmmS": 3,
          }),
          "map2": MichelsonMap.fromLiteral({
            "2": 1,
            '3': 2,
            "1": 2,
            "4": 3,
          }),
          "map3": MichelsonMap.fromLiteral({
            "2": 1,
            '3': 2,
            "1": 2,
            "4": 3,
          }),
          "map4": MichelsonMap.fromLiteral({
            "zz": 1,
            'aa': 2,
            "ab": 2,
            "cc": 3,
          }),
          "map5": MichelsonMap.fromLiteral({
            "aaaa": 1,
            "aa": 1,
            'ab': 2,
            "01": 2,
            "22": 3,
          }),
          "map6": MichelsonMap.fromLiteral({
            "2": 1,
            '3': 2,
            "1": 2,
            "4": 3,
          }),
          "map7": MichelsonMap.fromLiteral({
            "2018-04-23T10:26:00.996Z": 1,
            '2017-04-23T10:26:00.996Z': 2,
            "2019-04-23T10:26:00.996Z": 2,
            "2015-04-23T10:26:00.996Z": 3,
          }),
        }
      })

      await op.contract()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      done();
    })
  });
})

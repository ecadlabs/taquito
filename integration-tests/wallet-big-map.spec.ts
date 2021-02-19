import { CONFIGS } from "./config";
import { tokenCode, tokenInit } from "./data/tokens";
import { storageContract } from "./data/storage-contract";
import { MichelsonMap } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test wallet with multiple bigmap variations using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })

    it('originates a contract and initializes bigmaps with variants of data using the wallet API', async (done) => {
     
        const op = await Tezos.wallet.originate({
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
    }).send();

      await op.confirmation();
      expect(op.opHash).toBeDefined();
      //expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      done();

      const contract = await op.contract();
      console.log('Contract address:', contract.address);

      // Fetch the storage of the newly deployed contract
      const storage: any = await contract.storage();

      // First property is the big map abstraction (This contract does not have annotations so we access by index)
      const bigMap = storage['0'];

      // Fetch the key (current pkh that is running the test)
      const bigMapValue = await bigMap.get(await Tezos.signer.publicKeyHash())
      expect(bigMapValue['0'].toString()).toEqual("2")
      expect(bigMapValue['1']).toEqual(expect.objectContaining(new MichelsonMap()))
      done();

    })
  });
})

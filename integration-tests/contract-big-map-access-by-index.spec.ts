import { CONFIGS } from "./config";
import { tokenCode, tokenInit } from "./data/tokens";
import { MichelsonMap, MichelCodecPacker } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, setup, knownBigMapContract }) => {
  const Tezos = lib;
  describe(`Test contract origination with empty BigMap accessing big map abstraction by index through contract api using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('Verify contract.originate with empty BigMap and the Storage/BigMap can be fetched', async (done) => {
      // Deploy a contract with a big map
      const op = await Tezos.contract.originate({
        balance: "1",
        code: tokenCode,
        init: tokenInit(`${await Tezos.signer.publicKeyHash()}`),
      })
      const contract = await op.contract()

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


    it('Verify that it returns undefined when BigMap key is not found', async (done) => {
      const myContract = await Tezos.contract.at(knownBigMapContract);
      const contractStorage: any = await myContract.storage();
      const value = await contractStorage.ledger.get("tz1NortRftucvAkD1J58L32EhSVrQEWJCEnB")
      expect(value).toBeUndefined();
      done()
    })

    it('Verify contract.originate with empty BigMap and the value in the BigMap can be fetched using local packing', async (done) => {

      // Configure the Tezostoolkit to use the MichelCodecPacker (the data will be packed locally instead of using the rpc)
      Tezos.setPackerProvider(new MichelCodecPacker());

      // Deploy a contract with a big map
      const op = await Tezos.contract.originate({
        balance: "1",
        code: tokenCode,
        init: tokenInit(`${await Tezos.signer.publicKeyHash()}`),
      })
      const contract = await op.contract()

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

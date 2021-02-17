import { CONFIGS } from "./config";
import { tokenCode, tokenInit } from "./data/tokens";
import { MichelsonMap } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, setup, knownBigMapContract }) => {
  const Tezos = lib;

  describe(`Test accessing big map abstraction by index using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()    
    });
    
    it('originates a contract with empty bigmap using the wallet API and fetches the storage/bigmap', async (done) => {
      
      const op = await Tezos.wallet.originate({
        balance: "1",
        code: tokenCode,
        init: tokenInit(`${await Tezos.signer.publicKeyHash()}`),
      }).send();

      await op.confirmation();
      expect(op.opHash).toBeDefined();

      const contract = await op.contract();

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

  it('Return undefined when BigMap key is not found', async () => {
    const myWallet = await Tezos.wallet.at(knownBigMapContract);
    const walletStorage: any = await myWallet.storage();
    const value = await walletStorage.ledger.get("tz1NortRftucvAkD1J58L32EhSVrQEWJCEnB")
    expect(value).toBeUndefined();
  })
})

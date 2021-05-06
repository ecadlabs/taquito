import { CONFIGS } from "./config";
import { tokenCode, tokenInit } from "./data/tokens";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  const test = require('jest-retries');

  describe(`Test origination of a token contract using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    test('originates a token contract made from wallet api and mints some tokens',2, async (done: () => void) => {
      // TODO: Fails when using ephemeral keys
      const op = await Tezos.wallet.originate({
        balance: "1",
        code: tokenCode,
        init: tokenInit(await Tezos.signer.publicKeyHash()),
      }).send()
      await op.confirmation()
      expect(op.opHash).toBeDefined();

      const contract = await op.contract();
      const opMethod = await contract.methods.mint(await Tezos.signer.publicKeyHash(), 100).send();

      await opMethod.confirmation();
      expect(op.opHash).toBeDefined();
      done();
    });
  });
})

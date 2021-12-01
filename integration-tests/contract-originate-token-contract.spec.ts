import { ContractAbstraction, ContractProvider } from "taquito/src/contract";
import { CONFIGS } from "./config";
import { tokenCode, tokenInit } from "./data/tokens";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  const test = require('jest-retries');
  let contract: ContractAbstraction<ContractProvider>;

  describe(`Test contract origination of a token contract through contract api using: ${rpc}`, () => {

    beforeAll(async (done) => {
      await setup()
      done()
    })

    test('Verify contract.originate for a token contract and mints some tokens', 2, async (done: () => void) => {
      // TODO: Fails when using ephemeral keys
      const op = await Tezos.contract.originate({
        balance: "1",
        code: tokenCode,
        init: tokenInit(await Tezos.signer.publicKeyHash()),
        fee: 150000,
        storageLimit: 10000,
        gasLimit: 400000,
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      contract = await op.contract();
      const opMethod = await contract.methods.mint(await Tezos.signer.publicKeyHash(), 100).send();

      await opMethod.confirmation();
      expect(opMethod.hash).toBeDefined();
      expect(opMethod.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      done();
    });

    test('Verify contract.originate for a token contract and mints some tokens using the `methodObjects` method', 2, async (done: () => void) => {
      const opMethod = await contract.methodsObject.mint({
        to: await Tezos.signer.publicKeyHash(),
        value: 100
      }).send();

      await opMethod.confirmation();
      expect(opMethod.hash).toBeDefined();
      expect(opMethod.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      done();
    });
  });
})

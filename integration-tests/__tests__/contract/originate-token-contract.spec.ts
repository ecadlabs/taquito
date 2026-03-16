import { ContractAbstraction, ContractProvider } from "@taquito/taquito";
import { CONFIGS } from "../../config";
import { tokenCode, tokenInit } from "../../data/tokens";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  let contract: ContractAbstraction<ContractProvider>;

  describe(`Test contract origination of a token contract through contract api using: ${rpc}`, () => {

    beforeAll(async () => {
      await setup({ preferFreshKey: true, minBalanceMutez: 2_000_000 })

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
    })

    test('Verify a token contract can mint some tokens', async () => {
      const opMethod = await contract.methodsObject.mint({ to: await Tezos.signer.publicKeyHash(), value: 100 }).send();

      await opMethod.confirmation();
      expect(opMethod.hash).toBeDefined();
      expect(opMethod.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
    });


    test('Verify a token contract mints some tokens using the `methodObjects` method', async () => {


      const opMethod = await contract.methodsObject.mint({
        to: await Tezos.signer.publicKeyHash(),
        value: 100
      }).send();

      await opMethod.confirmation();
      expect(opMethod.hash).toBeDefined();
      expect(opMethod.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
    });
  });
})

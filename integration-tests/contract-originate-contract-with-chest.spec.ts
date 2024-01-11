import { DefaultContractType, OriginationOperation, Protocols } from "@taquito/taquito";
import { CONFIGS } from "./config";
import { ProtoGreaterOrEqual } from "@taquito/michel-codec";

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const oxfordAndAlpha = ProtoGreaterOrEqual(protocol, Protocols.ProxfordY) ? test : test.skip;

  describe(`Test contract origination with timelock types (chest or chest_key) in storage and retrieve its value through contract api: ${rpc}`, () => {
    const chestValue = 'deafa2a781dee4a1cea296d1d5fef8c5cffad5d4a7fecdebc8ecde8afad580e5d9fdaa98cfeb91a3bb8cc8e5fae79ce3ebf9baf3af9b94bdefc9fbf68ac8bcbbc09c99b6e6b8b9fec8bdb5949af5bf85b5d8d5fbe8e8d1c0cdcebee792a1f8d0f1fbabe8bda590f1938a9cdc8fe3a29fbba3c1b3e7bcbc9aedb58dde9388a7dee5a4c9d8cd989fdcd285afcfa780ebc7cdd78099fbf8b4d8f58083b782bf83fcacbc9f86adfedbc983e08b8fcbc0cb89f7a0ccd1a0bfc1dfc0d3b58a98ffb7a5a8f794ad8bc8dfc9bac3f6c9b2e1cd80cfc1e398df898ed6a0ca928f81cadeb3a8c694e29fc79c92ddbed28584dd9bbafb89c9dedabb8fb68c98dda19ac0f681ffa2a7c1da84b0fbe6a0b6ce82a7df908c9add859bbad6b3cec0c0aba0bab8de9480a8a00132511a7cc4b258bf58089548b44d9fbed4b6434ca39fd51100000014464ee1937269169dc3f93983f7bbe25b8a6915d7';
    const chestKeyValue = 'b4bdeae3d2f5b4d0ecf486aaa2c6d2d89ad4ded2848e92ac8dc9a9fbad9daaaa8990e1f0bf96b9e89a8dd9e3a999dddbc0f18bb2e1b3c687bacde7cefcbd8f8fb18092ed9f9bf9b482c989fefba3f5c99193ccc2a8a697b58cd9bbbeeffaad9c84efb085aceef5e9d8cec6b182c8e686deccd088b6d5ecdfa5e8eb90d7a9f2c6ecb0c8b8e3ccc294f4d7f0ec95f6ededbcf8e698a3cfb9a0c0c6e4dfd882f9fe92afea95e2c5df9ecdb0f0b8c2b689f0c4ecfbe3b4d387c0c4d6e6a187c3e980bffbc6a1b090e493a7b0a8d9b5e583b7fbe8a3bff3add6e8ddceb5a2eec8e0bdfbf2ccfe86ff8e93bd9ce2a0b7d2fe91f19cdaa1f4f8f9b4b7e9c387ce83e7f8f4bcac949ef0bbd684a9c1a193d4e1bad3a0f1eecdbbe5f2a1f2edfea6bcf4a99fa4cadc018097ffbede93a98fa68d93eef190dbc5b9a0cab4899cf59690caf3cdd3c3cbd381978985cdd68ef697b29bcce3acd3b7c99aa7ae8dd3cfdff4d6e5ce8eecccf6f7aafbf1c1e5a3f0e1beefd3cfc7d193ba88eaf2cecf8e96a89ca2f2fbd8e5a496d6cac8ca8aa3b6ced7e7eddba8bac7ee85d98bfb8a93849bca8fddd9a1b0bae3c5dafef5c1f5d7e9a388fafaeaf4cdfef3b0e7d4f7a6c2f1bdced7d7b7cd9ed4eec0a1f5c9a2e38de2c09fbda082cf95f8f0fcdddbc784f4bbfde1f994a3deb1f497f8dec0a58c9ffddd8da88af6c3d5a2fcc7839fb6f6aa8cbc81fdb8bba68f8b93f791a88df39c91ded8d199cef8ebbaa8c9dee4c9a1f2b5e3d4e5f9a7d5b395eaef86bf81efc5cde9a5a4fe8ffceef481f4a3b6f0f59381daf58592cebad494b7c709f78183b5effcc4c7c3f3e2b78ff4fedeceb9a7fbf0ede2e2d2afe99e9496f2abf9a190d1bdc786fcf38a80bbaecb94f59aa985fcf5e1c1b68ad9aceddff09a9ac591d8b8e7bfb5a5a1a1f8cea6bdad8682dfa5f8b5e0d4cea7bbe0d9daa2cba5bd91f396cdebbdfb95daadc39ed7faa5e8eda1f5b78db6c886dc9bb8fdc2e7e7d6a294d2a5c2eca8fcce9dd9a8ebe28fa2f4aef8d8aac68a869bccddb7aca8c39fc691fccb868feafae2a8a0f3fcebfbf99cecdd9586ecd2dda9f4d1f8bd89b4fca480e7fdaccaf1eeadc7f3dffe96fab3dbd7a0f4eafd9dc8f9c0f0feca8ec1a1a8f992fbcbe9edfec9b6fc878da0f8a4ef87a4f583ead786fc8da4eeb8ccd0e69a9992fef8c984cd88ae918292c9eae9e6ccc4e9c6acd6edcfaafcf4c28f90a68096d008ddc3d5aea480a8fee2bcaff585fc9cf3f3a103';
    let opChest: OriginationOperation<DefaultContractType>
    let opChestKey: OriginationOperation<DefaultContractType>;

    beforeAll(async () => {
      await setup();

      opChest = await Tezos.contract.originate({
        balance: "1",
        code: [{ "prim": "parameter", "args": [{ "prim": "chest" }] }, { "prim": "storage", "args": [{ "prim": "chest" }] }, { "prim": "code", "args": [[{ "prim": "CAR" }, { "prim": "NIL", "args": [{ "prim": "operation" }] }, { "prim": "PAIR" }]] }],
        storage: chestValue,
      })
      await opChest.confirmation()

      opChestKey = await Tezos.contract.originate({
        balance: "1",
        code: [{ "prim": "parameter", "args": [{ "prim": "chest_key" }] }, { "prim": "storage", "args": [{ "prim": "chest_key" }] }, { "prim": "code", "args": [[{ "prim": "CAR" }, { "prim": "NIL", "args": [{ "prim": "operation" }] }, { "prim": "PAIR" }]] }],
        storage: chestKeyValue,
      })
      await opChestKey.confirmation()
    })

    oxfordAndAlpha('Verify contract.originate for a contract with chest in storage', async () => {
      expect(opChest.hash).toBeDefined();
      expect(opChest.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      const contract = await opChest.contract();

      const storage: any = await contract.storage();
      expect(storage).toEqual(chestValue);
    });

    oxfordAndAlpha('Verify contract.originate for a contract with chest_key in storage', async () => {
      expect(opChestKey.hash).toBeDefined();
      expect(opChestKey.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      const contract = await opChestKey.contract();

      const storage: any = await contract.storage();
      expect(storage).toEqual(chestKeyValue);
    });
  });
})
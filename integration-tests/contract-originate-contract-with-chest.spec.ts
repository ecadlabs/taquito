import { Protocols } from "@taquito/taquito";
import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test contract origination with timelock types (chest or chest_key) in storage and retrieve its value through contract api: ${rpc}`, () => {

    beforeEach(async () => {
      await setup();
    })

    test('Verify contract.originate for a contract with chest in storage', async () => {
      const chestValue = 'e0d984a0e19fd7e7a4ac90dc9bf7e59288e8d8b0a0ca8bf988cae8fa90dbc584c2ee91a1f5d1a1d8d695f58bd1c7b1e4c0b9f384918a89dfd4eff5c3fbaff7e5d68de19088c5fdc08286f18bc7d1c4f99590f3bfd881c68d97bf91d2d4d2ded688d993e59b8aac84b798eed496a1e2dff9cfc1e3c793a8eea1fbf3a8c6c895bb8d8dedded3ed80b4848cb9ddb0c2f1ea98b8a6c3b6c691f2e787afc9bc8dd386a4b08392bbb7c1b6cdbaa6ec98a1fc96ecb287d5f6e39892aea199f4bf91e89bb8e7b58dc4f5d5bfec88ba99d1efc7c98aabe6bebbeeb4b589a383a6f581e69edbe2a4e7db8cb7e4ab8390b6f7c4c6ba9ee7c1f8d7e0f2aba5bf97cdbb85ca8dd0f7dff8fd95a1a9a68dd3b283a5f9fc93a2e7acafc4cbbeb3b2f8fe8faf97c5d2fae681081fe2a28ce94b55c47fe6a2927dc36c403067a86e36a163000000001a7c31a45bcb9934e3089cbc023a0bebe815ee2f646a0d344469f7'
      const op = await Tezos.contract.originate({
        balance: "1",
        code: [{ "prim": "parameter", "args": [{ "prim": "chest" }] }, { "prim": "storage", "args": [{ "prim": "chest" }] }, { "prim": "code", "args": [[{ "prim": "CAR" }, { "prim": "NIL", "args": [{ "prim": "operation" }] }, { "prim": "PAIR" }]] }],
        storage: chestValue,
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      const contract = await op.contract();

      const storage: any = await contract.storage();
      expect(storage).toEqual(chestValue);
    });

    test('Verify contract.originate for a contract with chest_key in storage', async () => {
      const chestKeyValue = 'c7f3caf4c8c2e3e7af8e'  // not accepted by rpc for now
      const op = await Tezos.contract.originate({
        balance: "1",
        code: [{ "prim": "parameter", "args": [{ "prim": "chest_key" }] }, { "prim": "storage", "args": [{ "prim": "chest_key" }] }, { "prim": "code", "args": [[{ "prim": "CAR" }, { "prim": "NIL", "args": [{ "prim": "operation" }] }, { "prim": "PAIR" }]] }],
        storage: chestKeyValue,
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      const contract = await op.contract();

      const storage: any = await contract.storage();
      expect(storage).toEqual(chestKeyValue);
    });
  });
})
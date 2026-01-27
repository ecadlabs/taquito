import { DefaultContractType, OriginationOperation } from "@taquito/taquito";
import { CONFIGS } from "../../config";
import { buf2hex } from "@taquito/utils";
import { Chest } from '@taquito/timelock';

CONFIGS().forEach(({ lib, rpc, setup, networkName }) => {
  const Tezos = lib;
  const notTezlinknet = networkName === 'TEZLINKNET' ? test.skip : test

  describe(`Test contract origination with timelock types (chest or chest_key) in storage and retrieve its value through contract api: ${rpc}`, () => {
    const { chest, key } = Chest.newChestAndKey(new TextEncoder().encode('test'), 1000);
    let opChest: OriginationOperation<DefaultContractType>
    let opChestKey: OriginationOperation<DefaultContractType>;

    beforeAll(async () => {
      await setup();
      if (networkName !== 'TEZLINKNET') {
        opChest = await Tezos.contract.originate({
          balance: "1",
          code: [{ "prim": "parameter", "args": [{ "prim": "chest" }] }, { "prim": "storage", "args": [{ "prim": "chest" }] }, { "prim": "code", "args": [[{ "prim": "CAR" }, { "prim": "NIL", "args": [{ "prim": "operation" }] }, { "prim": "PAIR" }]] }],
          storage: chest.encode(),
        })
        await opChest.confirmation()
        opChestKey = await Tezos.contract.originate({
          balance: "1",
          code: [{ "prim": "parameter", "args": [{ "prim": "chest_key" }] }, { "prim": "storage", "args": [{ "prim": "chest_key" }] }, { "prim": "code", "args": [[{ "prim": "CAR" }, { "prim": "NIL", "args": [{ "prim": "operation" }] }, { "prim": "PAIR" }]] }],
          storage: key.encode(),
        })
        await opChestKey.confirmation()
      }
    })

    notTezlinknet('Verify contract.originate for a contract with chest in storage', async () => {
      expect(opChest.hash).toBeDefined();
      expect(opChest.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      const contract = await opChest.contract();

      const storage: any = await contract.storage();
      expect(storage).toEqual(buf2hex(chest.encode()));
    });

    notTezlinknet('Verify contract.originate for a contract with chest_key in storage', async () => {
      expect(opChestKey.hash).toBeDefined();
      expect(opChestKey.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      const contract = await opChestKey.contract();

      const storage: any = await contract.storage();
      expect(storage).toEqual(buf2hex(key.encode()));
    });
  });
})
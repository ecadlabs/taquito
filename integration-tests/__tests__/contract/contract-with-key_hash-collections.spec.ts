import { CONFIGS } from "../../config";
import { MichelsonMap } from "@taquito/taquito";
import { contractWithKeyHashCollections } from "../../data/contract-with-key_hash-collections";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test contract origination with key collections through contract api using: ${rpc}`, () => {
    type Storage = { keyHashSet: string[], keyHashMap: MichelsonMap<string, number>; }

    beforeEach(async () => {
      await setup();
    });

    it('Verify contract.originate for a contract with set and map of keys and change them using corresponding methods', async () => {
      const initialStorage: Storage = {
        keyHashSet: [
          "tz3PUX8Kt8x8yxBYePcPcunvcA1U7x4vVX4G",
          "tz2Cv3bEm12m8M5he5rEHiGmeM5dz5Dt6Cn1",
          "tz4QjLEb91k82QGhasmcgAzBoyiay5vLMgye",
          "tz1M8SnwGFB7Hnxgq6rCeyx3aiheyH6b6UMJ",
          "tz4GcUCNYK6MFhQ7xTBsGZWb15zN6tFXfHaZ",
          "tz4VvT1RjUpT7Ebec8jTDrqNwqTRZU8X3QnM",
        ],
        keyHashMap: MichelsonMap.fromLiteral({
          'tz4QjLEb91k82QGhasmcgAzBoyiay5vLMgye': 10,
          'tz2Cv3bEm12m8M5he5rEHiGmeM5dz5Dt6Cn1': 40,
          'tz1PgiGQ2Bcg1FNBPdxxJdAJJ267FeQA78PF': 100,
          'tz1Xbi5kVw3iYvrcSegLWSDaRJkLSz31XE8f': 23,
          'tz3bBDnPj3Bvek1DeJtsTvicBUPEoTpm2ySt': 17
        }) as MichelsonMap<string, number>
      };

      const op = await Tezos.contract.originate({
        balance: '1',
        code: contractWithKeyHashCollections,
        storage: initialStorage
      });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      const contract = await op.contract();
      let storage = await contract.storage<Storage>();
      expect([...storage['keyHashSet']].sort()).toEqual([...initialStorage.keyHashSet].sort());
      expect(storage['keyHashMap'].get('tz2Cv3bEm12m8M5he5rEHiGmeM5dz5Dt6Cn1')?.toString()).toEqual('40');
      expect(storage['keyHashMap'].get('tz3bBDnPj3Bvek1DeJtsTvicBUPEoTpm2ySt')?.toString()).toEqual('17');
      expect(storage['keyHashMap'].get('tz4QjLEb91k82QGhasmcgAzBoyiay5vLMgye')?.toString()).toEqual('10');

      const newKeySet = [
        "tz1VqAq7XGziEcee4Y4kdVG9XxxJ1r9BmThV",
        "tz1M8SnwGFB7Hnxgq6rCeyx3aiheyH6b6UMJ",
        "tz1hu55Z7gPjyGKLTP2kzrBU1NhU76u2jJdx",
        "tz1VWnvuvhd5hQrX1xCgC9aPhKpDfLDNsetr"
      ]
      const setOp = await contract.methods['setSet'](newKeySet).send();
      await setOp.confirmation();
      storage = await contract.storage<Storage>();
      expect([...storage['keyHashSet']].sort()).toEqual([...newKeySet].sort());

      const newKeyMap = MichelsonMap.fromLiteral({
        'tz2LjZSckDHtnTrM4i4zTReQ81cJS8Ufmfpd': 200,
        'tz4HHJU6Yk89socL7mLemSaDbnZ5fvh8QWK8': 201,
      }) as MichelsonMap<string, number>;
      const mapOp = await contract.methods['setMap'](newKeyMap).send();
      await mapOp.confirmation();
      storage = await contract.storage<Storage>();
      expect(storage['keyHashMap'].get('tz2LjZSckDHtnTrM4i4zTReQ81cJS8Ufmfpd')?.toString()).toEqual('200');
      expect(storage['keyHashMap'].get('tz4HHJU6Yk89socL7mLemSaDbnZ5fvh8QWK8')?.toString()).toEqual('201');
      expect(storage['keyHashMap'].get('tz4QjLEb91k82QGhasmcgAzBoyiay5vLMgye')).toBeUndefined();

    });
  });
});

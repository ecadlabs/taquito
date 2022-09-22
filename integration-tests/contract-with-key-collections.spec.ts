import { CONFIGS } from "./config";
import { MichelsonMap } from "@taquito/taquito";
import { contractWithKeyCollections } from "./data/contract-with-key-collections";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test contract origination with key collections through contract api using: ${rpc}`, () => {
    type Storage = { keySet: string[], keyMap: MichelsonMap<string, number>; }

    beforeEach(async (done) => {
      await setup();
      done();
    });

    it('Verify contract.originate for a contract with set and map of keys and change them using corresponding methods', async (done) => {
      const initialStorage: Storage = {
        keySet: [
          'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g',
          'edpkuNjKKT48xBoT5asPrWdmuM1Yw8D93MwgFgVvtca8jb5pstzaCh',
          'sppk7aVdgAmezMCRTcHciVkVZoGNnhSdKEYcn5pYaqt4PvLjgFbLRxo',
          'p2pk67c5b5THCj5fyksX1C13etdUpLR9BDYvJUuJNrxeGqCgbY3NFpV',
          'p2pk65shUHKhx7zUSF7e8KZ2inmQ5aMS4jRBUmK6aCis4oaHoiWPXoT',
          'p2pk6842BMz2Se9XuMxQDe7yVdaEvpjNGQ7DYjKTQwzMUtryaHmZcV9',
        ],
        keyMap: MichelsonMap.fromLiteral({
          'edpkuNjKKT48xBoT5asPrWdmuM1Yw8D93MwgFgVvtca8jb5pstzaCh': 10,
          'p2pk65shUHKhx7zUSF7e8KZ2inmQ5aMS4jRBUmK6aCis4oaHoiWPXoT': 40,
          'sppk7aVdgAmezMCRTcHciVkVZoGNnhSdKEYcn5pYaqt4PvLjgFbLRxo': 100,
          'sppk7aTKnmX5WV17KPo3LanjfPLoXTuNjkQTdLx2bYDqHPLVVCbSwoj': 23,
          'p2pk67c5b5THCj5fyksX1C13etdUpLR9BDYvJUuJNrxeGqCgbY3NFpV': 17
        }) as MichelsonMap<string, number>
      };

      const op = await Tezos.contract.originate({
        balance: '1',
        code: contractWithKeyCollections,
        storage: initialStorage
      });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      const contract = await op.contract();
      let storage = await contract.storage<Storage>();
      expect([...storage['keySet']].sort()).toEqual([...initialStorage.keySet].sort());
      expect(storage['keyMap'].get('edpkuNjKKT48xBoT5asPrWdmuM1Yw8D93MwgFgVvtca8jb5pstzaCh')?.toString()).toEqual('10');
      expect(storage['keyMap'].get('sppk7aVdgAmezMCRTcHciVkVZoGNnhSdKEYcn5pYaqt4PvLjgFbLRxo')?.toString()).toEqual('100');
      expect(storage['keyMap'].get('p2pk67c5b5THCj5fyksX1C13etdUpLR9BDYvJUuJNrxeGqCgbY3NFpV')?.toString()).toEqual('17');

      const newKeySet = [
        'p2pk66xmhjiN7LpfrDGFwpxPtJxkLtPjQ6HUxJbKmRbxSR7RMpamDwi',
        'p2pk6842BMz2Se9XuMxQDe7yVdaEvpjNGQ7DYjKTQwzMUtryaHmZcV9',
        'sppk7cudBXaXQUvbxb3f7tpKVSm6yKaYmjzqnPqvK6MrxFnnyxDEiim',
        'p2pk66DZ3igTFpyqeezoqvFycrD5dHpJC6idPL4CWLCU1qT3Fu9j15V',
        'sppk7ZWnHCVLsPE4CDFUTH424Qj2gUiJ3sp581nvexfz21w8gPjRVce'
      ]
      const setOp = await contract.methods['setSet'](newKeySet).send();
      await setOp.confirmation();
      storage = await contract.storage<Storage>();
      expect([...storage['keySet']].sort()).toEqual([...newKeySet].sort());

      const newKeyMap = MichelsonMap.fromLiteral({
        'p2pk66EcJmNvMMCauhfptZ5ffFXutNMytfxhcM7TkFMVLkySbgZ2dU9': 200,
        'p2pk66xmhjiN7LpfrDGFwpxPtJxkLtPjQ6HUxJbKmRbxSR7RMpamDwi': 201,
      }) as MichelsonMap<string, number>;
      const mapOp = await contract.methods['setMap'](newKeyMap).send();
      await mapOp.confirmation();
      storage = await contract.storage<Storage>();
      expect(storage['keyMap'].get('p2pk66EcJmNvMMCauhfptZ5ffFXutNMytfxhcM7TkFMVLkySbgZ2dU9')?.toString()).toEqual('200');
      expect(storage['keyMap'].get('p2pk66xmhjiN7LpfrDGFwpxPtJxkLtPjQ6HUxJbKmRbxSR7RMpamDwi')?.toString()).toEqual('201');
      expect(storage['keyMap'].get('p2pk67c5b5THCj5fyksX1C13etdUpLR9BDYvJUuJNrxeGqCgbY3NFpV')).toBeUndefined();

      done();
    });
  });
});

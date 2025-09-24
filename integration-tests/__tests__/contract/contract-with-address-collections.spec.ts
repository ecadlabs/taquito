import { CONFIGS } from "../../config";
import { MichelsonMap } from "@taquito/taquito";
import { contractWithAddressCollections } from "../../data/contract-with-address-collections";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test contract origination with address collections through contract api using: ${rpc}`, () => {
    type Storage = { addressSet: string[], addressMap: MichelsonMap<string, number>; }

    beforeEach(async () => {
      await setup();
    });

    it('Verify contract.originate for a contract with set and map of addresses and change them using corresponding methods', async () => {
      const initialStorage: Storage = {
        addressSet: [
          "tz3PUX8Kt8x8yxBYePcPcunvcA1U7x4vVX4G",
          "sr19LCYLxPx91U7dPuWBMdLyYKdFzGwebPPP",
          "tz2Cv3bEm12m8M5he5rEHiGmeM5dz5Dt6Cn1",
          "tz4QjLEb91k82QGhasmcgAzBoyiay5vLMgye",
          "KT1SwbTqhSKF6Pdokiu1K4Fpi17ahPPzmt1X",
          "tz1M8SnwGFB7Hnxgq6rCeyx3aiheyH6b6UMJ",
          "tz4GcUCNYK6MFhQ7xTBsGZWb15zN6tFXfHaZ",
          "tz4VvT1RjUpT7Ebec8jTDrqNwqTRZU8X3QnM",
        ],
        addressMap: MichelsonMap.fromLiteral({
          'KT1SwbTqhSKF6Pdokiu1K4Fpi17ahPPzmt1X': 10,
          'tz2Cv3bEm12m8M5he5rEHiGmeM5dz5Dt6Cn1': 40,
          'sr19LCYLxPx91U7dPuWBMdLyYKdFzGwebPPP': 100,
          'tz1Xbi5kVw3iYvrcSegLWSDaRJkLSz31XE8f': 23,
          'tz3bBDnPj3Bvek1DeJtsTvicBUPEoTpm2ySt': 17,
        }) as MichelsonMap<string, number>
      };

      const op = await Tezos.contract.originate({
        balance: '1',
        code: contractWithAddressCollections,
        storage: initialStorage
      });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      const contract = await op.contract();
      let storage = await contract.storage<Storage>();
      expect([...storage['addressSet']].sort()).toEqual([...initialStorage.addressSet].sort());
      expect(storage['addressMap'].get('KT1SwbTqhSKF6Pdokiu1K4Fpi17ahPPzmt1X')?.toString()).toEqual('10');
      expect(storage['addressMap'].get('sr19LCYLxPx91U7dPuWBMdLyYKdFzGwebPPP')?.toString()).toEqual('100');
      expect(storage['addressMap'].get('tz3bBDnPj3Bvek1DeJtsTvicBUPEoTpm2ySt')?.toString()).toEqual('17');

      const newKeySet = [
        'KT1XM8VUFBiM9AC5czWU15fEeE9nmuEYWt3Y',
        'sr1JZsZT5u27MUQXeTh1aHqZBo8NvyxRKnyv',
        'tz2MVED1t9Jery77Bwm1m5YhUx8Wp5KWWRQe',
        'tz4JdacdPe8oKt7Yd65GdsryyNjGD5qpLMnf',
        'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
      ]
      const setOp = await contract.methods['setSet'](newKeySet).send();
      await setOp.confirmation();
      storage = await contract.storage<Storage>();
      expect([...storage['addressSet']].sort()).toEqual([...newKeySet].sort());

      const newKeyMap = MichelsonMap.fromLiteral({
        'tz3PNdfg3Fc8hH4m9iSs7bHgDgugsufJnBZ1': 200,
        'KT1JHqHQdHSgWBKo6H4UfG8dw3JnZSyjGkHA': 201,
      }) as MichelsonMap<string, number>;
      const mapOp = await contract.methods['setMap'](newKeyMap).send();
      await mapOp.confirmation();
      storage = await contract.storage<Storage>();
      expect(storage['addressMap'].get('tz3PNdfg3Fc8hH4m9iSs7bHgDgugsufJnBZ1')?.toString()).toEqual('200');
      expect(storage['addressMap'].get('KT1JHqHQdHSgWBKo6H4UfG8dw3JnZSyjGkHA')?.toString()).toEqual('201');
      expect(storage['addressMap'].get('tz4JdacdPe8oKt7Yd65GdsryyNjGD5qpLMnf')).toBeUndefined();

    });
  });
});

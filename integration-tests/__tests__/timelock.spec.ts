import { CONFIGS } from "../config";
import { Chest, Timelock, ChestKey } from '../../packages/taquito-timelock/src/taquito-timelock';
import { buf2hex } from '@taquito/utils';
import * as crypto from 'crypto';

CONFIGS().forEach(({ lib, rpc, setup, networkName }) => {
  const Tezos = lib;
  const notTezlinknet = networkName === 'TEZLINKNET' ? test.skip : test
  let contractAddress: string;
  let chestBytes: Uint8Array;
  let keyBytes: Uint8Array;

  describe(`Timelock test ${rpc}`, () => {

    const contractCode = `parameter (pair (chest %chest) (chest_key %key));
    storage (option bytes);
    code { CAR ; PUSH nat 10000 ; DUP 2 ; CAR ; DIG 2 ; CDR ; OPEN_CHEST ; NIL operation ; PAIR }`;

    beforeEach(async () => {
      if (networkName !== 'TEZLINKNET') {
        await setup(true);

        const contract = await Tezos.contract.originate({
          code: contractCode,
          storage: null
        });
        await contract.confirmation();

        contractAddress = contract.contractAddress!;
      }
    });

    notTezlinknet('should be able to create a new chest and key', async () => {
      const time = 5000;

      const payload = new Uint8Array(64);
      crypto.getRandomValues(payload);

      const { chest, key: chestKey } = Chest.newChestAndKey(payload, time);
      const op = await Tezos.contract.transfer({
        to: contractAddress,
        amount: 0,
        parameter: {
          entrypoint: "default",
          value: {
            prim: "Pair",
            args: [
              { bytes: buf2hex(chest.encode()) },
              { bytes: buf2hex(chestKey.encode()) }
            ]
          }
        }
      });
      await op.confirmation();

      expect(op.status).toEqual('applied');
    });

    notTezlinknet('should be able to create chest and key from existing timelock, and open it', async () => {
      const time = 10000;
      const payload = new TextEncoder().encode('I choose rock');

      const precomputedTimelock = Timelock.precompute(time);
      const { chest, key } = Chest.fromTimelock(payload, time, precomputedTimelock);

      //chest and key value will be used in the next test
      chestBytes = chest.encode();
      keyBytes = key.encode();

      expect(chestBytes).toBeDefined();
      expect(keyBytes).toBeDefined();
    });

    notTezlinknet('should be able to open chest with a key', async () => {
      const time = 10000;
      const [chest] = Chest.fromArray(chestBytes);
      const [chestKey] = ChestKey.fromArray(keyBytes);

      const data = chest.open(chestKey, time);

      if (data) {
        const payload = new TextDecoder().decode(data);
        expect(payload).toEqual('I choose rock');
      }
    });
  });
});

import { CONFIGS } from "../config";
import { Chest } from '../../packages/taquito-timelock/src/taquito-timelock';
import { buf2hex } from '@taquito/utils';
import * as crypto from 'crypto';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  let contractAddress: string;
  describe(`Timelock test ${rpc}`, () => {

    const contractCode = `parameter (pair (chest %chest) (chest_key %key));
    storage (option bytes);
    code { CAR ; PUSH nat 10000 ; DUP 2 ; CAR ; DIG 2 ; CDR ; OPEN_CHEST ; NIL operation ; PAIR }`;

    beforeEach(async () => {
      await setup(true);

      const contract = await Tezos.contract.originate({
        code: contractCode,
        storage: null
      });
      await contract.confirmation();

      contractAddress = contract.contractAddress!;
    });

    it('should be able to create a new chest and key', async () => {
      const time = 10000;

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
  });
});

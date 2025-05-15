import { CONFIGS } from "../config";
import { DefaultContractType } from '@taquito/taquito';
import { Chest, Timelock, ChestKey } from '@taquito/timelock';
import { stringToBytes } from '@taquito/utils';
import { timelockCode, timelockStorage } from '../data/timelock-flip-contract';

// please read the following link to understand the game (with guessing blocks increase from 10 to 20)
// https://gitlab.com/tezos/tezos/-/blob/master/src/proto_alpha/lib_protocol/contracts/timelock_flip.tz

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  const time = 1024;
  const message = 'hi';
  let chestKey: ChestKey;

  describe(`Timelock test coin flip contract ${rpc}`, () => {
    let contract: DefaultContractType
    beforeAll(async () => {
      await setup();
      const originate = await Tezos.contract.originate({ code: timelockCode, init: timelockStorage });
      await originate.confirmation()
      contract = await originate.contract();
      const storageB4: any = await contract.storage()

      expect(storageB4.level.toNumber()).toBe(0)
      expect(storageB4.guess).toBe('ff')
      expect(storageB4.result).toBe('ff')
    })

    it('should be able to initialize the game with chest', async () => {
      const payload = new TextEncoder().encode(message);
      const { chest, key } = Chest.newChestAndKey(payload, time);
      chestKey = key;
      let init = await contract.methodsObject.initialize_game(chest.encode()).send()
      await init.confirmation()
      const storageInit: any = await contract.storage()

      expect(storageInit.level.toNumber()).toBeGreaterThan(0)
      expect(storageInit.guess).toBe('a0')
      expect(storageInit.result).toBe('a0')
    });

    it('should be able to guess right', async () => {
      let guess1 = await contract.methodsObject.guess(stringToBytes(message)).send()
      await guess1.confirmation()
      const storageGuess: any = await contract.storage()

      expect(storageGuess.guess).toBe(stringToBytes(message))
      expect(storageGuess.result).toBe('b0')
    });

    it('should be able to finish/unlock the game', async () => {
      let finish = await contract.methodsObject.finish_game(chestKey.encode()).send()
      await finish.confirmation()
      const storageFinish: any = await contract.storage()

      expect(storageFinish.guess).toBe(stringToBytes(message))
      expect(storageFinish.result).toBe('00')
    });


    it('should be able to guess wrong', async () => {
      const payload = new TextEncoder().encode(message);
      const precomputedTimelock = Timelock.precompute(time);
      const { chest, key } = Chest.fromTimelock(payload, time, precomputedTimelock);
      chestKey = key;
      let init = await contract.methodsObject.initialize_game(chest.encode()).send()
      await init.confirmation()
      const storageInit: any = await contract.storage()

      expect(storageInit.level.toNumber()).toBeGreaterThan(0)
      expect(storageInit.guess).toBe('a0')
      expect(storageInit.result).toBe('a0')

      let guess1 = await contract.methodsObject.guess(stringToBytes('bad')).send()
      await guess1.confirmation()
      const storageGuess: any = await contract.storage()

      expect(storageGuess.guess).toBe(stringToBytes('bad'))
      expect(storageGuess.result).toBe('b0')
    });

    it('should be able to finish/unlock the wrong guess game', async () => {
      let finish = await contract.methodsObject.finish_game(chestKey.encode()).send()
      await finish.confirmation()
      const storageFinish: any = await contract.storage()

      expect(storageFinish.guess).toBe(stringToBytes('bad'))
      expect(storageFinish.result).toBe('01')
    });

    it(`shouldn't unlock the game with wrong key`, async () => {
      const payload = new TextEncoder().encode(message);
      const { chest } = Chest.newChestAndKey(payload, time);
      let init = await contract.methodsObject.initialize_game(chest.encode()).send()
      await init.confirmation()
      const storageInit: any = await contract.storage()

      expect(storageInit.level.toNumber()).toBeGreaterThan(0)
      expect(storageInit.guess).toBe('a0')
      expect(storageInit.result).toBe('a0')

      const { key } = Chest.newChestAndKey(payload, time);
      let finish = await contract.methodsObject.finish_game(key.encode()).send()
      await finish.confirmation()
      const storageFinish: any = await contract.storage()

      expect(storageFinish.guess).toBe('a0')
      expect(storageFinish.result).toBe('10')
    })
  });
});

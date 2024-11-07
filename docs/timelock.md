---
title: Timelock (BETA)
author: Davis Sawali & Hui-An Yang
---

:::warning
This feature is a work in progress and might go through refinements in the near future. We encourage Taquito users to try this feature and reach out to us if you have any issues or concerns.
:::

Timelock is a cryptographic primitive that can be used as a part of a commit & reveal scheme, it provides a guarantee that the information associated to the commit phase is eventually revealed.

## Commit & Reveal
A classic commit & reveal scheme consists of these 2 stepsL
- Before the deadline, each participant makes a decision and publishes a commitment, which is proof that they have made a decision that they are unable to change. The proof is the hash of the data they have decided on.
- After the deadline, each participant reveals the data corresponding to their commitment. Other participants will be able to check that the hash of this data is indeed the same as the previous commitment

This scheme makes it possible to prove a certain decision was made before the information is revealed. This information might be the decision of other participants, or some external independent information.

above excerpt, taken from [here](https://docs.tezos.com/smart-contracts/data-types/crypto-data-types#classical-commit--reveal-scheme)

## Taquito Implementation

### Creating a chest
```
import { Chest } from '@taquito/timelock'

const time = 10000;
const payload = new TextEncoder().encode('message');
const { chest, key } = Chest.newChestAndKey(payload, time);

const chestBytes = chest.encode();
const keyBytes = key.encode();
```

### Create a chest from an existing Timelock
```
import { Chest, Timelock } from '@taquito/timelock';

// ...
const time = 10000;
const precomputedTimelock = Timelock.precompute(time); // can be cached
const  { chest, key } = Chest.fromTimelock(payload, time, precomputedTimelock);

const chestBytes = chest.encode();
const keyBytes = key.encode();
```

### Opening a chest with an existing key
```
import { Chest, ChestKey} from '@taquito/timelock';

//...
const time = 10000;
const [chest] = Chest.fromArray(chestBytes);
const [chestKey] = ChestKey.fromArray(chestKeyBytes);
const data = chest.open(chestKey, time);

```

**Important Notes**:
- `time` param being passed should not be mistaken with the 'time' it takes for a chest to open in Timelocks. The `time` param here relates to a complexity relating to the number of power by modulo operations required to compute the key. Without getting too much into the weeds, we recommend using a value of `10000` and adjust accordingly.
- `payload` relates to the message payload you would like to lock in a chest

## Coinflip Contract Example
This example is an excerpt from [Tezos docs](https://tezos.gitlab.io/active/timelock.html?highlight=timelock#example) and contracts are taken from [timelock_flip.tz](https://gitlab.com/tezos/tezos/-/blob/master/src/proto_alpha/lib_protocol/contracts/timelock_flip.tz).

This game emulates a time constrained "guess who" game using timelocks. The goal of the game is for the challenger to guess which value was stored by the administrator. The challenger has one guess, and must submit it within 10 blocks of the game initialization.

Please note that the contract used in this example is for educational purposes only and might not be secure.

Its storage consists of 4 values, `level` and `chest` that relates to the initial value stored in the timelock during the start of the game. `guess` that relates to what value the player guesses to be the result of the coinflip, and `result` that indicates the status of the game.

### Contract in Micheline
```
storage (pair (nat %level) chest (bytes %guess) (bytes %result));
parameter ( or (chest %initialize_game) (or (bytes %guess) (chest_key %finish_game)));
code { UNPAIR 5;
       IF_LEFT { # If we receive a chest,
                 # we reinitialise the storage
                 # with the new chest and current level.
                 DIP {DROP 4};
                 PUSH bytes 0xA0;
                 DUP;
                 PAIR;
                 SWAP;
                 LEVEL;
                 PAIR 3}
               { IF_LEFT { # If we receive a guess,
                           SWAP;
                           DUP;
                           PUSH nat 10;
                           ADD;
                           LEVEL;
                           COMPARE;
                           LE;
                           IF { # we store the guess if current level < stored level + 10
                                DIP 2 {PUSH bytes 0xB0};
                                DIP {PAIR; SWAP; PAIR};
                                PAIR;
                                DIP {DROP 2};
                              }
                              { # else we keep the storage unchanged.
                                SWAP;
                                DROP;
                                PAIR 4};
                          }
                         { # If we receive a chest_key,
                           # we open the chest.
                           DIP 4 {DROP};
                           DUP 3;
                           SWAP;
                           DIP 2 {PUSH nat 1024};
                           OPEN_CHEST;
                           IF_SOME { # If the chest opens successfully,
                                     # we compare the guess with the locked value.
                                     DUP 4;
                                     COMPARE;
                                     EQ;
                                     IF { # If they are equal we store 0x00
                                          PUSH bytes 0x00}
                                        { # else we store 0x01
                                          PUSH bytes 0x01}}
                                   { # We store 0x10 in case of failure
                                     PUSH bytes 0x10};
                           DIG 3;
                           PAIR;
                           DIG 2;
                           PAIR;
                           DIG 1;
                           PAIR;
                          };
               };
       NIL operation;
       PAIR;
     }
```

### Originate the coinflip contract
Let's originate the contract with initial storage values `level` of 0, a stub chest, `guess` value of 'ff' and `result` 'ff'.

`timelockCode` and `timelockStorage` can be found [here](https://github.com/ecadlabs/taquito/blob/master/integration-tests/data/timelock-flip-contract.ts)

```
// import { TezosToolkit } from '@taquito/taquito';
// import { Chest } from '@taquito/timelock';
// import { stringToBytes } from '@taquito/utils';
// import { timelockCode, timelockStorage } from './timelock-flip-contract';

// const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');

const originate = await Tezos.contract.originate({ code: timelockCode, init: timelockStorage });
await originate.confirmation()
contract = await originate.contract();
const originateStorage: any = await contract.storage()

// originateStorage = {
//   '1': 'caa0f4fdc993f1c39f8e89d6e29df8d09685b6faeccd99ddc99cc9ad9381f3ca86c8a7b98590da80eeefec83f4ebf8e7fcfc92daeee5d5d8cfdedfdbcdd0849a9cf793e8fbc6c389e6f3e783caf7a3b7bea69c81acb9d3afc9b9a186f8f4fda4d0a8a9d0b6dbac88e3f4cef6d0fe81c8afde84bf99d0e48ec589e8f8b587fda9f8ee85ef89a5ddc9eccdf3fc8df8c894c8e7dfceff9bc7a482cb83f78caaa6989d9db1a68ff7b99aa490eca285ff87a1b3ecf8d7b7d0f992f0d4aad2b7e7a3ba9fc794d5d098cfa7b79fdefda19b84e78fd98dec8fb18aaee9cc92b8d49f90e5cab2ab86ad9f9c8ced94d1bdecb38cd5b7e59ca5e9ec9face6fcacc9cab3adad97e0df99d7f8b1b0f9fbeab892c8989091c3b1b7ec98aaa7918acfe081e9d6fd98f3d0c201ae8e0f0470e26cfd98d461a07d506a0ec5f45dcbaed3b43a000000113f7d9ccf48b510e34b2c32532e3874f354',
//   level: BigNumber { s: 1, e: 0, c: [ 0 ] },
//   guess: 'ff',
//   result: 'ff'
// }
```

### Initialize the game
Let us now generate `chest` and `chestKey` with a complexity of `1024`, and a payload message 'hi'.

Make a contract call to initialize the game, and the contract will update the storage values for `level` to be at head block, `chest` to point to the `chest` we generated, and both `guess` and `result` as 'a0'.

```
...
const time = 1024
const message = 'hi'
const payload = new TextEncoder().encode(message);
const { chest, Key } = Chest.newChestAndKey(payload, time);
let init = await contract.methodsObject.initialize_game(chest.encode()).send()
await init.confirmation()
const initStorage: any = await contract.storage()

// initStorage = {
//   '1': 'd3b9d5b9f5e6ece3a2df808cf5b29faf9ff0cf97b6c4c09fa0f8b79d83fdbcf5e8babccf90f9a29edb8ec1beaeb09eeeacd3f0998cd0a0e7e8c997d8afe0fee1f992f498d6d4d5fff39bdbfac3c2f194bebdf886d586bfdea8bbe0bac3aeb9f7daa4cdd6fda58d83f7c7f29affaa98e5c4cfd8da92c8ace4ce8f93e68486c18384a9bc85a7a9d0e7dace83ebeec4dde9e6f7dee388f0f49396bbe7c6faa1fe9debcef8bbb0d4cfe99e9cf897e8d4d7f586d895adafc9fdf3bfa386ff8d998af7f6c2c3b8eee9f188d9ddaab9da9797acd9f496e7b0d4a5a888ec9599cf95bdcd828df4f98e8e97f0d493c7bc84e9b3d1f5d2f2abf4f4b9dec2c88fa7c4b3f4fae1a4a7b7c0e1a182a495e8a9fdcee7b3cccdbd95f7eca5ac82c5f695bbd4e3d4d4d2b9d10945902c927e25e24e2390c8adee79fcbf989f3c06d260bcc300000012fa6f8fc2a7fc18bc30e1e491f8995e0dbf13',
//   level: BigNumber { s: 1, e: 6, c: [ 1140114 ] },
//   guess: 'a0',
//   result: 'a0'
// }
```

### Submitting our guess
Let us now make a contract call to the `guess` entrypoint with a payload message 'hi' that will update the storage values of `guess` to `6869`, and `result` to 'b0'.

```
...
let guess1 = await contract.methodsObject.guess(stringToBytes(message)).send()
await guess1.confirmation()
const storageGuess: any = await contract.storage()

// storageGuess = {
//   '1': 'd3b9d5b9f5e6ece3a2df808cf5b29faf9ff0cf97b6c4c09fa0f8b79d83fdbcf5e8babccf90f9a29edb8ec1beaeb09eeeacd3f0998cd0a0e7e8c997d8afe0fee1f992f498d6d4d5fff39bdbfac3c2f194bebdf886d586bfdea8bbe0bac3aeb9f7daa4cdd6fda58d83f7c7f29affaa98e5c4cfd8da92c8ace4ce8f93e68486c18384a9bc85a7a9d0e7dace83ebeec4dde9e6f7dee388f0f49396bbe7c6faa1fe9debcef8bbb0d4cfe99e9cf897e8d4d7f586d895adafc9fdf3bfa386ff8d998af7f6c2c3b8eee9f188d9ddaab9da9797acd9f496e7b0d4a5a888ec9599cf95bdcd828df4f98e8e97f0d493c7bc84e9b3d1f5d2f2abf4f4b9dec2c88fa7c4b3f4fae1a4a7b7c0e1a182a495e8a9fdcee7b3cccdbd95f7eca5ac82c5f695bbd4e3d4d4d2b9d10945902c927e25e24e2390c8adee79fcbf989f3c06d260bcc300000012fa6f8fc2a7fc18bc30e1e491f8995e0dbf13',
//   level: BigNumber { s: 1, e: 6, c: [ 1140114 ] },
//   guess: '6869',
//   result: 'b0'
// }
```

### Revealing the time-locked value with `chestKey`
We can now make a contract call to the `finish_game` entrypoint with a `chestKey` to open the timelock. If successful, the contract will compare the value of `guess` to the timelock message. If the bytes are equal, the message is updated to `0x00`. If false, it would be updated to `0x01`.

If the chest opening fails, the message will be updated to `0x10`.

```
...
let finish = await contract.methodsObject.finish_game(key.encode()).send()
await finish.confirmation()
const storageFinish: any = await contract.storage()

// storageFinish = {
//   '1': 'd3b9d5b9f5e6ece3a2df808cf5b29faf9ff0cf97b6c4c09fa0f8b79d83fdbcf5e8babccf90f9a29edb8ec1beaeb09eeeacd3f0998cd0a0e7e8c997d8afe0fee1f992f498d6d4d5fff39bdbfac3c2f194bebdf886d586bfdea8bbe0bac3aeb9f7daa4cdd6fda58d83f7c7f29affaa98e5c4cfd8da92c8ace4ce8f93e68486c18384a9bc85a7a9d0e7dace83ebeec4dde9e6f7dee388f0f49396bbe7c6faa1fe9debcef8bbb0d4cfe99e9cf897e8d4d7f586d895adafc9fdf3bfa386ff8d998af7f6c2c3b8eee9f188d9ddaab9da9797acd9f496e7b0d4a5a888ec9599cf95bdcd828df4f98e8e97f0d493c7bc84e9b3d1f5d2f2abf4f4b9dec2c88fa7c4b3f4fae1a4a7b7c0e1a182a495e8a9fdcee7b3cccdbd95f7eca5ac82c5f695bbd4e3d4d4d2b9d10945902c927e25e24e2390c8adee79fcbf989f3c06d260bcc300000012fa6f8fc2a7fc18bc30e1e491f8995e0dbf13',
//   level: BigNumber { s: 1, e: 6, c: [ 1140114 ] },
//   guess: '6869',
//   result: '00'
// }
```

import { BigInteger } from 'big-integer';

export interface RNG {
  getRandomValues: (array: Uint8Array) => Uint8Array;
}

export interface TimelockInit {
  lockedValue: BigInteger;
  unlockedValue: BigInteger;
  vdfProof: BigInteger;
  modulus?: BigInteger;
}

export interface CipherText {
  nonce: Uint8Array;
  payload: Uint8Array;
}

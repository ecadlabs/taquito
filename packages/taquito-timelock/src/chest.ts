import { openSecretBox, secretBox } from '@stablelib/nacl';
import { BigInteger } from 'big-integer';
import { RNG, CipherText } from './interface';
import {
  TimelockProof,
  Timelock,
  unlockAndProve,
  verify,
  encodeBigInt,
  decodeBigInt,
} from './timelock-util';
import * as crypto from 'crypto';

const defaultRNG: RNG = crypto;

export class ChestKey extends TimelockProof {}

export function encrypt(key: Uint8Array, text: Uint8Array, rng: RNG = defaultRNG): CipherText {
  const nonce = new Uint8Array(24);
  rng.getRandomValues(nonce);
  const payload = secretBox(key, nonce, text);
  return {
    payload,
    nonce,
  };
}

export function decrypt(key: Uint8Array, c: CipherText): Uint8Array | null {
  return openSecretBox(key, c.nonce, c.payload);
}

export class Chest {
  lockedValue: BigInteger;
  cipherText: CipherText;

  constructor({ lockedValue, cipherText }: { lockedValue: BigInteger; cipherText: CipherText }) {
    this.lockedValue = lockedValue;
    this.cipherText = cipherText;
  }

  static newChestAndKey(
    payload: Uint8Array,
    time: number,
    mod?: BigInteger,
    rng?: RNG
  ): { chest: Chest; key: ChestKey } {
    if (time <= 0) {
      throw new Error('Invalid argument');
    }
    const vdfTuple = Timelock.precompute(time, mod, rng);
    return Chest.fromTimelock(payload, time, vdfTuple, rng);
  }

  static fromTimelock(
    payload: Uint8Array,
    time: number,
    timelock: Timelock,
    rng?: RNG
  ): { chest: Chest; key: ChestKey } {
    if (time <= 0) {
      throw new Error('Invalid argument');
    }
    const { lockedValue, proof } = timelock.getProof(time, rng);
    const symKey = proof.symmetricKey();
    const cipherText = encrypt(symKey, payload, rng);
    return { chest: new Chest({ lockedValue, cipherText }), key: proof };
  }

  newKey(time: number, mod?: BigInteger): ChestKey {
    if (time <= 0) {
      throw new Error('Invalid argument');
    }
    return unlockAndProve(time, this.lockedValue, mod);
  }

  open(key: ChestKey, time: number): Uint8Array | null {
    if (time <= 0) {
      throw new Error('Invalid argument');
    }
    if (!verify(this.lockedValue, key, time)) {
      return null;
    }
    const symKey = key.symmetricKey();
    return decrypt(symKey, this.cipherText);
  }

  encode(): Uint8Array {
    const locked = encodeBigInt(this.lockedValue);
    const res = new Uint8Array(locked.length + 24 + 4 + this.cipherText.payload.length);
    res.set(locked);
    let off = locked.length;
    res.set(this.cipherText.nonce, off);
    off += 24;
    new DataView(res.buffer, res.byteOffset, res.byteLength).setUint32(
      off,
      this.cipherText.payload.length
    );
    off += 4;
    res.set(this.cipherText.payload, off);
    return res;
  }

  static fromArray(buf: Uint8Array): [Chest, number] {
    let i = 0;
    const [lockedValue, n] = decodeBigInt(buf);
    i += n;
    if (buf.length - i < 24 + 4) {
      throw new Error('Buffer is too short');
    }
    const nonce = new Uint8Array(buf.slice(i, i + 24));
    i += 24;
    const len = new DataView(buf.buffer, buf.byteOffset, buf.byteLength).getUint32(i);
    i += 4;
    if (buf.length - i < len) {
      throw new Error('Buffer is too short');
    }
    const payload = new Uint8Array(buf.slice(i, i + len));
    i += len;
    return [new Chest({ lockedValue, cipherText: { nonce, payload } }), i];
  }
}

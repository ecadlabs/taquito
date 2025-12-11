/* eslint-disable @typescript-eslint/no-this-alias */
import { HMAC } from '@stablelib/hmac';
import { SHA512 } from '@stablelib/sha512';
import { generateKeyPairFromSeed } from '@stablelib/ed25519';
import { ExtendedPrivateKey, Hard } from './types';
import { parseHex } from './utils';
import { InvalidSeedLengthError } from '../errors';
import { InvalidDerivationPathError } from '@taquito/core';

// MinSeedSize is the minimal allowed seed byte length
const minSeedSize = 16;
// MaxSeedSize is the maximal allowed seed byte length
const maxSeedSize = 64;

const ed25519Key = 'ed25519 seed';

export class PrivateKey implements ExtendedPrivateKey {
  /**
   *
   * @param priv generated keypair 0->32 private key 32->n public key
   * @param chainCode new HMAC hash with new key
   */
  constructor(
    readonly priv: Uint8Array,
    readonly chainCode: Uint8Array
  ) {}

  /**
   *
   * @param seedSrc result of Bip39.mnemonicToSeed
   * @returns instance of PrivateKey
   * @throws {@link InvalidSeedLengthError}
   */
  static fromSeed(seedSrc: Uint8Array | string): PrivateKey {
    const seed = typeof seedSrc === 'string' ? parseHex(seedSrc) : seedSrc;
    if (seed.length < minSeedSize || seed.length > maxSeedSize) {
      throw new InvalidSeedLengthError(seed.length);
    }
    const key = new TextEncoder().encode(ed25519Key);
    const sum = new HMAC(SHA512, key).update(seed).digest();
    return new PrivateKey(generateKeyPairFromSeed(sum.subarray(0, 32)).secretKey, sum.subarray(32));
  }
  /**
   *
   * @returns slice(0, 32) of current priv for new seed for next derived priv
   */
  seed(): Uint8Array {
    return this.priv.subarray(0, 32);
  }
  /**
   * @index current derivation path item ie: 1729'
   * @returns derivation path child of original private key pair
   */
  derive(index: number): PrivateKey {
    if ((index & Hard) === 0) {
      throw new InvalidDerivationPathError(index.toString(), ': Non-hardened derivation path.');
    }
    const data = new Uint8Array(37);
    data.set(this.seed(), 1);
    new DataView(data.buffer).setUint32(33, index);
    const sum = new HMAC(SHA512, this.chainCode).update(data).digest();
    return new PrivateKey(generateKeyPairFromSeed(sum.subarray(0, 32)).secretKey, sum.subarray(32));
  }
  /**
   * @param path array of numbers pre adjusted for hardened paths ie: 44' -> 2^31 + 44
   * @returns final child of full derivation path private key pair
   */
  derivePath(path: Iterable<number>): PrivateKey {
    let key: PrivateKey = this;
    for (const index of path) {
      key = key.derive(index);
    }
    return key;
  }
}

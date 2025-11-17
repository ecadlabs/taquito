/* eslint-disable @typescript-eslint/no-this-alias */
import { ec, curve } from 'elliptic';
import { Hard, ExtendedPrivateKey } from './types';
import { HMAC } from '@stablelib/hmac';
import { SHA512 } from '@stablelib/sha512';
import BN from 'bn.js';
import { parseHex } from './utils';
import { InvalidBitSize, InvalidCurveError, InvalidSeedLengthError } from '../errors';
import { InvalidKeyError } from '@taquito/core';

export type CurveName = 'p256' | 'secp256k1';

const seedKey: Record<CurveName, string> = {
  p256: 'Nist256p1 seed',
  secp256k1: 'Bitcoin seed',
};

interface KeyPair extends ec.KeyPair {
  priv: BN | null;
  pub: curve.base.BasePoint | null;
}

// MinSeedSize is the minimal allowed seed byte length
const minSeedSize = 16;
// MaxSeedSize is the maximal allowed seed byte length
const maxSeedSize = 64;

export class PrivateKey implements ExtendedPrivateKey {
  readonly keyPair: KeyPair;
  /**
   *
   * @param priv key pair priv (BN) pub (curve.base.BasePint) if applicable
   * @param chainCode slice 32->n HMAC hash key and seedkey (first instance curve default seedKey. after hmac value slice 32->n)
   */
  constructor(priv: ec.KeyPair, public readonly chainCode: Uint8Array) {
    this.keyPair = <KeyPair>priv;
  }
  /**
   * @param seedSrc result of Bip39.mnemonicToSeed
   * @param curve known supported curve p256 or secp256k1
   * @returns instance of PrivateKey non-HD keys derived
   * @throws {@link InvalidBitSize} | {@link InvalidCurveError} | {@link InvalidSeedLengthError}
   */
  static fromSeed(seedSrc: Uint8Array | string, curve: CurveName): PrivateKey {
    let seed = typeof seedSrc === 'string' ? parseHex(seedSrc) : seedSrc;
    if (seed.length < minSeedSize || seed.length > maxSeedSize) {
      throw new InvalidSeedLengthError(seed.length);
    }
    if (!Object.prototype.hasOwnProperty.call(seedKey, curve)) {
      throw new InvalidCurveError(
        `Unsupported curve "${curve}" expecting either "p256" or "secp256k1"`
      );
    }
    const c = new ec(curve);
    if (c.n?.bitLength() !== 256) {
      throw new InvalidBitSize(
        `Invalid curve "${curve}" with bit size "${c.n?.bitLength()}" expecting bit size "256"`
      );
    }

    const key = new TextEncoder().encode(seedKey[curve]);
    let d: BN | null = null;
    let chain: Uint8Array = new Uint8Array();
    let i = 0;
    while (i === 0) {
      const sum = new HMAC(SHA512, key).update(seed).digest();
      d = new BN(sum.subarray(0, 32));
      chain = sum.subarray(32);
      if (d.isZero() || d.cmp(c.n as BN) >= 0) {
        seed = sum;
      } else {
        i++;
      }
    }

    const keyPair = <KeyPair>c.keyPair({});
    keyPair.priv = d;
    return new PrivateKey(keyPair, chain);
  }
  /**
   *
   * @param index derivation path item pre-hardened if applicable ie: 44' -> 2^31 + 44
   * @returns child PrivateKey of the current PrivateKey
   */
  derive(index: number): PrivateKey {
    const data = new Uint8Array(37);
    if ((index & Hard) !== 0) {
      // hardened derivation
      data.set(this.keyPair.getPrivate().toArray(), 1);
    } else {
      data.set(this.keyPair.getPublic().encodeCompressed(), 0);
    }
    new DataView(data.buffer).setUint32(33, index);

    let d: BN = new BN(0);
    let chain: Uint8Array = new Uint8Array();
    let i = 0;
    while (i === 0) {
      const sum = new HMAC(SHA512, this.chainCode).update(data).digest();
      d = new BN(sum.subarray(0, 32));
      chain = sum.subarray(32);
      if (this.keyPair.ec.n && d.cmp(this.keyPair.ec.n as BN) < 0) {
        d = d.add(this.keyPair.getPrivate() as BN).mod(this.keyPair.ec.n as BN);
        if (!d.isZero()) {
          i++;
        }
      }
      data.set(chain, 1);
      data[0] = 1;
    }
    const keyPair = <KeyPair>this.keyPair.ec.keyPair({});
    keyPair.priv = d;
    return new PrivateKey(keyPair, chain);
  }
  /**
   *
   * @param path pre-hardened (if applicable) derivation path items ie 44'/1729'/0/0 -> 2^31 + 44/2^31 + 1729/0/0
   * @returns final child of the full HD keys derivation
   */
  derivePath(path: Iterable<number>): PrivateKey {
    let key: PrivateKey = this;
    for (const x of path) {
      key = key.derive(x);
    }
    return key;
  }
  /**
   *
   * @returns Uint8Array (if contains a private key)
   * @throws {@link InvalidKeyError}
   */
  bytes(): Uint8Array {
    if (!this.keyPair.priv) {
      throw new InvalidKeyError('missing private key');
    }
    // pad to 32 bytes as toArray() length argument seems to be ignored (BN bug)
    const src = this.keyPair.priv.toArray();
    const out = new Uint8Array(32);
    out.set(src, out.length - src.length);
    return out;
  }
}

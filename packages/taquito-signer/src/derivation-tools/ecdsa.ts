/* eslint-disable @typescript-eslint/no-this-alias */
import { secp256k1 } from '@noble/curves/secp256k1';
import { p256 } from '@noble/curves/nist';
import { Hard, ExtendedPrivateKey } from './index';
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

interface KeyPair {
  priv: BN | null;
  pub: Uint8Array | null;
  curve: 'secp256k1' | 'p256';
  getPrivate(): BN;
  getPublic(): Uint8Array;
  getPublicCompressed(): Uint8Array;
}

// MinSeedSize is the minimal allowed seed byte length
const minSeedSize = 16;
// MaxSeedSize is the maximal allowed seed byte length
const maxSeedSize = 64;

class NobleKeyPair implements KeyPair {
  public priv: BN | null;
  public pub: Uint8Array | null;
  public curve: 'secp256k1' | 'p256';

  constructor(curve: 'secp256k1' | 'p256', privateKey?: BN) {
    this.curve = curve;
    this.priv = privateKey || null;
    this.pub = null;

    if (this.priv) {
      this.pub = this.getPublic();
    }
  }

  getPrivate(): BN {
    if (!this.priv) {
      throw new Error('Private key not set');
    }
    return this.priv;
  }

  getPublic(): Uint8Array {
    if (!this.priv) {
      throw new Error('Private key not set');
    }

    const privateKeyBytes = this.priv.toArray('be', 32);
    const privateKeyUint8 = new Uint8Array(privateKeyBytes);

    if (this.curve === 'secp256k1') {
      return secp256k1.getPublicKey(privateKeyUint8, false); // false = uncompressed
    } else {
      return p256.getPublicKey(privateKeyUint8, false); // false = uncompressed
    }
  }

  getPublicCompressed(): Uint8Array {
    if (!this.priv) {
      throw new Error('Private key not set');
    }

    const privateKeyBytes = this.priv.toArray('be', 32);
    const privateKeyUint8 = new Uint8Array(privateKeyBytes);

    if (this.curve === 'secp256k1') {
      return secp256k1.getPublicKey(privateKeyUint8, true); // true = compressed
    } else {
      return p256.getPublicKey(privateKeyUint8, true); // true = compressed
    }
  }
}

export class PrivateKey implements ExtendedPrivateKey {
  readonly keyPair: KeyPair;
  /**
   *
   * @param priv key pair priv (BN) pub (curve.base.BasePint) if applicable
   * @param chainCode slice 32->n HMAC hash key and seedkey (first instance curve default seedKey. after hmac value slice 32->n)
   */
  constructor(
    priv: KeyPair,
    public readonly chainCode: Uint8Array
  ) {
    this.keyPair = priv;
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
    // Get curve order for validation
    let curveOrder: BN;
    if (curve === 'secp256k1') {
      curveOrder = new BN(secp256k1.Point.CURVE().n.toString());
    } else {
      curveOrder = new BN(p256.Point.CURVE().n.toString());
    }

    if (curveOrder.bitLength() !== 256) {
      throw new InvalidBitSize(
        `Invalid curve "${curve}" with bit size "${curveOrder.bitLength()}" expecting bit size "256"`
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
      if (d.isZero() || d.cmp(curveOrder) >= 0) {
        seed = sum;
      } else {
        i++;
      }
    }

    const keyPair = new NobleKeyPair(curve, d!);
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
      data.set(this.keyPair.getPublicCompressed(), 0);
    }
    new DataView(data.buffer).setUint32(33, index);

    let d: BN = new BN(0);
    let chain: Uint8Array = new Uint8Array();
    let i = 0;
    while (i === 0) {
      const sum = new HMAC(SHA512, this.chainCode).update(data).digest();
      d = new BN(sum.subarray(0, 32));
      chain = sum.subarray(32);
      // Get curve order for comparison
      let curveOrder: BN;
      if (this.keyPair.curve === 'secp256k1') {
        curveOrder = new BN(secp256k1.CURVE.n.toString());
      } else {
        curveOrder = new BN(p256.CURVE.n.toString());
      }

      if (d.cmp(curveOrder) < 0) {
        d = d.add(this.keyPair.getPrivate()).mod(curveOrder);
        if (!d.isZero()) {
          i++;
        }
      }
      data.set(chain, 1);
      data[0] = 1;
    }
    const keyPair = new NobleKeyPair(this.keyPair.curve, d);
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

import { hash as blake2b } from '@stablelib/blake2b';
import { HMAC } from '@stablelib/hmac';
import { SHA512 } from '@stablelib/sha512';
import {
  PrefixV2,
  b58DecodeAndCheckPrefix,
  b58Encode,
  compareArrays,
  InvalidPublicKeyError,
} from '@taquito/utils';
import { secp256k1 } from '@noble/curves/secp256k1';
import { p256 } from '@noble/curves/nist';
import { CurveFn } from '@noble/curves/abstract/weierstrass';
import { SigningKey, PublicKey } from './key-interface';
import { RawSignResult } from '@taquito/core';
import { InvalidCurveError, InvalidSeedLengthError } from './errors';
import { arrayToBigInt, bigIntToArray, Hard, maxSeedSize, minSeedSize } from './derivation-utils';

export type Curve = 'p256' | 'secp256k1';

type CurvePrefix = {
  [curve in Curve]: {
    pk: PrefixV2;
    sk: PrefixV2;
    pkh: PrefixV2;
    sig: PrefixV2;
    tag: number;
  };
};

const pref: CurvePrefix = {
  p256: {
    pk: PrefixV2.P256PublicKey,
    sk: PrefixV2.P256SecretKey,
    pkh: PrefixV2.P256PublicKeyHash,
    sig: PrefixV2.P256Signature,
    tag: 2,
  },
  secp256k1: {
    pk: PrefixV2.Secp256k1PublicKey,
    sk: PrefixV2.Secp256k1SecretKey,
    pkh: PrefixV2.Secp256k1PublicKeyHash,
    sig: PrefixV2.Secp256k1Signature,
    tag: 1,
  },
};

type CurveFuncs = {
  [curve in Curve]: CurveFn;
}

const curveFn: CurveFuncs = {
  p256: p256,
  secp256k1: secp256k1,
}

/**
 * @description Provide signing logic for elliptic curve based key (tz2, tz3)
 */
export class ECKey implements SigningKey {
  #keyPair: { secretKey: Uint8Array; publicKey: Uint8Array };
  public readonly curve: Curve;
  /**
   *
   * @param key Encoded private key
   * @param decrypt Decrypt function
   * @throws {@link InvalidKeyError}
   */

  constructor(key: string, decrypt?: (k: Uint8Array) => Uint8Array);
  constructor(key: Uint8Array, curve: Curve);
  constructor(key: string | Uint8Array, decrypt?: ((k: Uint8Array) => Uint8Array) | Curve) {
    const [priv, curve] = ((): [Uint8Array, Curve] => {
      if (typeof key === 'string') {
        const [keyData, prefix] = b58DecodeAndCheckPrefix(key, [
          PrefixV2.Secp256k1EncryptedSecretKey,
          PrefixV2.P256EncryptedSecretKey,
          PrefixV2.Secp256k1SecretKey,
          PrefixV2.P256SecretKey,
        ]);

        return ((): [Uint8Array, Curve] => {
          switch (prefix) {
            case PrefixV2.Secp256k1EncryptedSecretKey:
            case PrefixV2.P256EncryptedSecretKey:
              if (decrypt === undefined) {
                throw new Error('decryption function is not provided');
              } else if (typeof decrypt === 'function') {
                return [
                  decrypt(keyData),
                  prefix === PrefixV2.Secp256k1EncryptedSecretKey ? 'secp256k1' : 'p256',
                ];
              } else {
                throw new Error('decrypt argument is not a function')
              }
            case PrefixV2.Secp256k1SecretKey:
              return [keyData, 'secp256k1'];
            default:
              return [keyData, 'p256'];
          }
        })();
      } else if (key instanceof Uint8Array && typeof decrypt === 'string') {
        if (!Object.prototype.hasOwnProperty.call(curveFn, decrypt)) {
          throw new InvalidCurveError(
            `Unsupported curve "${decrypt}" expecting either "p256" or "secp256k1"`
          );
        }
        return [key, decrypt];
      } else {
        throw new Error('invalid arguments');
      }
    })();

    this.curve = curve;
    this.#keyPair = {
      secretKey: priv,
      publicKey: curveFn[curve].getPublicKey(priv, true)
    };
  }

  /**
   *
   * @param bytes Bytes to sign
   * @param bytesHash Blake2b hash of the bytes to sign
   */
  sign(bytes: Uint8Array): RawSignResult {
    const hash = blake2b(bytes, 32);
    const signature = curveFn[this.curve].sign(hash, this.#keyPair.secretKey, { lowS: true }).toBytes('compact');

    return {
      rawSignature: signature,
      sig: b58Encode(signature, PrefixV2.GenericSignature),
      prefixSig: b58Encode(signature, pref[this.curve].sig),
    };
  }

  /**
   * @returns Encoded public key
   */
  publicKey(): PublicKey {
    return new ECPublicKey(this.#keyPair.publicKey, this.curve);
  }

  /**
   * @returns Encoded private key
   */
  secretKey(): string {
    return b58Encode(this.#keyPair.secretKey, pref[this.curve].sk);
  }

  bytes(): Uint8Array {
    return this.#keyPair.secretKey;
  }
}

const seedKey: { [curve in Curve]: string } = {
  p256: 'Nist256p1 seed',
  secp256k1: 'Bitcoin seed',
};

export class ExtendedECKey extends ECKey {
  public readonly chainCode: Uint8Array;

  constructor(seed: Uint8Array, curve: Curve);
  constructor(privateKey: Uint8Array, chainCode: Uint8Array, curve: Curve);
  constructor(privateKey: Uint8Array, chainCode: Uint8Array | Curve, curve?: Curve) {
    const [key, chain, crv] = (() => {
      if (chainCode instanceof Uint8Array && curve !== undefined) {
        return [privateKey, chainCode, curve];
      } else if (typeof chainCode === 'string') {
        let seed = privateKey;
        const crv = chainCode;

        if (seed.length < minSeedSize || seed.length > maxSeedSize) {
          throw new InvalidSeedLengthError(seed.length);
        }
        if (!Object.prototype.hasOwnProperty.call(seedKey, crv)) {
          throw new InvalidCurveError(
            `Unsupported curve "${curve}" expecting either "p256" or "secp256k1"`
          );
        }

        const n = curveFn[crv].Point.CURVE().n;
        const key = new TextEncoder().encode(seedKey[crv]);
        let d: bigint, chain: Uint8Array;
        for (; ;) {
          const sum = new HMAC(SHA512, key).update(seed).digest();
          d = arrayToBigInt(sum.subarray(0, 32));
          chain = sum.subarray(32);
          if (d === BigInt(0) || d >= n) {
            seed = sum;
          } else {
            break;
          }
        }
        return [bigIntToArray(d, 32), chain, crv];
      } else {
        throw new Error('invalid argument types')
      }
    })();
    super(key, crv);
    this.chainCode = chain;
  }

  derive(index: number): ExtendedECKey {
    const data = new Uint8Array(37);
    if ((index & Hard) !== 0) {
      // hardened derivation
      data.set(this.bytes(), 1);
    } else {
      data.set(this.publicKey().bytes(true), 0);
    }
    new DataView(data.buffer).setUint32(33, index);

    const n = curveFn[this.curve].Point.CURVE().n;
    const priv = arrayToBigInt(this.bytes());
    let d: bigint, chain: Uint8Array;
    for (; ;) {
      const sum = new HMAC(SHA512, this.chainCode).update(data).digest();
      d = arrayToBigInt(sum.subarray(0, 32));
      chain = sum.subarray(32);
      if (d !== BigInt(0) && d < n) {
        d = (d + priv) % n;
        if (d !== BigInt(0)) {
          break;
        }
      }
      data.set(chain, 1);
      data[0] = 1;
    }
    return new ExtendedECKey(bigIntToArray(d, 32), chain, this.curve);
  }
}

export class P256Key extends ExtendedECKey {
  static fromSeed(seed: Uint8Array): P256Key {
    return new P256Key(seed, 'p256');
  }
}

export class Secp256k1Key extends ExtendedECKey {
  static fromSeed(seed: Uint8Array): Secp256k1Key {
    return new Secp256k1Key(seed, 'secp256k1');
  }
}

export class ECPublicKey implements PublicKey {
  #key: Uint8Array;
  public readonly curve: Curve;

  constructor(src: string);
  constructor(src: Uint8Array, curve: Curve);
  constructor(src: string | Uint8Array, curve?: Curve) {
    const [key, crv] = ((): [Uint8Array, Curve] => {
      if (typeof src === 'string') {
        const [key, pre] = b58DecodeAndCheckPrefix(src, [
          PrefixV2.Secp256k1PublicKey,
          PrefixV2.P256PublicKey,
        ]);
        return [key, pre === PrefixV2.Secp256k1PublicKey ? 'secp256k1' : 'p256'];
      } else if (curve !== undefined) {
        return [src, curve];
      } else {
        throw new InvalidCurveError('missing curve type');
      }
    })();

    // For ECPublicKey, we don't need the private key, so we pass an empty array
    // The public key is stored separately
    this.#key = key;
    this.curve = crv;
  }

  compare(other: PublicKey): number {
    if (other instanceof ECPublicKey) {
      if (this.curve === other.curve) {
        const compress = this.curve === 'secp256k1';
        return compareArrays(this.bytes(compress), other.bytes(compress));
      } else if (this.curve === 'secp256k1') {
        return -1;
      } else {
        return 1;
      }
    } else {
      throw new InvalidPublicKeyError('ECDSA key expected');
    }
  }

  hash(): string {
    const key = this.bytes();
    return b58Encode(blake2b(key, 20), pref[this.curve].pkh);
  }

  bytes(compress: boolean = true): Uint8Array {
    // @noble/curves supports both compressed and uncompressed formats
    // We need to convert the stored public key to the requested format
    const point = curveFn[this.curve].Point.fromHex(this.#key);
    return point.toBytes(compress);
  }

  toProtocol(): Uint8Array {
    const key = this.bytes();
    const res = new Uint8Array(key.length + 1);
    res[0] = pref[this.curve].tag;
    res.set(key, 1);
    return res;
  }

  toString(): string {
    const key = this.bytes();
    return b58Encode(key, pref[this.curve].pk);
  }
}

import { hash as blake2b } from '@stablelib/blake2b';
import {
  PrefixV2,
  b58DecodeAndCheckPrefix,
  b58Encode,
  compareArrays,
  InvalidPublicKeyError,
} from '@taquito/utils';
import { secp256k1 } from '@noble/curves/secp256k1';
import { p256 } from '@noble/curves/nist.js';
import { SigningKey, PublicKey } from './key-interface';
import { RawSignResult } from '@taquito/core';
import { InvalidCurveError } from './errors';

type Curve = 'p256' | 'secp256k1';

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

/**
 * @description Provide signing logic for elliptic curve based key (tz2, tz3)
 */
export class ECKey implements SigningKey {
  #keyPair: { curve: Curve; secretKey: Uint8Array; publicKey: Uint8Array };

  /**
   *
   * @param key Encoded private key
   * @param decrypt Decrypt function
   * @throws {@link InvalidKeyError}
   */
  constructor(key: string, decrypt?: (k: Uint8Array) => Uint8Array) {
    const [keyData, prefix] = b58DecodeAndCheckPrefix(key, [
      PrefixV2.Secp256k1EncryptedSecretKey,
      PrefixV2.P256EncryptedSecretKey,
      PrefixV2.Secp256k1SecretKey,
      PrefixV2.P256SecretKey,
    ]);
    const [decKey, curve] = ((): [Uint8Array, Curve] => {
      switch (prefix) {
        case PrefixV2.Secp256k1EncryptedSecretKey:
        case PrefixV2.P256EncryptedSecretKey:
          if (decrypt === undefined) {
            throw new Error('decryption function is not provided');
          } else {
            return [
              decrypt(keyData),
              prefix === PrefixV2.Secp256k1EncryptedSecretKey ? 'secp256k1' : 'p256',
            ];
          }
        case PrefixV2.Secp256k1SecretKey:
          return [keyData, 'secp256k1'];
        default:
          return [keyData, 'p256'];
      }
    })();
    this.#keyPair = {
      curve,
      secretKey: decKey,
      publicKey:
        curve === 'secp256k1'
          ? secp256k1.getPublicKey(decKey, true)
          : p256.getPublicKey(decKey, true),
    };
  }

  /**
   *
   * @param bytes Bytes to sign
   * @param bytesHash Blake2b hash of the bytes to sign
   */
  sign(bytes: Uint8Array): RawSignResult {
    const hash = blake2b(bytes, 32);

    let signature: Uint8Array;
    if (this.#keyPair.curve === 'secp256k1') {
      signature = secp256k1
        .sign(hash, this.#keyPair.secretKey, {
          lowS: true, // Use canonical signatures (prevents malleability)
        })
        .toBytes('compact');
    } else {
      signature = p256
        .sign(hash, this.#keyPair.secretKey, {
          lowS: true, // Use canonical signatures (prevents malleability)
        })
        .toBytes('compact');
    }

    return {
      rawSignature: signature,
      sig: b58Encode(signature, PrefixV2.GenericSignature),
      prefixSig: b58Encode(signature, pref[this.#keyPair.curve].sig),
    };
  }

  /**
   * @returns Encoded public key
   */
  publicKey(): PublicKey {
    return new ECPublicKey(this.#keyPair.publicKey, this.#keyPair.curve);
  }

  /**
   * @returns Encoded private key
   */
  secretKey(): string {
    return b58Encode(this.#keyPair.secretKey, pref[this.#keyPair.curve].sk);
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

    if (this.curve === 'secp256k1') {
      // For secp256k1, we need to get the public key from the stored bytes and convert format
      const point = secp256k1.Point.fromHex(this.#key);
      return point.toBytes(compress);
    } else {
      // For p256, we need to get the public key from the stored bytes and convert format
      const point = p256.Point.fromHex(this.#key);
      return point.toBytes(compress);
    }
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

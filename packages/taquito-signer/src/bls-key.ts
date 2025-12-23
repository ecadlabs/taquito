import {
  b58DecodeAndCheckPrefix,
  BLS12_381_DST,
  POP_DST,
  PrefixV2,
  b58Encode,
  compareArrays,
  InvalidPublicKeyError,
} from '@taquito/utils';
import { bls12_381 } from '@noble/curves/bls12-381';
import { hash } from '@stablelib/blake2b';
import { PublicKey, SigningKeyWithProofOfPossession } from './key-interface';
import { RawSignResult } from '@taquito/core';
import { deriveChildSK, hkdfModR } from './bls-utils';

const bls = bls12_381.longSignatures; // AKA MinPK


export class BLSKey implements SigningKeyWithProofOfPossession {
  #key: Uint8Array;
  #publicKey: Uint8Array;

  constructor(key: string | Uint8Array, decrypt?: (k: Uint8Array) => Uint8Array) {
    if (typeof key === 'string') {
      const tmp = b58DecodeAndCheckPrefix(key, [
        PrefixV2.BLS12_381EncryptedSecretKey,
        PrefixV2.BLS12_381SecretKey,
      ]);
      let [keyData] = tmp;
      const [, prefix] = tmp;

      if (prefix === PrefixV2.BLS12_381EncryptedSecretKey) {
        if (decrypt !== undefined) {
          keyData = decrypt(keyData);
        } else {
          throw new Error('decryption function is not provided');
        }
      }
      this.#key = keyData;
    } else {
      this.#key = key;
    }
    this.#publicKey = bls.getPublicKey(this.sk()).toBytes();
  }

  private sk(): Uint8Array {
    return new Uint8Array(this.#key).reverse();
  }

  private signDst(message: Uint8Array, dst: string): RawSignResult {
    const point = bls.hash(message, dst);
    const sig = bls.sign(point, this.sk()).toBytes();
    return {
      rawSignature: sig,
      sig: b58Encode(sig, PrefixV2.GenericSignature),
      prefixSig: b58Encode(sig, PrefixV2.BLS12_381Signature),
    };
  }

  sign(message: Uint8Array): RawSignResult {
    return this.signDst(message, BLS12_381_DST);
  }

  provePossession(): RawSignResult {
    return this.signDst(this.#publicKey, POP_DST);
  }

  publicKey(): PublicKey {
    return new BLSPublicKey(this.#publicKey);
  }

  secretKey(): string {
    return b58Encode(this.#key, PrefixV2.BLS12_381SecretKey);
  }

  bytes(): Uint8Array {
    return this.#key;
  }

  derive(index: number): BLSKey {
    const sk = deriveChildSK(this.sk(), index).reverse();
    return new BLSKey(sk);
  }

  static fromSeed(seed: Uint8Array): BLSKey {
    const sk = hkdfModR(seed).reverse();
    return new BLSKey(sk);
  }
}

export class BLSPublicKey implements PublicKey {
  #key: Uint8Array;

  constructor(src: string | Uint8Array) {
    if (typeof src === 'string') {
      const [key, _] = b58DecodeAndCheckPrefix(src, [PrefixV2.BLS12_381PublicKey]);
      this.#key = key;
    } else {
      this.#key = src;
    }
  }
  compare(other: PublicKey): number {
    if (other instanceof BLSPublicKey) {
      return compareArrays(this.bytes(), other.bytes());
    } else {
      throw new InvalidPublicKeyError('BLS key expected');
    }
  }
  hash(): string {
    return b58Encode(hash(this.#key, 20), PrefixV2.BLS12_381PublicKeyHash);
  }

  bytes(): Uint8Array {
    return this.#key;
  }

  toProtocol(): Uint8Array {
    const res = new Uint8Array(this.#key.length + 1);
    res[0] = 3;
    res.set(this.#key, 1);
    return res;
  }

  toString(): string {
    return b58Encode(this.#key, PrefixV2.BLS12_381PublicKey);
  }
}

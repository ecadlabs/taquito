import { hash as blake2b } from '@stablelib/blake2b';
import { generateKeyPairFromSeed, sign, KeyPair } from '@stablelib/ed25519';
import {
  PrefixV2,
  b58DecodeAndCheckPrefix,
  b58Encode,
  InvalidPublicKeyError,
  compareArrays,
} from '@taquito/utils';
import { SigningKey, PublicKey } from './key-interface';
import { RawSignResult } from '@taquito/core';
import { Hard, maxSeedSize, minSeedSize } from './derivation-utils';
import { HMAC } from '@stablelib/hmac';
import { SHA512 } from '@stablelib/sha512';
import { InvalidDerivationIndexError, InvalidSeedLengthError } from './errors';

/**
 * @description Provide signing logic for ed25519 curve based key (tz1)
 */
export class EdKey implements SigningKey {
  #keyPair: KeyPair;

  /**
   *
   * @param key Encoded private key
   * @param encrypted Is the private key encrypted
   * @param decrypt Decrypt function
   * @throws {@link InvalidKeyError}
   */
  constructor(key: string, decrypt?: (k: Uint8Array) => Uint8Array);
  constructor(key: Uint8Array);
  constructor(key: string | Uint8Array, decrypt?: (k: Uint8Array) => Uint8Array) {
    if (typeof key === 'string') {
      const tmp = b58DecodeAndCheckPrefix(key, [
        PrefixV2.Ed25519SecretKey,
        PrefixV2.Ed25519EncryptedSeed,
        PrefixV2.Ed25519Seed,
      ]);
      let [keyData] = tmp;
      const [, prefix] = tmp;

      if (prefix === PrefixV2.Ed25519SecretKey) {
        this.#keyPair = {
          secretKey: keyData,
          publicKey: keyData.subarray(32),
        };
      } else {
        if (prefix === PrefixV2.Ed25519EncryptedSeed) {
          if (decrypt !== undefined) {
            keyData = decrypt(keyData);
          } else {
            throw new Error('decryption function is not provided');
          }
        }
        this.#keyPair = generateKeyPairFromSeed(keyData);
      }
    } else {
      this.#keyPair = generateKeyPairFromSeed(key);
    }
  }

  /**
   *
   * @param bytes Bytes to sign
   * @param bytesHash Blake2b hash of the bytes to sign
   */
  sign(bytes: Uint8Array): RawSignResult {
    const hash = blake2b(bytes, 32);
    const signature = sign(this.#keyPair.secretKey, hash);

    return {
      rawSignature: signature,
      sig: b58Encode(signature, PrefixV2.GenericSignature),
      prefixSig: b58Encode(signature, PrefixV2.Ed25519Signature),
    };
  }

  /**
   * @returns Encoded public key
   */
  publicKey(): PublicKey {
    return new EdPublicKey(this.#keyPair.publicKey);
  }

  /**
   * @returns Encoded private key
   */
  secretKey(): string {
    return b58Encode(this.#keyPair.secretKey, PrefixV2.Ed25519SecretKey);
  }

  bytes(): Uint8Array {
    return this.#keyPair.secretKey.subarray(0, 32);
  }

  static fromSeed(seed: Uint8Array): ExtendedEdKey {
    return new ExtendedEdKey(seed);
  }
}

const ed25519Key = "ed25519 seed";

export class ExtendedEdKey extends EdKey {
  public readonly chainCode: Uint8Array;

  constructor(seed: Uint8Array);
  constructor(privateKey: Uint8Array, chainCode: Uint8Array);
  constructor(privateKey: Uint8Array, chainCode?: Uint8Array) {
    const [priv, chain] = (() => {
      if (chainCode !== undefined) {
        return [privateKey, chainCode];
      } else {
        const seed = privateKey;

        if (seed.length < minSeedSize || seed.length > maxSeedSize) {
          throw new InvalidSeedLengthError(seed.length);
        }
        const key = new TextEncoder().encode(ed25519Key);
        const sum = new HMAC(SHA512, key).update(seed).digest();
        return [sum.subarray(0, 32), sum.subarray(32)];
      }
    })();
    super(priv);
    this.chainCode = chain;
  }

  derive(index: number): ExtendedEdKey {
    if ((index & Hard) === 0) {
      throw new InvalidDerivationIndexError(index);
    }
    const data = new Uint8Array(37);
    data.set(this.bytes(), 1);
    new DataView(data.buffer).setUint32(33, index);
    const sum = new HMAC(SHA512, this.chainCode).update(data).digest();
    return new ExtendedEdKey(sum.subarray(0, 32), sum.subarray(32));
  }
}

export class EdPublicKey implements PublicKey {
  #key: Uint8Array;

  constructor(src: string | Uint8Array) {
    if (typeof src === 'string') {
      const [key, _] = b58DecodeAndCheckPrefix(src, [PrefixV2.Ed25519PublicKey]);
      this.#key = key;
    } else {
      this.#key = src;
    }
  }

  compare(other: PublicKey): number {
    if (other instanceof EdPublicKey) {
      return compareArrays(this.bytes(), other.bytes());
    } else {
      throw new InvalidPublicKeyError('EdDSA key expected');
    }
  }

  hash(): string {
    return b58Encode(blake2b(this.#key, 20), PrefixV2.Ed25519PublicKeyHash);
  }

  bytes(): Uint8Array {
    return this.#key;
  }

  toProtocol(): Uint8Array {
    const res = new Uint8Array(this.#key.length + 1);
    res[0] = 0;
    res.set(this.#key, 1);
    return res;
  }

  toString(): string {
    return b58Encode(this.#key, PrefixV2.Ed25519PublicKey);
  }
}

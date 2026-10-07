import { ml_dsa44 } from '@noble/post-quantum/ml-dsa.js';
import { blake2b } from '@noble/hashes/blake2.js';
import { InvalidKeyError, RawSignResult } from '@taquito/core';
import {
  b58DecodeAndCheckPrefix,
  b58Encode,
  compareArrays,
  InvalidPublicKeyError,
  mergebuf,
  payloadLength,
  PrefixV2,
} from '@taquito/utils';
import { PublicKey, SigningKey } from './key-interface';

// Octez stores the 2560-byte ML-DSA-44 secret followed by its 1312-byte public key.
const SECRET_KEY_SIZE = 2560;

export class MLDSAKey implements SigningKey {
  #key: Uint8Array;

  constructor(key: string, decrypt?: (key: Uint8Array) => Uint8Array) {
    const [encoded, prefix] = b58DecodeAndCheckPrefix(key, [
      PrefixV2.MLDSA44SecretKey,
      PrefixV2.MLDSA44EncryptedSecretKey,
    ]);
    let data = encoded;
    if (prefix === PrefixV2.MLDSA44EncryptedSecretKey) {
      if (!decrypt) throw new Error('decryption function is not provided');
      data = decrypt(data);
    }
    if (data.length !== payloadLength[PrefixV2.MLDSA44SecretKey]) {
      throw new InvalidKeyError('Invalid ML-DSA-44 secret key length');
    }
    this.#key = Uint8Array.from(data);
  }

  sign(message: Uint8Array): RawSignResult {
    // Octez uses pure ML-DSA with an empty context over Blake2b-256(message),
    // not HashML-DSA. InMemorySigner has already prepended any watermark.
    const rawSignature = ml_dsa44.sign(
      blake2b(message, { dkLen: 32 }),
      this.#key.subarray(0, SECRET_KEY_SIZE)
    );
    const encoded = b58Encode(rawSignature, PrefixV2.MLDSA44Signature);
    return { rawSignature, sig: encoded, prefixSig: encoded };
  }

  publicKey(): PublicKey {
    return new MLDSAPublicKey(this.#key.subarray(SECRET_KEY_SIZE));
  }

  secretKey(): string {
    return b58Encode(this.#key, PrefixV2.MLDSA44SecretKey);
  }
}

export class MLDSAPublicKey implements PublicKey {
  #key: Uint8Array;

  constructor(src: string | Uint8Array) {
    const key =
      typeof src === 'string' ? b58DecodeAndCheckPrefix(src, [PrefixV2.MLDSA44PublicKey])[0] : src;
    if (key.length !== payloadLength[PrefixV2.MLDSA44PublicKey]) {
      throw new InvalidPublicKeyError('Invalid ML-DSA-44 public key length');
    }
    this.#key = Uint8Array.from(key);
  }

  compare(other: PublicKey): number {
    if (!(other instanceof MLDSAPublicKey)) {
      throw new InvalidPublicKeyError('ML-DSA-44 key expected');
    }
    return compareArrays(this.#key, other.#key);
  }

  hash(): string {
    return b58Encode(blake2b(this.#key, { dkLen: 20 }), PrefixV2.MLDSA44PublicKeyHash);
  }

  bytes(): Uint8Array {
    return this.#key.slice();
  }

  toProtocol(): Uint8Array {
    return mergebuf(new Uint8Array([4]), this.#key);
  }

  toString(): string {
    return b58Encode(this.#key, PrefixV2.MLDSA44PublicKey);
  }
}

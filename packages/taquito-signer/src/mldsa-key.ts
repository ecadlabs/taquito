import {
  b58DecodeAndCheckPrefix,
  PrefixV2,
  b58Encode,
  compareArrays,
  InvalidPublicKeyError,
} from '@taquito/utils';
import { ml_dsa44 } from '@noble/post-quantum/ml-dsa.js';
import { blake2b } from '@noble/hashes/blake2.js';
import { PublicKey, SigningKey } from './key-interface';
import { RawSignResult } from '@taquito/core';

/** FIPS 204 ML-DSA-44 signing (private) key size in bytes. */
const SIGNING_KEY_SIZE = 2560;
/** FIPS 204 ML-DSA-44 verification (public) key size in bytes. */
const PUBLIC_KEY_SIZE = 1312;

/**
 * Provide signing logic for ML-DSA-44 (FIPS 204) post-quantum keys (tz5).
 *
 * @remarks The Tezos secret key concatenates the signing key (2560 bytes) and
 * the verification key (1312 bytes) because the standard does not define a way
 * to recompute the verification key from the signing key alone.
 */
export class MLDsaKey implements SigningKey {
  #signingKey: Uint8Array;
  #publicKey: Uint8Array;

  /**
   * Signature prefix (tag 255 marker) used when an ML-DSA signature is appended
   * to operation bytes. `0xff 0x04` identifies the ML-DSA-44 scheme, mirroring
   * the BLS prefix `0xff 0x03`.
   * ref: https://octez.tezos.com/docs/shell/p2p_api.html#signature-prefix-tag-255
   */
  signaturePrefix = new Uint8Array([255, 4]);

  /**
   * @param key Encoded private key (mdsk or encrypted mdesk)
   * @param decrypt Decrypt function used when the key is encrypted
   * @throws InvalidKeyError
   */
  constructor(key: string, decrypt?: (k: Uint8Array) => Uint8Array) {
    const tmp = b58DecodeAndCheckPrefix(key, [
      PrefixV2.MLDSA44EncryptedSecretKey,
      PrefixV2.MLDSA44SecretKey,
    ]);
    let [keyData] = tmp;
    const [, prefix] = tmp;

    if (prefix === PrefixV2.MLDSA44EncryptedSecretKey) {
      if (decrypt !== undefined) {
        keyData = decrypt(keyData);
      } else {
        throw new Error('decryption function is not provided');
      }
    }

    this.#signingKey = keyData.slice(0, SIGNING_KEY_SIZE);
    this.#publicKey = keyData.slice(SIGNING_KEY_SIZE, SIGNING_KEY_SIZE + PUBLIC_KEY_SIZE);
  }

  /**
   * @param bytes Bytes to sign
   *
   * Octez-compatible by construction (verified against src/lib_ml_dsa/ml_dsa_44.ml
   * and src/lib_crypto/mldsa44.ml): the message is Blake2b-256 prehashed, then
   * signed with pure FIPS-204 ML-DSA and an empty context. octez signs via
   * libcrux `octez_libcrux_ml_dsa_44_sign(sk, msg, <empty ctx>, rnd)`, which is
   * the same pure variant as @noble's top-level `ml_dsa44.sign` (default empty
   * context). Signatures are randomized; both sides accept either side's output.
   */
  sign(bytes: Uint8Array): RawSignResult {
    const hash = blake2b(bytes, { dkLen: 32 });
    const signature = ml_dsa44.sign(hash, this.#signingKey);
    return {
      rawSignature: signature,
      sig: b58Encode(signature, PrefixV2.GenericSignature),
      prefixSig: b58Encode(signature, PrefixV2.MLDSA44Signature),
    };
  }

  publicKey(): PublicKey {
    return new MLDsaPublicKey(this.#publicKey);
  }

  secretKey(): string {
    const full = new Uint8Array(SIGNING_KEY_SIZE + PUBLIC_KEY_SIZE);
    full.set(this.#signingKey);
    full.set(this.#publicKey, SIGNING_KEY_SIZE);
    return b58Encode(full, PrefixV2.MLDSA44SecretKey);
  }
}

export class MLDsaPublicKey implements PublicKey {
  #key: Uint8Array;

  constructor(src: string | Uint8Array) {
    if (typeof src === 'string') {
      const [key] = b58DecodeAndCheckPrefix(src, [PrefixV2.MLDSA44PublicKey]);
      this.#key = key;
    } else {
      this.#key = src;
    }
  }

  compare(other: PublicKey): number {
    if (other instanceof MLDsaPublicKey) {
      return compareArrays(this.bytes(), other.bytes());
    } else {
      throw new InvalidPublicKeyError('ML-DSA key expected');
    }
  }

  hash(): string {
    return b58Encode(blake2b(this.#key, { dkLen: 20 }), PrefixV2.MLDSA44PublicKeyHash);
  }

  bytes(): Uint8Array {
    return this.#key;
  }

  toProtocol(): Uint8Array {
    const res = new Uint8Array(this.#key.length + 1);
    res[0] = 4;
    res.set(this.#key, 1);
    return res;
  }

  toString(): string {
    return b58Encode(this.#key, PrefixV2.MLDSA44PublicKey);
  }
}

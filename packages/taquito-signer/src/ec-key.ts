import { hash as blake2b } from '@stablelib/blake2b';
import {
  Prefix,
  b58EncodeWithPrefix,
  b58DecodeAndCheckPrefix,
} from '@taquito/utils';
import elliptic from 'elliptic';
import { SigningKey, SignResult } from './taquito-signer';

type Curve = 'p256' | 'secp256k1';

type CurvePrefix = {
  [curve in Curve]: {
    pk: Prefix;
    sk: Prefix;
    pkh: Prefix;
    sig: Prefix;
  }
}

const pref: CurvePrefix = {
  p256: {
    pk: Prefix.P256PublicKey,
    sk: Prefix.P256SecretKey,
    pkh: Prefix.P256PublicKeyHash,
    sig: Prefix.P256Signature,
  },
  secp256k1: {
    pk: Prefix.Secp256k1PublicKey,
    sk: Prefix.Secp256k1SecretKey,
    pkh: Prefix.Secp256k1PublicKeyHash,
    sig: Prefix.Secp256k1Signature,
  },
};

/**
 * @description Provide signing logic for elliptic curve based key (tz2, tz3)
 */
export class ECKey implements SigningKey {
  #key: Uint8Array;
  #publicKey: Uint8Array;
  #curve: Curve;

  /**
   *
   * @param key Encoded private key
   * @param decrypt Decrypt function
   * @throws {@link InvalidKeyError}
   */
  constructor(
    key: string,
    decrypt?: (k: Uint8Array) => Uint8Array
  ) {
    const tmp = b58DecodeAndCheckPrefix(key, [Prefix.Secp256k1EncryptedSecretKey, Prefix.P256EncryptedSecretKey, Prefix.Secp256k1SecretKey, Prefix.P256SecretKey]);
    [this.#key] = tmp;
    const [, prefix] = tmp;

    switch (prefix) {
      case Prefix.Secp256k1EncryptedSecretKey:
      case Prefix.P256EncryptedSecretKey:
        if (decrypt !== undefined) {
          this.#key = decrypt(this.#key);
        } else {
          throw new Error('decryption function is not provided');
        }
        if (prefix === Prefix.Secp256k1EncryptedSecretKey) {
          this.#curve = 'secp256k1';
        } else {
          this.#curve = 'p256';
        }
        break;
      case Prefix.Secp256k1SecretKey:
        this.#curve = 'secp256k1';
        break;
      default:
        this.#curve = 'p256';
        break;
    }

    const keyPair = new elliptic.ec(this.#curve).keyFromPrivate(this.#key);
    this.#publicKey = new Uint8Array(keyPair.getPublic(true, 'array')); // compress
  }

  /**
   *
   * @param bytes Bytes to sign
   * @param bytesHash Blake2b hash of the bytes to sign
   */
  sign(bytes: Uint8Array): Promise<SignResult> {
    const hash = blake2b(bytes, 32)
    const key = new elliptic.ec(this.#curve).keyFromPrivate(this.#key);
    const sig = key.sign(hash, { canonical: true });

    const signature = new Uint8Array(64);
    signature.set(sig.r.toArray())
    signature.set(sig.s.toArray(), 32)

    return Promise.resolve({
      signature: b58EncodeWithPrefix(signature, Prefix.GenericSignature),
      prefixedSignature: b58EncodeWithPrefix(signature, pref[this.#curve].sig),
    });
  }

  /**
   * @returns Encoded public key
   */
  publicKey(): Promise<string> {
    return Promise.resolve(b58EncodeWithPrefix(this.#publicKey, pref[this.#curve].pk));
  }

  /**
   * @returns Encoded public key hash
   */
  publicKeyHash(): Promise<string> {
    return Promise.resolve(b58EncodeWithPrefix(blake2b(new Uint8Array(this.#publicKey), 20), pref[this.#curve].pkh));
  }

  /**
   * @returns Encoded private key
   */
  secretKey(): Promise<string> {
    return Promise.resolve(b58EncodeWithPrefix(this.#key, pref[this.#curve].sk));
  }
}

/**
 * @description Tz3 key class using the p256 curve
 */
export const Tz3 = ECKey.bind(null, 'p256');

/**
 * @description Tz2 key class using the secp256k1 curve
 */
export const Tz2 = ECKey.bind(null, 'secp256k1');

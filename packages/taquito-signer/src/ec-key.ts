import { hash as blake2b } from '@stablelib/blake2b';
import { PrefixV2, b58DecodeAndCheckPrefix, b58Encode } from '@taquito/utils';
import elliptic from 'elliptic';
import { SigningKey } from './key-interface';
import { RawSignResult } from '@taquito/taquito';

type Curve = 'p256' | 'secp256k1';

type CurvePrefix = {
  [curve in Curve]: {
    pk: PrefixV2;
    sk: PrefixV2;
    pkh: PrefixV2;
    sig: PrefixV2;
  };
};

const pref: CurvePrefix = {
  p256: {
    pk: PrefixV2.P256PublicKey,
    sk: PrefixV2.P256SecretKey,
    pkh: PrefixV2.P256PublicKeyHash,
    sig: PrefixV2.P256Signature,
  },
  secp256k1: {
    pk: PrefixV2.Secp256k1PublicKey,
    sk: PrefixV2.Secp256k1SecretKey,
    pkh: PrefixV2.Secp256k1PublicKeyHash,
    sig: PrefixV2.Secp256k1Signature,
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
  constructor(key: string, decrypt?: (k: Uint8Array) => Uint8Array) {
    const tmp = b58DecodeAndCheckPrefix(key, [
      PrefixV2.Secp256k1EncryptedSecretKey,
      PrefixV2.P256EncryptedSecretKey,
      PrefixV2.Secp256k1SecretKey,
      PrefixV2.P256SecretKey,
    ]);
    [this.#key] = tmp;
    const [, prefix] = tmp;

    switch (prefix) {
      case PrefixV2.Secp256k1EncryptedSecretKey:
      case PrefixV2.P256EncryptedSecretKey:
        if (decrypt !== undefined) {
          this.#key = decrypt(this.#key);
        } else {
          throw new Error('decryption function is not provided');
        }
        if (prefix === PrefixV2.Secp256k1EncryptedSecretKey) {
          this.#curve = 'secp256k1';
        } else {
          this.#curve = 'p256';
        }
        break;
      case PrefixV2.Secp256k1SecretKey:
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
  sign(bytes: Uint8Array): Promise<RawSignResult> {
    const hash = blake2b(bytes, 32);
    const key = new elliptic.ec(this.#curve).keyFromPrivate(this.#key);
    const sig = key.sign(hash, { canonical: true });

    const signature = new Uint8Array(64);
    const r = sig.r.toArray();
    const s = sig.s.toArray();
    signature.set(r, 32 - r.length);
    signature.set(s, 64 - s.length);

    return Promise.resolve({
      rawSignature: signature,
      sig: b58Encode(signature, PrefixV2.GenericSignature),
      prefixSig: b58Encode(signature, pref[this.#curve].sig),
    });
  }

  /**
   * @returns Encoded public key
   */
  publicKey(): Promise<string> {
    return Promise.resolve(b58Encode(this.#publicKey, pref[this.#curve].pk));
  }

  /**
   * @returns Encoded public key hash
   */
  publicKeyHash(): Promise<string> {
    return Promise.resolve(
      b58Encode(blake2b(new Uint8Array(this.#publicKey), 20), pref[this.#curve].pkh)
    );
  }

  /**
   * @returns Encoded private key
   */
  secretKey(): Promise<string> {
    return Promise.resolve(b58Encode(this.#key, pref[this.#curve].sk));
  }
}

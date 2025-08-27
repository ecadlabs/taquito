import { hash as blake2b } from '@stablelib/blake2b';
import { generateKeyPairFromSeed, KeyPair, sign } from '@stablelib/ed25519';
import { InvalidPublicKeyError, PrefixV2, b58DecodeAndCheckPrefix, b58Encode, compareArrays } from '@taquito/utils';
import { SigningKey, SignResult, PublicKey } from './signer';

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
  constructor(key: string, decrypt?: (k: Uint8Array) => Uint8Array) {
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
        publicKey: keyData.slice(32),
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
  }

  /**
   *
   * @param bytes Bytes to sign
   * @param bytesHash Blake2b hash of the bytes to sign
   */
  sign(bytes: Uint8Array): SignResult {
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
}

export class EdPublicKey implements PublicKey {
  #key: Uint8Array

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
      throw new InvalidPublicKeyError("EdDSA key expected");
    }
  }

  hash(): string {
    return b58Encode(blake2b(this.#key, 20), PrefixV2.Ed25519PublicKeyHash)
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
    return b58Encode(this.#key, PrefixV2.Ed25519PublicKey)
  }
}
import { hash as blake2b } from '@stablelib/blake2b';
import { generateKeyPairFromSeed, sign } from '@stablelib/ed25519';
import {
  Prefix,
  b58DecodeAndCheckPrefix,
  b58Encode,
} from '@taquito/utils';
import { SigningKey, SignResult } from './signer';

/**
 * @description Provide signing logic for ed25519 curve based key (tz1)
 */
export class EdKey implements SigningKey {
  #seed: Uint8Array;
  #secretKey: Uint8Array;
  #publicKey: Uint8Array;

  /**
   *
   * @param key Encoded private key
   * @param encrypted Is the private key encrypted
   * @param decrypt Decrypt function
   * @throws {@link InvalidKeyError}
   */
  constructor(
    key: string,
    decrypt?: (k: Uint8Array) => Uint8Array
  ) {
    const tmp = b58DecodeAndCheckPrefix(key, [Prefix.Ed25519SecretKey, Prefix.Ed25519EncryptedSeed, Prefix.Ed25519Seed]);
    let [keyData] = tmp;
    const [, prefix] = tmp;

    if (prefix === Prefix.Ed25519SecretKey) {
      this.#seed = keyData.slice(32);
      this.#secretKey = keyData;
      this.#publicKey = keyData.slice(0, 32);
    } else {
      if (prefix === Prefix.Ed25519EncryptedSeed) {
        if (decrypt !== undefined) {
          keyData = decrypt(keyData)
        } else {
          throw new Error('decryption function is not provided')
        }
      }
      const { publicKey, secretKey } = generateKeyPairFromSeed(keyData);
      this.#seed = keyData;
      this.#publicKey = publicKey;
      this.#secretKey = secretKey;
    }
  }

  /**
   *
   * @param bytes Bytes to sign
   * @param bytesHash Blake2b hash of the bytes to sign
   */
  async sign(bytes: Uint8Array): Promise<SignResult> {
    const hash = blake2b(bytes, 32)
    const signature = sign(this.#secretKey, hash);

    return Promise.resolve({
      rawSignature: signature,
      signature: b58Encode(signature, Prefix.GenericSignature),
      prefixedSignature: b58Encode(signature, Prefix.Ed25519Signature),
    });
  }

  /**
   * @returns Encoded public key
   */
  publicKey(): Promise<string> {
    return Promise.resolve(b58Encode(this.#publicKey, Prefix.Ed25519PublicKey));
  }

  /**
   * @returns Encoded public key hash
   */
  publicKeyHash(): Promise<string> {
    return Promise.resolve(b58Encode(blake2b(new Uint8Array(this.#publicKey), 20), Prefix.Ed25519PublicKeyHash));
  }

  /**
   * @returns Encoded private key
   */
  secretKey(): Promise<string> {
    return Promise.resolve(b58Encode(this.#seed, Prefix.Ed25519Seed));
  }
}

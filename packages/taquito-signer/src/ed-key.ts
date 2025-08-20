import { hash as blake2b } from '@stablelib/blake2b';
import { generateKeyPairFromSeed, sign } from '@stablelib/ed25519';
import { PrefixV2, b58DecodeAndCheckPrefix, b58Encode } from '@taquito/utils';
import { SigningKey, SignResult } from './signer';

/**
 * @description Provide signing logic for ed25519 curve based key (tz1)
 */
export class EdKey implements SigningKey {
  #secretKey: Uint8Array;
  #publicKey: Uint8Array;

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
      this.#secretKey = keyData;
      this.#publicKey = keyData.slice(32);
    } else {
      if (prefix === PrefixV2.Ed25519EncryptedSeed) {
        if (decrypt !== undefined) {
          keyData = decrypt(keyData);
        } else {
          throw new Error('decryption function is not provided');
        }
      }
      const { publicKey, secretKey } = generateKeyPairFromSeed(keyData);
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
    const hash = blake2b(bytes, 32);
    const signature = sign(this.#secretKey, hash);

    return Promise.resolve({
      rawSignature: signature,
      sig: b58Encode(signature, PrefixV2.GenericSignature),
      prefixSig: b58Encode(signature, PrefixV2.Ed25519Signature),
    });
  }

  /**
   * @returns Encoded public key
   */
  publicKey(): Promise<string> {
    return Promise.resolve(b58Encode(this.#publicKey, PrefixV2.Ed25519PublicKey));
  }

  /**
   * @returns Encoded public key hash
   */
  publicKeyHash(): Promise<string> {
    return Promise.resolve(b58Encode(blake2b(this.#publicKey, 20), PrefixV2.Ed25519PublicKeyHash));
  }

  /**
   * @returns Encoded private key
   */
  secretKey(): Promise<string> {
    return Promise.resolve(b58Encode(this.#secretKey, PrefixV2.Ed25519SecretKey));
  }
}

import { b58DecodeAndCheckPrefix, b58EncodeWithPrefix, BLS12_381_DST, Prefix } from "@taquito/utils";
import { SigningKey, SignResult } from "./taquito-signer";
import { bls12_381 } from '@noble/curves/bls12-381';
import { hash } from "@stablelib/blake2b";

const bls = bls12_381.longSignatures; // AKA MinPK

export class BLSKey implements SigningKey {
  #key: Uint8Array;
  #publicKey: Uint8Array;

  constructor(key: string, decrypt?: (k: Uint8Array) => Uint8Array) {
    const tmp = b58DecodeAndCheckPrefix(key, [Prefix.BLS12_381EncryptedSecretKey, Prefix.BLS12_381SecretKey]);
    let [keyData] = tmp;
    const [, prefix] = tmp;

    if (prefix === Prefix.BLS12_381EncryptedSecretKey) {
      if (decrypt !== undefined) {
        keyData = decrypt(keyData)
      } else {
        throw new Error('decryption function is not provided')
      }
    }

    this.#key = keyData
    this.#publicKey = bls.getPublicKey(keyData).toBytes();
  }

  sign(message: Uint8Array): Promise<SignResult> {
    const point = bls.hash(message, BLS12_381_DST);
    const sig = bls.sign(point, this.#key).toBytes();

    return Promise.resolve({
      signature: b58EncodeWithPrefix(sig, Prefix.GenericSignature),
      prefixedSignature: b58EncodeWithPrefix(sig, Prefix.BLS12_381Signature),
    });
  }

  publicKey(): Promise<string> {
    const res = b58EncodeWithPrefix(this.#publicKey, Prefix.BLS12_381PublicKey);
    return Promise.resolve(res);
  }

  publicKeyHash(): Promise<string> {
    const res = b58EncodeWithPrefix(hash(this.#publicKey, 20), Prefix.BLS12_381PublicKeyHash);
    return Promise.resolve(res);
  }

  secretKey(): Promise<string> {
    const res = b58EncodeWithPrefix(this.#key, Prefix.BLS12_381SecretKey);
    return Promise.resolve(res);
  }
}
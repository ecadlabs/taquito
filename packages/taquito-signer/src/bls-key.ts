import { b58DecodeAndCheckPrefix, BLS12_381_DST, Prefix, b58Encode } from "@taquito/utils";
import { bls12_381 } from '@noble/curves/bls12-381';
import { hash } from "@stablelib/blake2b";
import { SigningKey, SignResult } from "./signer";

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
    this.#publicKey = bls.getPublicKey(this.sk()).toBytes();
  }

  private sk(): Uint8Array {
    return new Uint8Array(this.#key).reverse();
  }

  sign(message: Uint8Array): Promise<SignResult> {
    const point = bls.hash(message, BLS12_381_DST);
    const sig = bls.sign(point, this.sk()).toBytes();

    return Promise.resolve({
      rawSignature: sig,
      signature: b58Encode(sig, Prefix.GenericSignature),
      prefixedSignature: b58Encode(sig, Prefix.BLS12_381Signature),
    });
  }

  publicKey(): Promise<string> {
    const res = b58Encode(this.#publicKey, Prefix.BLS12_381PublicKey);
    return Promise.resolve(res);
  }

  publicKeyHash(): Promise<string> {
    const res = b58Encode(hash(this.#publicKey, 20), Prefix.BLS12_381PublicKeyHash);
    return Promise.resolve(res);
  }

  secretKey(): Promise<string> {
    const res = b58Encode(this.#key, Prefix.BLS12_381SecretKey);
    return Promise.resolve(res);
  }
}
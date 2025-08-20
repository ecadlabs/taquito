import {
  b58DecodeAndCheckPrefix,
  BLS12_381_DST,
  POP_DST,
  PrefixV2,
  b58Encode,
} from '@taquito/utils';
import { bls12_381 } from '@noble/curves/bls12-381';
import { hash } from '@stablelib/blake2b';
import { SigningKeyWithProofOfPossession, SignResult } from './signer';

const bls = bls12_381.longSignatures; // AKA MinPK

export class BLSKey implements SigningKeyWithProofOfPossession {
  #key: Uint8Array;
  #publicKey: Uint8Array;

  constructor(key: string, decrypt?: (k: Uint8Array) => Uint8Array) {
    const tmp = b58DecodeAndCheckPrefix(key, [
      PrefixV2.BLS12_381EncryptedSecretKey,
      PrefixV2.BLS12_381SecretKey,
    ]);
    let [keyData] = tmp;
    const [, prefix] = tmp;

    if (prefix === PrefixV2.BLS12_381EncryptedSecretKey) {
      if (decrypt !== undefined) {
        keyData = decrypt(keyData);
      } else {
        throw new Error('decryption function is not provided');
      }
    }

    this.#key = keyData;
    this.#publicKey = bls.getPublicKey(this.sk()).toBytes();
  }

  private sk(): Uint8Array {
    return new Uint8Array(this.#key).reverse();
  }

  private signDst(message: Uint8Array, dst: string): Promise<SignResult> {
    const point = bls.hash(message, dst);
    const sig = bls.sign(point, this.sk()).toBytes();
    return Promise.resolve({
      rawSignature: sig,
      sig: b58Encode(sig, PrefixV2.GenericSignature),
      prefixSig: b58Encode(sig, PrefixV2.BLS12_381Signature),
    });
  }

  sign(message: Uint8Array): Promise<SignResult> {
    return this.signDst(message, BLS12_381_DST);
  }

  provePossession(): Promise<SignResult> {
    return this.signDst(this.#publicKey, POP_DST);
  }

  publicKey(): Promise<string> {
    const res = b58Encode(this.#publicKey, PrefixV2.BLS12_381PublicKey);
    return Promise.resolve(res);
  }

  publicKeyHash(): Promise<string> {
    const res = b58Encode(hash(this.#publicKey, 20), PrefixV2.BLS12_381PublicKeyHash);
    return Promise.resolve(res);
  }

  secretKey(): Promise<string> {
    const res = b58Encode(this.#key, PrefixV2.BLS12_381SecretKey);
    return Promise.resolve(res);
  }
}

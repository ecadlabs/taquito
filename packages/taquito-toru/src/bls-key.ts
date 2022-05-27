import { hash } from '@stablelib/blake2b';
import {
  b58cencode,
  b58cdecode,
  prefix,
  buf2hex,
  InvalidKeyError,
  hex2buf,
  validatePrivateKey,
  ValidationResult,
  Prefix,
} from '@taquito/utils';
import toBuffer from 'typedarray-to-buffer';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bls = require('@noble/bls12-381');

/**
 * @description Provide signing logic for bls curve based key (tz4)
 */
export class Tz4 {
  private _key: Uint8Array;
  private _publicKey: Uint8Array;

  /**
   *
   * @param key Encoded private key
   */
  constructor(private key: string) {
    const keyPrefix = key.substr(0, 4);
    if (keyPrefix !== Prefix.BLSK) {
      throw new InvalidKeyError(key, 'Key contains invalid prefix');
    }
    const isValid = validatePrivateKey(key);
    if (isValid !== ValidationResult.VALID) {
      throw new InvalidKeyError(key, ValidationResult[isValid]);
    }

    this._key = b58cdecode(this.key, prefix[keyPrefix]).reverse();

    if (!this._key) {
      throw new InvalidKeyError(key, 'Unable to decode');
    }

    this._publicKey = bls.getPublicKey(this._key);
  }

  /**
   *
   * @param bytes Bytes to sign
   */
  async sign(bytes: string) {
    const bb = hex2buf(bytes);
    const bytesHash = hash(bb, 32);
    const signature = await bls.sign(bytesHash, this._key);
    const signatureBuffer = toBuffer(signature);
    const sbytes = bytes + buf2hex(signatureBuffer);

    return {
      bytes,
      prefixSig: b58cencode(signature, prefix.BLsig),
      sbytes,
    };
  }

  /**
   * @returns Encoded public key
   */
  async publicKey(): Promise<string> {
    return b58cencode(this._publicKey, prefix['BLpk']);
  }

  /**
   * @returns Encoded public key hash
   */
  async publicKeyHash(): Promise<string> {
    return b58cencode(hash(new Uint8Array(this._publicKey), 20), prefix.tz4);
  }

  /**
   * @returns Encoded private key
   */
  async secretKey(): Promise<string> {
    return b58cencode(this._key.reverse(), prefix[`BLsk`]);
  }
}

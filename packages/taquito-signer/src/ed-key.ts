import { hash } from '@stablelib/blake2b';
import { generateKeyPairFromSeed, sign } from '@stablelib/ed25519';
import {
  b58cencode,
  b58cdecode,
  prefix,
  buf2hex,
  isValidPrefix,
  Prefix,
  invalidDetail,
  ValidationResult,
} from '@taquito/utils';
import toBuffer from 'typedarray-to-buffer';
import { InvalidKeyError } from '@taquito/core';

/**
 * @description Provide signing logic for ed25519 curve based key (tz1)
 */
export class Tz1 {
  private _key: Uint8Array;
  private _publicKey: Uint8Array;
  private isInit: Promise<boolean>;

  /**
   *
   * @param key Encoded private key
   * @param encrypted Is the private key encrypted
   * @param decrypt Decrypt function
   * @throws {@link InvalidKeyError}
   */
  constructor(private key: string, encrypted: boolean, decrypt: (k: any) => any) {
    const keyPrefix = key.substring(0, encrypted ? 5 : 4);
    if (!isValidPrefix(keyPrefix)) {
      throw new InvalidKeyError(
        `${invalidDetail(ValidationResult.NO_PREFIX_MATCHED)} expecting either '${
          Prefix.EDESK
        }' or '${Prefix.EDSK}'.`
      );
    }

    this._key = decrypt(b58cdecode(this.key, prefix[keyPrefix]));
    this._publicKey = this._key.slice(32);

    if (!this._key) {
      throw new InvalidKeyError('unable to decode');
    }

    this.isInit = this.init();
  }

  private async init() {
    if (this._key.length !== 64) {
      const { publicKey, secretKey } = generateKeyPairFromSeed(new Uint8Array(this._key));
      this._publicKey = publicKey;
      this._key = secretKey;
    }
    return true;
  }

  /**
   *
   * @param bytes Bytes to sign
   * @param bytesHash Blake2b hash of the bytes to sign
   */
  async sign(bytes: string, bytesHash: Uint8Array) {
    await this.isInit;
    const signature = sign(new Uint8Array(this._key), new Uint8Array(bytesHash));
    const signatureBuffer = toBuffer(signature);
    const sbytes = bytes + buf2hex(signatureBuffer);

    return {
      bytes,
      sig: b58cencode(signature, prefix.sig),
      prefixSig: b58cencode(signature, prefix.edsig),
      sbytes,
    };
  }

  /**
   * @returns Encoded public key
   */
  async publicKey(): Promise<string> {
    await this.isInit;
    return b58cencode(this._publicKey, prefix['edpk']);
  }

  /**
   * @returns Encoded public key hash
   */
  async publicKeyHash(): Promise<string> {
    await this.isInit;
    return b58cencode(hash(new Uint8Array(this._publicKey), 20), prefix.tz1);
  }

  /**
   * @returns Encoded private key
   */
  async secretKey(): Promise<string> {
    await this.isInit;
    let key = this._key;
    const { secretKey } = generateKeyPairFromSeed(new Uint8Array(key).slice(0, 32));
    key = toBuffer(secretKey);

    return b58cencode(key, prefix[`edsk`]);
  }
}

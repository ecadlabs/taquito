import sodium from 'libsodium-wrappers';
import { b58cencode, b58cdecode, prefix, buf2hex, isValidPrefix } from '@taquito/utils';
import toBuffer from 'typedarray-to-buffer';

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
   */
  constructor(private key: string, encrypted: boolean, decrypt: (k: any) => any) {
    const keyPrefix = key.substr(0, encrypted ? 5 : 4);
    if (!isValidPrefix(keyPrefix)) {
      throw new Error('key contains invalid prefix');
    }

    this._key = decrypt(b58cdecode(this.key, prefix[keyPrefix]));
    this._publicKey = this._key.slice(32);

    if (!this._key) {
      throw new Error('Unable to decode key');
    }

    this.isInit = this.init();
  }

  private async init() {
    await sodium.ready;
    if (this._key.length !== 64) {
      const { publicKey, privateKey } = sodium.crypto_sign_seed_keypair(
        new Uint8Array(this._key),
        'uint8array'
      );
      this._publicKey = publicKey;
      this._key = privateKey;
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
    const signature = sodium.crypto_sign_detached(
      new Uint8Array(bytesHash),
      new Uint8Array(this._key)
    );
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
    await sodium.ready;
    return b58cencode(sodium.crypto_generichash(20, new Uint8Array(this._publicKey)), prefix.tz1);
  }

  /**
   * @returns Encoded private key
   */
  async secretKey(): Promise<string> {
    await this.isInit;
    await sodium.ready;
    let key = this._key;
    const { privateKey } = sodium.crypto_sign_seed_keypair(
      new Uint8Array(key).slice(0, 32),
      'uint8array'
    );
    key = toBuffer(privateKey);

    return b58cencode(key, prefix[`edsk`]);
  }
}

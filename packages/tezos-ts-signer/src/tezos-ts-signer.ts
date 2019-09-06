import sodium from 'libsodium-wrappers';
import { hex2buf, mergebuf } from '@tezos-ts/utils';
import toBuffer from 'typedarray-to-buffer';
import { Tz1 } from './ed-key';
import { Tz2, ECKey, Tz3 } from './ec-key';
import pbkdf2 from 'pbkdf2';

/**
 * @description A local implementation of the signer. Will represent a Tezos account and be able to produce signature in its behalf
 *
 * @warn If running in production and dealing with tokens that have real value, it is strongly recommended to use a HSM backed signer so that private key material is not stored in memory or on disk
 */
export class InMemorySigner {
  private _key!: Tz1 | ECKey;

  /**
   *
   * @param key Encoded private key
   * @param passphrase Passphrase to decrypt the private key if it is encrypted
   */
  constructor(key: string, passphrase?: string) {
    const encrypted = key.substring(2, 3) === 'e';

    let decrypt = (k: any) => k;

    if (encrypted) {
      if (!passphrase) {
        throw new Error('Encrypted key provided without a passphrase.');
      }

      decrypt = constructedKey => {
        const salt = toBuffer(constructedKey.slice(0, 8));
        const encryptedSk = constructedKey.slice(8);
        const encryptionKey = pbkdf2.pbkdf2Sync(passphrase, salt, 32768, 32, 'sha512');

        return sodium.crypto_secretbox_open_easy(
          new Uint8Array(encryptedSk),
          new Uint8Array(24),
          new Uint8Array(encryptionKey)
        );
      };
    }

    switch (key.substr(0, 4)) {
      case 'edes':
      case 'edsk':
        this._key = new Tz1(key, encrypted, decrypt);
        break;
      case 'spsk':
      case 'spes':
        this._key = new Tz2(key, encrypted, decrypt);
        break;
      case 'p2sk':
      case 'p2es':
        this._key = new Tz3(key, encrypted, decrypt);
        break;
    }
  }

  /**
   *
   * @param bytes Bytes to sign
   * @param watermark Watermark to append to the bytes
   */
  async sign(bytes: string, watermark?: Uint8Array) {
    let bb = hex2buf(bytes);
    if (typeof watermark !== 'undefined') {
      bb = mergebuf(watermark, bb);
    }

    const bytesHash = toBuffer(sodium.crypto_generichash(32, bb));
    console.log(bb, bytesHash);

    return this._key.sign(bytes, bytesHash);
  }

  /**
   * @returns Encoded public key
   */
  async publicKey(): Promise<string> {
    return this._key.publicKey();
  }

  /**
   * @returns Encoded public key hash
   */
  async publicKeyHash(): Promise<string> {
    return this._key.publicKeyHash();
  }

  /**
   * @returns Encoded private key
   */
  async secretKey(): Promise<string> {
    return this._key.secretKey();
  }
}

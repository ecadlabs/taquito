/**
 * @packageDocumentation
 * @module @taquito/signer
 */
import { openSecretBox } from '@stablelib/nacl';
import { hash } from '@stablelib/blake2b';
import {
  hex2buf,
  mergebuf,
  b58cencode,
  prefix,
  Prefix,
  invalidDetail,
  ValidationResult,
} from '@taquito/utils';
import toBuffer from 'typedarray-to-buffer';
import { Tz1 } from './ed-key';
import { Tz2, ECKey, Tz3 } from './ec-key';
import pbkdf2 from 'pbkdf2';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { Curves, generateSecretKey } from './helpers';
import { InvalidMnemonicError, InvalidPassphraseError } from './errors';
import { InvalidKeyError } from '@taquito/core';

export * from './import-key';
export { VERSION } from './version';
export * from './derivation-tools';
export * from './helpers';
export { InvalidPassphraseError } from './errors';

export interface FromMnemonicParams {
  mnemonic: string;
  password?: string;
  derivationPath?: string;
  curve?: Curves;
}

/**
 * @description A local implementation of the signer. Will represent a Tezos account and be able to produce signature in its behalf
 *
 * @warn If running in production and dealing with tokens that have real value, it is strongly recommended to use a HSM backed signer so that private key material is not stored in memory or on disk
 * @throws {@link InvalidMnemonicError}
 */
export class InMemorySigner {
  private _key!: Tz1 | ECKey;

  static fromFundraiser(email: string, password: string, mnemonic: string) {
    if (!bip39.validateMnemonic(mnemonic, wordlist)) {
      throw new InvalidMnemonicError(mnemonic);
    }
    const seed = bip39.mnemonicToSeedSync(mnemonic, `${email}${password}`);
    const key = b58cencode(seed.slice(0, 32), prefix.edsk2);
    return new InMemorySigner(key);
  }

  static async fromSecretKey(key: string, passphrase?: string) {
    return new InMemorySigner(key, passphrase);
  }

  /**
   *
   * @description Instantiation of an InMemorySigner instance from a mnemonic
   * @param mnemonic 12-24 word mnemonic
   * @param password password used to encrypt the mnemonic to seed value
   * @param derivationPath default 44'/1729'/0'/0' (44'/1729' mandatory)
   * @param curve currently only supported for tz1, tz2, tz3 addresses. soon bip25519
   * @returns InMemorySigner
   * @throws {@link InvalidMnemonicError}
   */
  static fromMnemonic({
    mnemonic,
    password = '',
    derivationPath = "44'/1729'/0'/0'",
    curve = 'ed25519',
  }: FromMnemonicParams) {
    // check if curve is defined if not default tz1
    if (!bip39.validateMnemonic(mnemonic, wordlist)) {
      // avoiding exposing mnemonic again in case of mistake making invalid
      throw new InvalidMnemonicError(mnemonic);
    }
    const seed = bip39.mnemonicToSeedSync(mnemonic, password);

    const sk = generateSecretKey(seed, derivationPath, curve);

    return new InMemorySigner(sk);
  }
  /**
   *
   * @param key Encoded private key
   * @param passphrase Passphrase to decrypt the private key if it is encrypted
   * @throws {@link InvalidKeyError}
   *
   */
  constructor(key: string, passphrase?: string) {
    const encrypted = key.substring(2, 3) === 'e';

    let decrypt = (k: any) => k;

    if (encrypted) {
      if (!passphrase) {
        throw new InvalidPassphraseError('No passphrase provided to decrypt encrypted key');
      }

      decrypt = (constructedKey: Uint8Array) => {
        const salt = toBuffer(constructedKey.slice(0, 8));
        const encryptedSk = constructedKey.slice(8);
        const encryptionKey = pbkdf2.pbkdf2Sync(passphrase, salt, 32768, 32, 'sha512');

        return openSecretBox(
          new Uint8Array(encryptionKey),
          new Uint8Array(24),
          new Uint8Array(encryptedSk)
        );
      };
    }

    switch (key.substring(0, 4)) {
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
      default:
        throw new InvalidKeyError(
          `${invalidDetail(ValidationResult.NO_PREFIX_MATCHED)} expecting one of the following '${
            Prefix.EDESK
          }', '${Prefix.EDSK}', '${Prefix.SPSK}', '${Prefix.SPESK}', '${Prefix.P2SK}' or '${
            Prefix.P2ESK
          }'.`
        );
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

    const bytesHash = hash(bb, 32);

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

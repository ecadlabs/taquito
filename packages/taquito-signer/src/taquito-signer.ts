/**
 * @packageDocumentation
 * @module @taquito/signer
 */
import { openSecretBox } from '@stablelib/nacl';
import { hash } from '@stablelib/blake2b';
import { hex2buf, mergebuf, b58cencode, prefix, InvalidKeyError } from '@taquito/utils';
import toBuffer from 'typedarray-to-buffer';
import { Tz1 } from './ed-key';
import { Tz2, ECKey, Tz3 } from './ec-key';
import pbkdf2 from 'pbkdf2';
import { mnemonicToSeedSync } from './mnemonicToSeedSync';
import * as Bip39 from 'bip39'
import { generateSecretKeyEDSK } from './helpers';
import { InvalidCurveError, InvalidMnemonicError, ToBeImplemented } from './errors';

export * from './import-key';
export { VERSION } from './version';

/**
 *  @category Error
 *  @description Error that indicates an invalid passphrase being passed or used
 */
export class InvalidPassphraseError extends Error {
  public name = 'InvalidPassphraseError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 * @description A local implementation of the signer. Will represent a Tezos account and be able to produce signature in its behalf
 *
 * @warn If running in production and dealing with tokens that have real value, it is strongly recommended to use a HSM backed signer so that private key material is not stored in memory or on disk
 *
 */
export class InMemorySigner {
  private _key!: Tz1 | ECKey;

  static fromFundraiser(email: string, password: string, mnemonic: string) {
    const seed = mnemonicToSeedSync(mnemonic, `${email}${password}`);
    const key = b58cencode(seed.slice(0, 32), prefix.edsk2);
    return new InMemorySigner(key);
  }

  static async fromSecretKey(key: string, passphrase?: string) {
    return new InMemorySigner(key, passphrase);
  }

  /**
   *
   * @description Instatiation of a InMemorySigner instance from a mnemonic
   * @param mnemonic 12-24 word mnemonic
   * @param password password used to encrypt the mnemonic to seed value
   * @param derivationPath
   * @param curve currently only supported for tz1 addresses ed25519. soon secp256k1, p256, bip25519
   * @returns InMemorySigner
   */
  static fromMnemonic(mnemonic: string, password?: string, derivationPath = "44'/'1729'/0'/0'", curve = 'ed25519') {
    if (!Bip39.validateMnemonic(mnemonic)) {
      // avoiding exposing mnemonic again in case of mistake making invalid
      throw new InvalidMnemonicError('Mnemonic provided is invalid')
    }
    const seed = Bip39.mnemonicToSeedSync(mnemonic, password)

    switch (curve) {
      case 'ed25519': {
        const sk = generateSecretKeyEDSK(seed, derivationPath)
        return new InMemorySigner(sk)
      }
      case 'secp256k1': {
        // TODO
        throw new ToBeImplemented()
      }
      case 'p256': {
        // TODO
        throw new ToBeImplemented()
      }
    default:
      throw new InvalidCurveError(curve)
    }
  }
  /**
   *
   * @param key Encoded private key
   * @param passphrase Passphrase to decrypt the private key if it is encrypted
   *
   */
  constructor(key: string, passphrase?: string) {
    const encrypted = key.substring(2, 3) === 'e';

    let decrypt = (k: any) => k;

    if (encrypted) {
      if (!passphrase) {
        throw new InvalidPassphraseError('Encrypted key provided without a passphrase.');
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
      default:
        throw new InvalidKeyError(key, 'Unsupported key type');
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

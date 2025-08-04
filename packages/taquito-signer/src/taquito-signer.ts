/**
 * @packageDocumentation
 * @module @taquito/signer
 */
import { openSecretBox } from '@stablelib/nacl';
import {
  hex2buf,
  mergebuf,
  Prefix,
  buf2hex,
  b58DecodeAndCheckPrefix,
  b58Encode,
} from '@taquito/utils';
import toBuffer from 'typedarray-to-buffer';
import { EdKey } from './ed-key';
import { ECKey } from './ec-key';
import pbkdf2 from 'pbkdf2';
import * as Bip39 from 'bip39';
import { Curves, generateSecretKey } from './helpers';
import { InvalidMnemonicError, InvalidPassphraseError } from './errors';
import { InvalidKeyError } from '@taquito/core';
import { SigningKey, SignResult as RawSignResult, isPOP } from './signer';
import { BLSKey } from './bls-key';

export * from './import-key';
export { VERSION } from './version';
export * from './derivation-tools';
export * from './helpers';
export { InvalidPassphraseError } from './errors';
export { SignResult as RawSignResult } from './signer';

export interface FromMnemonicParams {
  mnemonic: string;
  password?: string;
  derivationPath?: string;
  curve?: Curves;
}

export interface SignResult {
  bytes: string;
  sig: string;
  prefixSig: string;
  sbytes: string;
}

type KeyPrefix = Prefix.Ed25519EncryptedSeed |
  Prefix.Ed25519Seed |
  Prefix.Ed25519SecretKey |
  Prefix.Secp256k1EncryptedSecretKey |
  Prefix.Secp256k1SecretKey |
  Prefix.P256EncryptedSecretKey |
  Prefix.P256SecretKey |
  Prefix.BLS12_381EncryptedSecretKey |
  Prefix.BLS12_381SecretKey;

/**
 * @description A local implementation of the signer. Will represent a Tezos account and be able to produce signature in its behalf
 *
 * @warn If running in production and dealing with tokens that have real value, it is strongly recommended to use a HSM backed signer so that private key material is not stored in memory or on disk
 * @throws {@link InvalidMnemonicError}
 */
export class InMemorySigner {
  #key!: SigningKey;

  static fromFundraiser(email: string, password: string, mnemonic: string) {
    if (!Bip39.validateMnemonic(mnemonic)) {
      throw new InvalidMnemonicError(mnemonic);
    }
    const seed = Bip39.mnemonicToSeedSync(mnemonic, `${email}${password}`);
    const key = b58Encode(seed.subarray(0, 32), Prefix.Ed25519Seed);
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
    if (!Bip39.validateMnemonic(mnemonic)) {
      // avoiding exposing mnemonic again in case of mistake making invalid
      throw new InvalidMnemonicError(mnemonic);
    }
    const seed = Bip39.mnemonicToSeedSync(mnemonic, password);

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
    const keyPrefixes: KeyPrefix[] = [
      Prefix.Ed25519EncryptedSeed,
      Prefix.Ed25519Seed,
      Prefix.Ed25519SecretKey,
      Prefix.Secp256k1EncryptedSecretKey,
      Prefix.Secp256k1SecretKey,
      Prefix.P256EncryptedSecretKey,
      Prefix.P256SecretKey,
      Prefix.BLS12_381EncryptedSecretKey,
      Prefix.BLS12_381SecretKey,
    ];
    const pre = (() => {
      try {
        const [, pre] = b58DecodeAndCheckPrefix(key, keyPrefixes);
        return pre;
      } catch {
        throw new InvalidKeyError(`Invalid private key, expecting one of the following prefixes '${keyPrefixes}'.`
        );
      }
    })();

    const encrypted = pre === Prefix.Ed25519EncryptedSeed ||
      pre === Prefix.Secp256k1EncryptedSecretKey ||
      pre === Prefix.P256EncryptedSecretKey ||
      pre === Prefix.BLS12_381EncryptedSecretKey;

    let decrypt: ((k: Uint8Array) => Uint8Array) | undefined;
    if (encrypted) {
      if (!passphrase) {
        throw new InvalidPassphraseError('No passphrase provided to decrypt encrypted key');
      }
      decrypt = (data: Uint8Array) => {
        const salt = toBuffer(data.slice(0, 8));
        const encryptedSk = data.slice(8);
        const encryptionKey = pbkdf2.pbkdf2Sync(passphrase, salt, 32768, 32, 'sha512');

        const res = openSecretBox(
          new Uint8Array(encryptionKey),
          new Uint8Array(24),
          new Uint8Array(encryptedSk)
        );
        if (!res) {
          throw new Error('can\'t decrypt secret key');
        }
        return res;
      };
    }

    switch (pre) {
      case Prefix.Ed25519EncryptedSeed:
      case Prefix.Ed25519Seed:
      case Prefix.Ed25519SecretKey:
        this.#key = new EdKey(key, decrypt);
        break;

      case Prefix.Secp256k1EncryptedSecretKey:
      case Prefix.Secp256k1SecretKey:
      case Prefix.P256EncryptedSecretKey:
      case Prefix.P256SecretKey:
        this.#key = new ECKey(key, decrypt);
        break;

      case Prefix.BLS12_381EncryptedSecretKey:
      case Prefix.BLS12_381SecretKey:
        this.#key = new BLSKey(key, decrypt);
        break;
    }
  }

  /**
   *
   * @param bytes Bytes to sign
   * @param watermark Watermark to append to the bytes
   */
  async sign(message: string | Uint8Array, watermark?: Uint8Array): Promise<SignResult> {
    const msg = (typeof message == 'string') ? hex2buf(message) : message;
    const watermarkMsg = watermark !== undefined ? mergebuf(watermark, msg) : msg;
    const { rawSignature, sig: signature, prefixSig: prefixedSignature } = await this.#key.sign(watermarkMsg);
    return {
      bytes: buf2hex(msg),
      sig: signature,
      prefixSig: prefixedSignature,
      sbytes: buf2hex(mergebuf(msg, rawSignature)),
    }
  }

  async provePossession(): Promise<RawSignResult | null> {
    if (isPOP(this.#key)) {
      return this.#key.provePossession();
    } else {
      return null;
    }
  }

  get canProvePossession(): boolean {
    return isPOP(this.#key)
  }

  /**
   * @returns Encoded public key
   */
  publicKey(): Promise<string> {
    return this.#key.publicKey();
  }

  /**
   * @returns Encoded public key hash
   */
  publicKeyHash(): Promise<string> {
    return this.#key.publicKeyHash();
  }

  /**
   * @returns Encoded private key
   */
  secretKey(): Promise<string> {
    return this.#key.secretKey();
  }
}

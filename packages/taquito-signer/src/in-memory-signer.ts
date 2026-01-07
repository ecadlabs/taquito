import { openSecretBox } from '@stablelib/nacl';
import {
  hex2buf,
  mergebuf,
  PrefixV2,
  buf2hex,
  b58DecodeAndCheckPrefix,
} from '@taquito/utils';
import { deriveKey as pbkdf2 } from '@stablelib/pbkdf2';
import { EdKey, EdPublicKey } from './ed-key';
import { ECKey, ECPublicKey, P256Key, Secp256k1Key } from './ec-key';
import { BLSKey, BLSPublicKey } from './bls-key';
import * as Bip39 from 'bip39';
import { InvalidCurveError, InvalidMnemonicError, InvalidPassphraseError, ToBeImplemented } from './errors';
import {
  InvalidKeyError,
  ProhibitedActionError,
  SignResult,
  RawSignResult,
  Signer,
} from '@taquito/core';
import { SigningKey, isPOP, PublicKey } from './key-interface';
import { Curve, deriveSigningKeyFromMnemonic, deriveSigningKeyFromSeed, FromMnemonicParams as FromMnemonicParamsBase, Path } from './derivation-utils';
import { SHA512 } from '@stablelib/sha512';

export interface FromMnemonicParams extends FromMnemonicParamsBase {
  curve?: Curve;
}

type KeyPrefix =
  | PrefixV2.Ed25519EncryptedSeed
  | PrefixV2.Ed25519Seed
  | PrefixV2.Ed25519SecretKey
  | PrefixV2.Secp256k1EncryptedSecretKey
  | PrefixV2.Secp256k1SecretKey
  | PrefixV2.P256EncryptedSecretKey
  | PrefixV2.P256SecretKey
  | PrefixV2.BLS12_381EncryptedSecretKey
  | PrefixV2.BLS12_381SecretKey;

/**
 * @description A local implementation of the signer. Will represent a Tezos account and be able to produce signature in its behalf
 *
 * @warn If running in production and dealing with tokens that have real value, it is strongly recommended to use a HSM backed signer so that private key material is not stored in memory or on disk
 * @throws {@link InvalidMnemonicError}
 */
export class InMemorySigner implements Signer {
  #key!: SigningKey;

  static fromFundraiser(email: string, password: string, mnemonic: string) {
    if (!Bip39.validateMnemonic(mnemonic)) {
      throw new InvalidMnemonicError(mnemonic);
    }
    const seed = Bip39.mnemonicToSeedSync(mnemonic, `${email}${password}`);
    const key = new EdKey(seed.subarray(0, 32));
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
  static fromMnemonic(params: FromMnemonicParams): InMemorySigner {
    let sk: SigningKey;
    const curve = params.curve || 'ed25519';
    switch (curve) {
      case 'p256':
        sk = deriveSigningKeyFromMnemonic(P256Key, params);
        break;
      case 'secp256k1':
        sk = deriveSigningKeyFromMnemonic(Secp256k1Key, params);
        break;
      case 'ed25519':
        sk = deriveSigningKeyFromMnemonic(EdKey, params);
        break;
      case 'bls12-381':
        sk = deriveSigningKeyFromMnemonic(BLSKey, params);
        break;
      case 'bip25519':
        throw new ToBeImplemented();
      default:
        throw new InvalidCurveError(
          `Unsupported curve "${curve}" expecting one of the following "ed25519", "secp256k1", "p256", "bls12-381"`
        );
    }
    return new InMemorySigner(sk);
  }

  static fromSeed(seed: Uint8Array | string, path: Path | string, curve: Curve = 'ed25519'): InMemorySigner {
    const s = typeof seed === 'string' ? hex2buf(seed) : seed;
    let sk: SigningKey;
    switch (curve) {
      case 'p256':
        sk = deriveSigningKeyFromSeed(P256Key, s, path);
        break;
      case 'secp256k1':
        sk = deriveSigningKeyFromSeed(Secp256k1Key, s, path);
        break;
      case 'ed25519':
        sk = deriveSigningKeyFromSeed(EdKey, s, path);
        break;
      case 'bls12-381':
        sk = deriveSigningKeyFromSeed(BLSKey, s, path);
        break;
      case 'bip25519':
        throw new ToBeImplemented();
      default:
        throw new InvalidCurveError(
          `Unsupported curve "${curve}" expecting one of the following "ed25519", "secp256k1", "p256", "bls12-381"`
        );
    }
    return new InMemorySigner(sk);
  }
  /**
   *
   * @param key Encoded private key
   * @param passphrase Passphrase to decrypt the private key if it is encrypted
   * @throws {@link InvalidKeyError}
   *
   */
  constructor(key: SigningKey);
  constructor(key: string, passphrase?: string | Uint8Array);
  constructor(key: string | SigningKey, passphrase?: string | Uint8Array) {
    if (typeof key === 'string') {
      const keyPrefixes: KeyPrefix[] = [
        PrefixV2.Ed25519EncryptedSeed,
        PrefixV2.Ed25519Seed,
        PrefixV2.Ed25519SecretKey,
        PrefixV2.Secp256k1EncryptedSecretKey,
        PrefixV2.Secp256k1SecretKey,
        PrefixV2.P256EncryptedSecretKey,
        PrefixV2.P256SecretKey,
        PrefixV2.BLS12_381EncryptedSecretKey,
        PrefixV2.BLS12_381SecretKey,
      ];
      const pre = (() => {
        try {
          const [, pre] = b58DecodeAndCheckPrefix(key, keyPrefixes);
          return pre;
        } catch {
          throw new InvalidKeyError(
            `Invalid private key, expecting one of the following prefixes '${keyPrefixes}'.`
          );
        }
      })();

      const encrypted =
        pre === PrefixV2.Ed25519EncryptedSeed ||
        pre === PrefixV2.Secp256k1EncryptedSecretKey ||
        pre === PrefixV2.P256EncryptedSecretKey ||
        pre === PrefixV2.BLS12_381EncryptedSecretKey;

      let decrypt: ((k: Uint8Array) => Uint8Array) | undefined;
      if (encrypted) {
        if (!passphrase) {
          throw new InvalidPassphraseError('No passphrase provided to decrypt encrypted key');
        }
        const pass = typeof passphrase === 'string' ? new TextEncoder().encode(passphrase) : passphrase;
        decrypt = (data: Uint8Array) => {
          const salt = data.subarray(0, 8);
          const encryptedSk = data.subarray(8);
          const encryptionKey = pbkdf2(SHA512, pass, salt, 32768, 32);
          const res = openSecretBox(
            new Uint8Array(encryptionKey),
            new Uint8Array(24),
            new Uint8Array(encryptedSk)
          );
          if (!res) {
            throw new Error("can't decrypt secret key");
          }
          return res;
        };
      }

      switch (pre) {
        case PrefixV2.Ed25519EncryptedSeed:
        case PrefixV2.Ed25519Seed:
        case PrefixV2.Ed25519SecretKey:
          this.#key = new EdKey(key, decrypt);
          break;

        case PrefixV2.Secp256k1EncryptedSecretKey:
        case PrefixV2.Secp256k1SecretKey:
        case PrefixV2.P256EncryptedSecretKey:
        case PrefixV2.P256SecretKey:
          this.#key = new ECKey(key, decrypt);
          break;

        case PrefixV2.BLS12_381EncryptedSecretKey:
        case PrefixV2.BLS12_381SecretKey:
          this.#key = new BLSKey(key, decrypt);
          break;
      }
    } else {
      this.#key = key;
    }
  }

  /**
   *
   * @param bytes Bytes to sign
   * @param watermark Watermark to append to the bytes
   */
  async sign(message: string | Uint8Array, watermark?: Uint8Array): Promise<SignResult> {
    const msg = typeof message == 'string' ? hex2buf(message) : message;
    const watermarkMsg = watermark !== undefined ? mergebuf(watermark, msg) : msg;
    const {
      rawSignature,
      sig: signature,
      prefixSig: prefixedSignature,
    } = await this.#key.sign(watermarkMsg);
    return {
      bytes: buf2hex(msg),
      sig: signature,
      prefixSig: prefixedSignature,
      sbytes: buf2hex(
        mergebuf(
          msg,
          // bls only Signature_prefix ff03 ref:https://octez.tezos.com/docs/shell/p2p_api.html#signature-prefix-tag-255 & https://octez.tezos.com/docs/shell/p2p_api.html#bls-prefix-tag-3
          isPOP(this.#key) ? mergebuf(new Uint8Array([255, 3]), rawSignature) : rawSignature
        )
      ),
    };
  }

  async provePossession(): Promise<RawSignResult> {
    if (isPOP(this.#key)) {
      return this.#key.provePossession();
    } else {
      throw new ProhibitedActionError('Only BLS keys can prove possession');
    }
  }

  get canProvePossession(): boolean {
    return isPOP(this.#key);
  }

  /**
   * @returns Encoded public key
   */
  publicKey(): Promise<string> {
    return Promise.resolve(String(this.#key.publicKey()));
  }

  /**
   * @returns Encoded public key hash
   */
  publicKeyHash(): Promise<string> {
    return Promise.resolve(this.#key.publicKey().hash());
  }

  /**
   * @returns Encoded private key
   */
  secretKey(): Promise<string> {
    return Promise.resolve(this.#key.secretKey());
  }
}

export function publicKeyFromString(src: string): PublicKey {
  const [keyData, pre] = b58DecodeAndCheckPrefix(src, [
    PrefixV2.Ed25519PublicKey,
    PrefixV2.Secp256k1PublicKey,
    PrefixV2.P256PublicKey,
    PrefixV2.BLS12_381PublicKey,
  ]);

  switch (pre) {
    case PrefixV2.Ed25519PublicKey:
      return new EdPublicKey(keyData);
    case PrefixV2.Secp256k1PublicKey:
      return new ECPublicKey(keyData, 'secp256k1');
    case PrefixV2.P256PublicKey:
      return new ECPublicKey(keyData, 'p256');
    case PrefixV2.BLS12_381PublicKey:
      return new BLSPublicKey(keyData);
  }
}


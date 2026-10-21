import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english.js';
import { InvalidMnemonicError } from './errors';
import { Curves, generateSecretKey } from './helpers';
import { EdKey } from './ed-key';
import { ECKey } from './ec-key';

/**
 * Converts an English BIP39 mnemonic to entropy bytes.
 * @throws InvalidMnemonicError for an invalid phrase, without including its text.
 */
export function mnemonicToEntropy(mnemonic: string): Uint8Array {
  try {
    return bip39.mnemonicToEntropy(mnemonic, wordlist);
  } catch {
    throw new InvalidMnemonicError();
  }
}

/**
 * Converts 16, 20, 24, 28 or 32 entropy bytes to an English BIP39 mnemonic.
 * Strings must contain unprefixed, even-length hexadecimal. Leading zeros matter.
 */
export function entropyToMnemonic(entropy: Uint8Array | string): string {
  let bytes: Uint8Array;
  if (typeof entropy === 'string') {
    if (!/^(?:[0-9a-fA-F]{2})+$/.test(entropy)) {
      throw new Error('Entropy must be unprefixed, even-length hexadecimal');
    }
    bytes = Uint8Array.from({ length: entropy.length / 2 }, (_, index) =>
      parseInt(entropy.slice(index * 2, index * 2 + 2), 16)
    );
  } else {
    bytes = entropy;
  }
  return bip39.entropyToMnemonic(bytes, wordlist);
}

/**
 * Generates an English BIP39 mnemonic with the dependency's secure random source.
 * @param strength Entropy bits, 128, 160, 192, 224 or 256. Defaults to 128.
 */
export function generateMnemonic(strength = 128): string {
  return bip39.generateMnemonic(wordlist, strength);
}

export interface FromMnemonicParams {
  mnemonic: string;
  password?: string;
  derivationPath?: string;
  curve?: Curves;
}

export interface DerivedKey {
  publicKey: string;
  publicKeyHash: string;
  secretKey: string;
}

// Shared with the signer, but not exported from the package entrypoint.
export function deriveMnemonicSecretKey({
  mnemonic,
  password = '',
  derivationPath = "44'/1729'/0'/0'",
  curve = 'ed25519',
}: FromMnemonicParams): { secretKey: string; curve: Curves } {
  if (!bip39.validateMnemonic(mnemonic, wordlist)) {
    throw new InvalidMnemonicError();
  }
  const seed = bip39.mnemonicToSeedSync(mnemonic, password);
  return { secretKey: generateSecretKey(seed, derivationPath, curve), curve };
}

/**
 * Derives key material without constructing an InMemorySigner.
 * Uses the same defaults, English BIP39 phrases, password and paths as fromMnemonic.
 * Supports Ed25519, secp256k1 and P-256 mnemonic derivation.
 * The returned secretKey is unencrypted and matches InMemorySigner.secretKey(),
 * including the expanded Ed25519 form. Avoid logging or sharing the result.
 */
export function deriveKeyFromMnemonic(params: FromMnemonicParams): DerivedKey {
  const { secretKey, curve } = deriveMnemonicSecretKey(params);
  const key = curve === 'ed25519' ? new EdKey(secretKey) : new ECKey(secretKey);
  const publicKey = key.publicKey();
  return {
    publicKey: String(publicKey),
    publicKeyHash: publicKey.hash(),
    secretKey: key.secretKey(),
  };
}

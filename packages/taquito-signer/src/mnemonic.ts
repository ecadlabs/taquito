import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english.js';
import { InvalidMnemonicError } from './errors';

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
    bytes = Uint8Array.from(entropy.match(/../g)!, (byte) => parseInt(byte, 16));
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

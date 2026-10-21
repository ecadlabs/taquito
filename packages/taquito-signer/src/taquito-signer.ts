/**
 * @packageDocumentation
 * @module @taquito/signer
 */
export * from './in-memory-signer';
export { VERSION } from './version';
export * from './derivation-tools';
export * from './helpers';
export { InvalidPassphraseError } from './errors';
export { PublicKey } from './key-interface';

export { mnemonicToEntropy } from './mnemonic';
export { entropyToMnemonic } from './mnemonic';
export { generateMnemonic } from './mnemonic';
export { deriveKeyFromMnemonic, type DerivedKey } from './mnemonic';

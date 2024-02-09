/**
 * @packageDocumentation
 * @module @taquito/signer
 */
// export * as Bip39 from 'bip39';

export * from './import-key';
export { VERSION } from './version';
export * from './derivation-tools';
export type { Curves } from './helpers';
export { InvalidPassphraseError } from './errors';

export { InMemorySigner } from './in-memory-signer';
export type { FromMnemonicParams } from './in-memory-signer';

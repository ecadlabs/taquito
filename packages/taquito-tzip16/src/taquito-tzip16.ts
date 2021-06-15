/**
 * @packageDocumentation
 * @module @taquito/tzip16
 */
export * from './handlers/http-handler';
export * from './handlers/tezos-storage-handler';
export * from './handlers/ipfs-handler';
export * from './composer';
export * from './metadata-interface';
export * from './metadata-provider';
export * from './tzip16-contract-abstraction';
export * from './tzip16-errors';
export * from './tzip16-extension';
export * from './tzip16-utils';
export * from './viewKind/interface';
export * from './viewKind/michelson-storage-view';
export * from './viewKind/viewFactory';
export { VERSION } from './version';

/**
 * @deprecated `import { bytes2Char, char2Bytes } from "@taquito/tzip16"` is deprecated in favor of 
 * `import { bytes2Char, char2Bytes } from "@taquito/utils"`
 *
 */
export { bytes2Char, char2Bytes } from "@taquito/utils";
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
export * from './errors';
export * from './tzip16-extension';
export * from './tzip16-utils';
export * from './viewKind/interface';
export * from './viewKind/michelson-storage-view';
export * from './viewKind/viewFactory';
export { VERSION } from './version';

/**
 * @deprecated `import { hexStringToByteString, byteStringToHexString } from "@taquito/tzip16"` is deprecated in favor of
 * `import { hexStringToByteString, byteStringToHexString } from "@taquito/utils"`
 *
 */
export { hexStringToByteString, byteStringToHexString } from '@taquito/utils';

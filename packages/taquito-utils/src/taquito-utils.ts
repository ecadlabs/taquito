/**
 * @packageDocumentation
 * @module @taquito/utils
 */

// Re-export everything from encoding
export * from './encoding';
// Re-export everything from validators
export * from './validators';
// Re-export version
export { VERSION } from './version';
// Re-export constants (some are deprecated)
export { prefix, Prefix, prefixLength } from './constants'; // (deprecated will be removed in the next minor release)
export { PrefixV2, payloadLength } from './constants';
// Re-export from verify-signature
export { validatePkAndExtractPrefix } from './verify-signature'; // (deprecated will be removed in the next minor release)
export { verifySignature, BLS12_381_DST, POP_DST } from './verify-signature';
// Re-export errors
export * from './errors';
// Re-export format
export { format } from './format';

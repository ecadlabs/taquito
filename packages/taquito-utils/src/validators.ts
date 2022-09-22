import { prefix, prefixLength, Prefix } from './constants';

import bs58check from 'bs58check';

export enum ValidationResult {
  NO_PREFIX_MATCHED,
  INVALID_CHECKSUM,
  INVALID_LENGTH,
  VALID,
}

export function isValidPrefix(value: unknown): value is Prefix {
  if (typeof value !== 'string') {
    return false;
  }

  return value in prefix;
}
/**
 * @description This function is called by the validation functions ([[validateAddress]], [[validateChain]], [[validateContractAddress]], [[validateKeyHash]], [[validateSignature]], [[validatePublicKey]]).
 * Verify if the value has the right prefix or return `NO_PREFIX_MATCHED`,
 * decode the value using base58 and return `INVALID_CHECKSUM` if it fails,
 * check if the length of the value matches the prefix type or return `INVALID_LENGTH`.
 * If all checks pass, return `VALID`.
 *
 * @param value Value to validate
 * @param prefixes prefix the value should have
 */
function validatePrefixedValue(value: string, prefixes: Prefix[]) {
  const match = new RegExp(`^(${prefixes.join('|')})`).exec(value);
  if (!match || match.length === 0) {
    return ValidationResult.NO_PREFIX_MATCHED;
  }

  const prefixKey = match[0];

  if (!isValidPrefix(prefixKey)) {
    return ValidationResult.NO_PREFIX_MATCHED;
  }

  // Remove annotation from contract address before doing the validation
  const contractAddress = /^(KT1\w{33})(%(.*))?/.exec(value);
  if (contractAddress) {
    value = contractAddress[1];
  }

  // decodeUnsafe return undefined if decoding fail
  let decoded = bs58check.decodeUnsafe(value);
  if (!decoded) {
    return ValidationResult.INVALID_CHECKSUM;
  }

  decoded = decoded.slice(prefix[prefixKey].length);
  if (decoded.length !== prefixLength[prefixKey]) {
    return ValidationResult.INVALID_LENGTH;
  }

  return ValidationResult.VALID;
}

const implicitPrefix = [Prefix.TZ1, Prefix.TZ2, Prefix.TZ3, Prefix.TZ4];
const contractPrefix = [Prefix.KT1, Prefix.TXR1];
const signaturePrefix = [Prefix.EDSIG, Prefix.P2SIG, Prefix.SPSIG, Prefix.SIG];
const pkPrefix = [Prefix.EDPK, Prefix.SPPK, Prefix.P2PK, Prefix.BLPK];
const operationPrefix = [Prefix.O];
const protocolPrefix = [Prefix.P];
const blockPrefix = [Prefix.B];

/**
 * @description Used to check if an address or a contract address is valid.
 *
 * @returns
 * 0 (NO_PREFIX_MATCHED), 1 (INVALID_CHECKSUM), 2 (INVALID_LENGTH) or 3 (VALID).
 *
 * @example
 * ```
 * import { validateAddress } from '@taquito/utils';
 * const pkh = 'tz1L9r8mWmRPndRhuvMCWESLGSVeFzQ9NAWx'
 * const validation = validateAddress(pkh)
 * console.log(validation)
 * // This example return 3 which correspond to VALID
 * ```
 */
export function validateAddress(value: string): ValidationResult {
  return validatePrefixedValue(value, [...implicitPrefix, ...contractPrefix]);
}

/**
 * @description Used to check if a chain id is valid.
 *
 * @returns
 * 0 (NO_PREFIX_MATCHED), 1 (INVALID_CHECKSUM), 2 (INVALID_LENGTH) or 3 (VALID).
 *
 * @example
 * ```
 * import { validateChain } from '@taquito/utils';
 * const chainId = 'NetXdQprcVkpaWU'
 * const validation = validateChain(chainId)
 * console.log(validation)
 * // This example return 3 which correspond to VALID
 * ```
 */
export function validateChain(value: string): ValidationResult {
  return validatePrefixedValue(value, [Prefix.NET]);
}

/**
 * @description Used to check if a contract address is valid.
 *
 * @returns
 * 0 (NO_PREFIX_MATCHED), 1 (INVALID_CHECKSUM), 2 (INVALID_LENGTH) or 3 (VALID).
 *
 * @example
 * ```
 * import { validateContractAddress } from '@taquito/utils';
 * const contractAddress = 'KT1JVErLYTgtY8uGGZ4mso2npTSxqVLDRVbC'
 * const validation = validateContractAddress(contractAddress)
 * console.log(validation)
 * // This example return 3 which correspond to VALID
 * ```
 */
export function validateContractAddress(value: string): ValidationResult {
  return validatePrefixedValue(value, contractPrefix);
}

/**
 * @description Used to check if a key hash is valid.
 *
 * @returns
 * 0 (NO_PREFIX_MATCHED), 1 (INVALID_CHECKSUM), 2 (INVALID_LENGTH) or 3 (VALID).
 *
 * @example
 * ```
 * import { validateKeyHash } from '@taquito/utils';
 * const keyHashWithoutPrefix = '1L9r8mWmRPndRhuvMCWESLGSVeFzQ9NAWx'
 * const validation = validateKeyHash(keyHashWithoutPrefix)
 * console.log(validation)
 * // This example return 0 which correspond to NO_PREFIX_MATCHED
 * ```
 */
export function validateKeyHash(value: string): ValidationResult {
  return validatePrefixedValue(value, implicitPrefix);
}

/**
 * @description Used to check if a signature is valid.
 *
 * @returns
 * 0 (NO_PREFIX_MATCHED), 1 (INVALID_CHECKSUM), 2 (INVALID_LENGTH) or 3 (VALID).
 *
 * @example
 * ```
 * import { validateSignature } from '@taquito/utils';
 * const signature = 'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg'
 * const validation = validateSignature(signature)
 * console.log(validation)
 * // This example return 3 which correspond to VALID
 * ```
 */
export function validateSignature(value: string): ValidationResult {
  return validatePrefixedValue(value, signaturePrefix);
}

/**
 * @description Used to check if a public key is valid.
 *
 * @returns
 * 0 (NO_PREFIX_MATCHED), 1 (INVALID_CHECKSUM), 2 (INVALID_LENGTH) or 3 (VALID).
 *
 * @example
 * ```
 * import { validatePublicKey } from '@taquito/utils';
 * const publicKey = 'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g'
 * const validation = validatePublicKey(publicKey)
 * console.log(validation)
 * // This example return 3 which correspond to VALID
 * ```
 */
export function validatePublicKey(value: string): ValidationResult {
  return validatePrefixedValue(value, pkPrefix);
}

/**
 * @description Used to check if an operation hash is valid.
 *
 * @returns
 * 0 (NO_PREFIX_MATCHED), 1 (INVALID_CHECKSUM), 2 (INVALID_LENGTH) or 3 (VALID).
 *
 * @example
 * ```
 * import { validateOperation } from '@taquito/utils';
 * const operationHash = 'oo6JPEAy8VuMRGaFuMmLNFFGdJgiaKfnmT1CpHJfKP3Ye5ZahiP'
 * const validation = validateOperation(operationHash)
 * console.log(validation)
 * // This example return 3 which correspond to VALID
 * ```
 */
export function validateOperation(value: string): ValidationResult {
  return validatePrefixedValue(value, operationPrefix);
}

/**
 * @description Used to check if a protocol hash is valid.
 *
 * @returns
 * 0 (NO_PREFIX_MATCHED), 1 (INVALID_CHECKSUM), 2 (INVALID_LENGTH) or 3 (VALID).
 *
 * @example
 * ```
 * import { validateProtocol } from '@taquito/utils';
 * const protocolHash = 'PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx'
 * const validation = validateProtocol(protocolHash)
 * console.log(validation)
 * // This example return 3 which correspond to VALID
 * ```
 */
export function validateProtocol(value: string): ValidationResult {
  return validatePrefixedValue(value, protocolPrefix);
}

/**
 * @description Used to check if a block hash is valid.
 *
 * @returns
 * 0 (NO_PREFIX_MATCHED), 1 (INVALID_CHECKSUM), 2 (INVALID_LENGTH) or 3 (VALID).
 *
 * @example
 * ```
 * import { validateBlock } from '@taquito/utils';
 * const blockHash = 'PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx'
 * const validation = validateBlock(blockHash)
 * console.log(validation)
 * // This example return 3 which correspond to VALID
 * ```
 */
export function validateBlock(value: string): ValidationResult {
  return validatePrefixedValue(value, blockPrefix);
}

/**
 * @description Used to check if a spending key is valid.
 * @returns 0 (NO_PREFIX_MATCHED), 1 (INVALID_CHECKSUM), 2 (INVALID_LENGTH) or 3 (VALID).
 *
 */
export function validateSpendingKey(value: any): ValidationResult {
  return validatePrefixedValue(value, [Prefix.SASK]);
}

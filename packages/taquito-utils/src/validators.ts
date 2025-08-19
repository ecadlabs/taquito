import { PrefixV2 } from './constants';
import {
  b58DecodeAndCheckPrefix,
  splitAddress,
  ValidationResult,
  publicKeyHashPrefixes,
  signaturePrefixes,
  publicKeyPrefixes,
  addressPrefixes,
} from './taquito-utils';
import { ParameterValidationError } from '@taquito/core';

export { ValidationResult } from '@taquito/core';

/**
 * @description Used to check if a value has one of the allowed prefixes.
 * @returns true if the value has one of the allowed prefixes, false otherwise
 * @example
 * ```
 * import { isValidPrefixedValue } from '@taquito/utils';
 * const value = 'tz1L9r8mWmRPndRhuvMCWESLGSVeFzQ9NAWx'
 * const isValid = isValidPrefixedValue(value, [PrefixV2.Ed25519PublicKeyHash])
 * console.log(isValid) // true
 * ```
 */
export function isValidPrefixedValue(value: string, prefixes?: PrefixV2[]): boolean {
  return validatePrefixedValue(value, prefixes) === ValidationResult.VALID;
}

/**
 * @description This function is called by the validation functions ([[validateAddress]], [[validateChain]], [[validateContractAddress]], [[validateKeyHash]], [[validateSignature]], [[validatePublicKey]]).
 * Verify if the value can be decoded or return `1` (INVALID_CHECKSUM) / `5` (INVALID_ENCODING), then check if the prefix is valid or allowed or return `0` (NO_PREFIX_MATCHED) / `4` (PREFIX_NOT_ALLOWED)
 * If all checks pass, return `3` (VALID).
 * @param value Value to validate
 * @param prefixes prefix the value should have
 * @returns 0 = NO_PREFIX_MATCHED, 1 = INVALID_CHECKSUM, 2 = INVALID_LENGTH, 3 = VALID, 4 = PREFIX_NOT_ALLOWED, 5 = INVALID_ENCODING, 6 = OTHER,
 * @example
 * ```
 * import { validatePrefixedValue } from '@taquito/utils';
 * const value = 'tz1L9r8mWmRPndRhuvMCWESLGSVeFzQ9NAWx'
 * const validation = validatePrefixedValue(value, [PrefixV2.Ed25519PublicKeyHash])
 * console.log(validation) // 3
 * ```
 */
function validatePrefixedValue(value: string, prefixes?: PrefixV2[]): ValidationResult {
  try {
    b58DecodeAndCheckPrefix(value, prefixes);
  } catch (err: unknown) {
    if (err instanceof ParameterValidationError && err.result !== undefined) {
      return err.result;
    }
    return ValidationResult.OTHER;
  }
  return ValidationResult.VALID;
}

/**
 * @description Used to check if an address or a contract address is valid.
 *
 * @returns
 * 0 = NO_PREFIX_MATCHED, 1 = INVALID_CHECKSUM, 2 = INVALID_LENGTH, 3 = VALID, 4 = PREFIX_NOT_ALLOWED, 5 = INVALID_ENCODING, 6 = OTHER,
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
  const [addr] = splitAddress(value ?? '');
  return validatePrefixedValue(addr, addressPrefixes);
}

/**
 * @description Used to check if a chain id is valid.
 *
 * @returns
 * 0 = NO_PREFIX_MATCHED, 1 = INVALID_CHECKSUM, 2 = INVALID_LENGTH, 3 = VALID, 4 = PREFIX_NOT_ALLOWED, 5 = INVALID_ENCODING, 6 = OTHER,
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
  return validatePrefixedValue(value, [PrefixV2.ChainID]);
}

/**
 * @description Used to check if a contract address is valid.
 *
 * @returns
 * 0 = NO_PREFIX_MATCHED, 1 = INVALID_CHECKSUM, 2 = INVALID_LENGTH, 3 = VALID, 4 = PREFIX_NOT_ALLOWED, 5 = INVALID_ENCODING, 6 = OTHER,
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
  return validatePrefixedValue(value, [PrefixV2.ContractHash]);
}

/**
 * @description Used to check if a key hash is valid.
 *
 * @returns
 * 0 = NO_PREFIX_MATCHED, 1 = INVALID_CHECKSUM, 2 = INVALID_LENGTH, 3 = VALID, 4 = PREFIX_NOT_ALLOWED, 5 = INVALID_ENCODING, 6 = OTHER,
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
  return validatePrefixedValue(value, publicKeyHashPrefixes);
}

/**
 * @description Used to check if a signature is valid.
 *
 * @returns
 * 0 = NO_PREFIX_MATCHED, 1 = INVALID_CHECKSUM, 2 = INVALID_LENGTH, 3 = VALID, 4 = PREFIX_NOT_ALLOWED, 5 = INVALID_ENCODING, 6 = OTHER,
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
  return validatePrefixedValue(value, signaturePrefixes);
}

/**
 * @description Used to check if a public key is valid.
 *
 * @returns
 * 0 = NO_PREFIX_MATCHED, 1 = INVALID_CHECKSUM, 2 = INVALID_LENGTH, 3 = VALID, 4 = PREFIX_NOT_ALLOWED, 5 = INVALID_ENCODING, 6 = OTHER,
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
  return validatePrefixedValue(value, publicKeyPrefixes);
}

/**
 * @description Used to check if an operation hash is valid.
 *
 * @returns
 * 0 = NO_PREFIX_MATCHED, 1 = INVALID_CHECKSUM, 2 = INVALID_LENGTH, 3 = VALID, 4 = PREFIX_NOT_ALLOWED, 5 = INVALID_ENCODING, 6 = OTHER,
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
  return validatePrefixedValue(value, [PrefixV2.OperationHash]);
}

/**
 * @description Used to check if a protocol hash is valid.
 *
 * @returns
 * 0 = NO_PREFIX_MATCHED, 1 = INVALID_CHECKSUM, 2 = INVALID_LENGTH, 3 = VALID, 4 = PREFIX_NOT_ALLOWED, 5 = INVALID_ENCODING, 6 = OTHER,
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
  return validatePrefixedValue(value, [PrefixV2.ProtocolHash]);
}

/**
 * @description Used to check if a block hash is valid.
 *
 * @returns
 * 0 = NO_PREFIX_MATCHED, 1 = INVALID_CHECKSUM, 2 = INVALID_LENGTH, 3 = VALID, 4 = PREFIX_NOT_ALLOWED, 5 = INVALID_ENCODING, 6 = OTHER,
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
  return validatePrefixedValue(value, [PrefixV2.BlockHash]);
}

/**
 * @deprecated this function will be removed in the next minor release
 * @description generates a readable error string from a validation result
 */
export function invalidDetail(validation: ValidationResult): string {
  switch (validation) {
    case ValidationResult.NO_PREFIX_MATCHED:
      return 'with unsupported prefix';
    case ValidationResult.INVALID_CHECKSUM:
      return 'failed checksum';
    case ValidationResult.INVALID_LENGTH:
      return 'with incorrect length';
    default:
      return '';
  }
}

/**
 * @description Used to check if a spending key is valid.
 * @returns
 * 0 = NO_PREFIX_MATCHED, 1 = INVALID_CHECKSUM, 2 = INVALID_LENGTH, 3 = VALID, 4 = PREFIX_NOT_ALLOWED, 5 = INVALID_ENCODING, 6 = OTHER,
 *
 */
export function validateSpendingKey(value: string): ValidationResult {
  return validatePrefixedValue(value, [PrefixV2.SaplingSpendingKey]);
}

export function validateSmartRollupAddress(value: string): ValidationResult {
  return validatePrefixedValue(value, [PrefixV2.SmartRollupHash]);
}

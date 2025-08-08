import { PrefixV2 } from './constants';
import { b58DecodeAndCheckPrefix, splitAddress, ValidationResult } from './taquito-utils';
import { ParameterValidationError } from '@taquito/core';

export { ValidationResult } from '@taquito/core';

export function isValidPrefixedValue(value: string, prefixes?: PrefixV2[]): boolean {
  return validatePrefixedValue(value, prefixes) === ValidationResult.VALID;
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

const implicitPrefix = [
  PrefixV2.Ed25519PublicKeyHash,
  PrefixV2.Secp256k1PublicKeyHash,
  PrefixV2.P256PublicKeyHash,
  PrefixV2.BLS12_381PublicKeyHash,
];
const contractPrefix = [PrefixV2.ContractHash];
const signaturePrefix = [
  PrefixV2.Ed25519Signature,
  PrefixV2.P256Signature,
  PrefixV2.Secp256k1Signature,
  PrefixV2.GenericSignature,
];
const pkPrefix = [
  PrefixV2.Ed25519PublicKey,
  PrefixV2.Secp256k1PublicKey,
  PrefixV2.P256PublicKey,
  PrefixV2.BLS12_381PublicKey,
];
const operationPrefix = [PrefixV2.OperationHash];
const protocolPrefix = [PrefixV2.ProtocolHash];
const blockPrefix = [PrefixV2.BlockHash];
const smartRollupPrefix = [PrefixV2.SmartRollupHash];

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
  const [addr] = splitAddress(value);
  return validatePrefixedValue(addr, [...implicitPrefix, ...contractPrefix, ...smartRollupPrefix]);
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
  return validatePrefixedValue(value, [PrefixV2.ChainID]);
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
export function validateSpendingKey(value: string): ValidationResult {
  return validatePrefixedValue(value, [PrefixV2.SaplingSpendingKey]);
}

export function validateSmartRollupAddress(value: string): ValidationResult {
  return validatePrefixedValue(value, [...smartRollupPrefix]);
}

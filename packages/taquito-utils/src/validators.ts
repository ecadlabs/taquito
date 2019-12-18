import { prefix, prefixLength, Prefix } from './constants';

const bs58check = require('bs58check');

export enum ValidationResult {
  NO_PREFIX_MATCHED,
  INVALID_CHECKSUM,
  INVALID_LENGTH,
  VALID,
}

function valueIsValidKeyOf<T>(value: any, obj: T): value is keyof T {
  return value in obj;
}

function validatePrefixedValue(value: any, prefixes: Prefix[]) {
  const match = new RegExp(`^(${prefixes.join('|')})`).exec(value);
  if (!match || match.length === 0) {
    return ValidationResult.NO_PREFIX_MATCHED;
  }

  const prefixKey = match[0];

  if (!valueIsValidKeyOf(prefixKey, prefix)) {
    return ValidationResult.NO_PREFIX_MATCHED;
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

const implicitPrefix = [Prefix.TZ1, Prefix.TZ2, Prefix.TZ3];
const contractPrefix = [Prefix.KT1];
const signaturePrefix = [Prefix.EDSIG, Prefix.P2SIG, Prefix.SPSIG, Prefix.SIG];
const pkPrefix = [Prefix.EDPK, Prefix.SPPK, Prefix.P2PK];
export function validateAddress(value: any): ValidationResult {
  return validatePrefixedValue(value, [...implicitPrefix, ...contractPrefix]);
}

export function validateChain(value: any): ValidationResult {
  return validatePrefixedValue(value, [Prefix.NET]);
}

export function validateContractAddress(value: any): ValidationResult {
  return validatePrefixedValue(value, contractPrefix);
}

export function validateKeyHash(value: any): ValidationResult {
  return validatePrefixedValue(value, implicitPrefix);
}

export function validateSignature(value: any): ValidationResult {
  return validatePrefixedValue(value, signaturePrefix);
}

export function validatePublicKey(value: any): ValidationResult {
  return validatePrefixedValue(value, pkPrefix);
}

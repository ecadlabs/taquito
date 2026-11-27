import BigNumber from 'bignumber.js';
import { InvalidBigMapParameterError, ParameterValidationError } from '@taquito/core';
import type { BigMapPagination, SaplingDiffOffsets } from '../types';

/**
 * Casts object/array items to BigNumber
 * @param data input object or array
 * @param keys keys for processing or all items if not defined
 *
 */
export function castToBigNumber(data: any, keys?: any): object {
  const returnArray: boolean = Array.isArray(data);
  if (typeof keys === 'undefined') {
    keys = Object.keys(data);
  }
  const response: any = returnArray ? [] : {};

  keys.forEach((key: any) => {
    const item = data[key];
    let res: any;
    if (typeof item === 'undefined') {
      return;
    }

    if (Array.isArray(item)) {
      res = castToBigNumber(item);
      response[key] = res;
      return;
    }

    res = new BigNumber(item);
    response[key] = res;
  });

  return response;
}

/**
 * Casts object/array BigNumber items to strings for readability
 * @param data input object or array
 * @param keys keys for processing or all items if not defined
 *
 */
export function castToString(data: any, keys?: any): object {
  const returnArray: boolean = Array.isArray(data);
  if (typeof keys === 'undefined') {
    keys = Object.keys(data);
  }
  const response: any = returnArray ? [] : {};

  keys.forEach((key: any) => {
    const item = data[key];

    if (typeof item === 'undefined') {
      return;
    }

    if (Array.isArray(item)) {
      response[key] = castToString(item);
      return;
    }

    if (!BigNumber.isBigNumber(item)) {
      response[key] = item;
      return;
    }

    response[key] = item.toString();
  });

  return response;
}

/**
 * Applies the default big-map page (offset 0, length 100) and validates it
 * @param page optional offset and length of the page
 */
export function normalizeBigMapPagination(page: BigMapPagination = {}): Required<BigMapPagination> {
  if (!page || typeof page !== 'object') {
    throw new InvalidBigMapParameterError('page options', 'expected an object');
  }
  const { offset = 0, length = 100 } = page;
  if (!Number.isSafeInteger(offset) || offset < 0 || !Number.isSafeInteger(length) || length < 0) {
    throw new InvalidBigMapParameterError(
      'page options',
      'offset and length must be non-negative safe integers'
    );
  }
  return { offset, length };
}

/** Node query parameters for Sapling diff offsets. */
export type SaplingDiffQueryArguments = { offset_commitment?: number; offset_nullifier?: number };

// The query parser accepts larger numbers, but the protocol checks both offsets as Sapling
// commitment positions, which are 32-bit. The node answers 500 above this value.
const MAX_SAPLING_DIFF_OFFSET = 4294967295;

/**
 * Validates Sapling diff offsets and returns the RPC query, or undefined when no offset is set.
 * @throws {@link ParameterValidationError} when an offset is not an integer from 0 to 4294967295
 */
export function normalizeSaplingDiffOffsets(
  offsets: SaplingDiffOffsets = {}
): SaplingDiffQueryArguments | undefined {
  if (!offsets || typeof offsets !== 'object') {
    throw new ParameterValidationError(
      'Invalid Sapling diff offsets: expected an object',
      'expected an object'
    );
  }
  const { offsetCommitment, offsetNullifier } = offsets;
  for (const [name, value] of [
    ['offsetCommitment', offsetCommitment],
    ['offsetNullifier', offsetNullifier],
  ] as const) {
    if (
      value !== undefined &&
      (!Number.isInteger(value) || value < 0 || value > MAX_SAPLING_DIFF_OFFSET)
    ) {
      const detail = `${name} must be an integer from 0 to ${MAX_SAPLING_DIFF_OFFSET}, got ${String(value)}`;
      throw new ParameterValidationError(`Invalid Sapling diff offsets: ${detail}`, detail);
    }
  }
  if (offsetCommitment === undefined && offsetNullifier === undefined) {
    return undefined;
  }
  return { offset_commitment: offsetCommitment, offset_nullifier: offsetNullifier };
}

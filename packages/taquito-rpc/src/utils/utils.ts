import BigNumber from 'bignumber.js';
import { InvalidBigMapParameterError } from '@taquito/core';
import type { BigMapPagination } from '../types';

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

const camelCase = require('lodash/camelCase');
const getByPath = require('lodash/get');
const setByPath = require('lodash/set');
import BigNumber from 'bignumber.js';

/**
 * iterates over array/object and converts all keys to camelCase
 * @param data input object or array
 *
 * @see https://lodash.com/docs/#camelCase
 *
 */
export function camelCaseProps(data: any): any {
  // guarding against empty values
  if (!data) {
    return data;
  }

  const returnArray: boolean = Array.isArray(data);
  let response: any = returnArray ? [] : {};

  Object.entries(data).forEach(([key, value]) => {
    if (typeof value !== 'object' || !value) {
      response[camelCase(key)] = value;
      return;
    }

    let entries: any = Object.entries(value as any) as [];
    if (entries.length > 0) {
      response[camelCase(key)] = camelCaseProps(value);
      return;
    }
    response[camelCase(key)] = value;
  });

  return response;
}

/**
 * Casts object/array items to BigNumber
 * keys support lodash path notation
 * @param data input object or array
 * @param keys keys for processing or all items if not defined
 *
 * @see https://lodash.com/docs/#get
 *
 */
export function castToBigNumber(data: any, keys?: any): object {
  const returnArray: boolean = Array.isArray(data);
  if (typeof keys === 'undefined') {
    keys = Object.keys(data);
  }
  let response: any = returnArray ? [] : {};

  keys.forEach((key: any) => {
    const item = getByPath(data, key);
    let res: any;
    if (typeof item === 'undefined') {
      return;
    }

    if (Array.isArray(item)) {
      res = castToBigNumber(item);
      setByPath(response, key, res);
      return;
    }

    res = new BigNumber(item);
    setByPath(response, key, res);
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
  let response: any = returnArray ? [] : {};

  keys.forEach((key: any) => {
    const item = data[key];

    if (typeof item === 'undefined') {
      return;
    }

    if (Array.isArray(item)) {
      response[key] = castToString(item);
      return;
    }

    if (!(item instanceof BigNumber)) {
      response[key] = item;
      return;
    }

    response[key] = item.toString();
  });

  return response;
}

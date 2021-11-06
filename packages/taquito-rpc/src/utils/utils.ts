import getByPath from 'lodash/get';
import setByPath from 'lodash/set';
import BigNumber from 'bignumber.js';

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

    if (!BigNumber.isBigNumber(item)) {
      response[key] = item;
      return;
    }

    response[key] = item.toString();
  });

  return response;
}

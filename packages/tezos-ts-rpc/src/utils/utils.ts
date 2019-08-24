const camelCase = require('lodash/camelCase');
import BigNumber from 'bignumber.js';

export function camelCaseProps(data: object): object {
  let response: any = {};

  Object.entries(data).forEach(([key, value]) => {
    response[camelCase(key)] = value;
  });

  return response;
}

export function castToBigNumber(data: any, keys?: any): object {
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
      response[key] = castToBigNumber(item);
      return;
    }

    response[key] = new BigNumber(item);
  });

  return response;
}

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

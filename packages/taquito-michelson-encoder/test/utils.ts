import { BigNumber } from 'bignumber.js';
import { MichelsonMap } from '../src/michelson-map';

export const normalizeMichelsonValue = (value: unknown): unknown => {
  if (MichelsonMap.isMichelsonMap(value)) {
    const entries = Array.from(value.entries()).map(([key, entryValue]) => [
      normalizeMichelsonValue(key),
      normalizeMichelsonValue(entryValue),
    ]);

    if (entries.every(([key]) => ['string', 'number', 'boolean'].includes(typeof key))) {
      return Object.fromEntries(entries.map(([key, entryValue]) => [String(key), entryValue]));
    }

    return entries;
  }

  if (value instanceof BigNumber) {
    return value.toFixed();
  }

  if (Array.isArray(value)) {
    return value.map(normalizeMichelsonValue);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => [key, normalizeMichelsonValue(entryValue)])
    );
  }

  return value;
};

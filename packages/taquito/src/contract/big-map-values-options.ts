import type { BigMapValuesOptions } from './interface';
export function normalizeBigMapValuesOptions(options: BigMapValuesOptions = {}) {
  if (!options || typeof options !== 'object')
    throw new RangeError('Expected big-map page options');
  const { offset = 0, length = 100, block } = options;
  if (
    !Number.isSafeInteger(offset) ||
    offset < 0 ||
    !Number.isSafeInteger(length) ||
    length < 1 ||
    length > 1000
  )
    throw new RangeError('Expected a non-negative safe offset and a page length from 1 to 1000');
  return { offset, length, block };
}

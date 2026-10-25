import type { BigMapPagination } from './types';
export function normalizeBigMapPagination(page: BigMapPagination = {}) {
  if (!page || typeof page !== 'object')
    throw new RangeError('Expected big-map pagination options');
  const { offset = 0, length = 100 } = page;
  if (!Number.isSafeInteger(offset) || offset < 0 || !Number.isSafeInteger(length) || length < 0)
    throw new RangeError('Big-map offset and length must be non-negative safe integers');
  return { offset, length };
}

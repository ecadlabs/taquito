import { InvalidBigMapParameterError, UnsupportedActionError } from '@taquito/core';
import type { BigMapPagination, MichelsonV1Expression } from '@taquito/rpc';
import { RPCResponseError } from '../errors';
import type { BlockIdentifier, TzReadProvider } from '../read-provider/interface';
import type { BigMapValuesOptions } from './interface';

type BigMapValuesReader = TzReadProvider & Required<Pick<TzReadProvider, 'getBigMapValuesPage'>>;

/** Applies the default page (offset 0, length 100) and keeps the length between 1 and 1000. */
export function normalizeBigMapValuesOptions(options: BigMapValuesOptions = {}) {
  if (!options || typeof options !== 'object') {
    throw new InvalidBigMapParameterError('page options', 'expected an object');
  }
  const { offset = 0, length = 100, block } = options;
  if (
    !Number.isSafeInteger(offset) ||
    offset < 0 ||
    !Number.isSafeInteger(length) ||
    length < 1 ||
    length > 1000
  ) {
    throw new InvalidBigMapParameterError(
      'page options',
      'expected a non-negative safe offset and a length from 1 to 1000'
    );
  }
  return { offset, length, block };
}

/** Throws UnsupportedActionError when the read provider cannot read big-map values. */
export function assertBigMapValuesReader(
  reader: TzReadProvider
): asserts reader is BigMapValuesReader {
  if (typeof reader.getBigMapValuesPage !== 'function') {
    throw new UnsupportedActionError('The read provider does not support big-map value reads');
  }
}

/** Reads one page and rejects a response that is not an array or is longer than the page. */
export async function readBigMapValues(
  reader: BigMapValuesReader,
  id: string,
  page: Required<BigMapPagination>,
  block: BlockIdentifier
): Promise<MichelsonV1Expression[]> {
  const values = await reader.getBigMapValuesPage(id, page, block);
  if (!Array.isArray(values) || values.length > page.length) {
    throw new RPCResponseError('Invalid or overlength big-map values response');
  }
  return values;
}

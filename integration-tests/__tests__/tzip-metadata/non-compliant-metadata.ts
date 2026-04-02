import { HttpResponseError } from '@taquito/http-utils';
import { BigMapContractMetadataNotFoundError } from '@taquito/tzip16';
import { sleep } from '../../config';

const transientRpcRetries = 3;

export const expectMetadataLookupToRejectWithoutMetadata = async (
  getMetadata: () => Promise<unknown>
) => {
  for (let attempt = 1; attempt <= transientRpcRetries; attempt++) {
    try {
      await getMetadata();
      throw new Error('Expected getMetadata() to reject for a contract without TZIP-16 metadata');
    } catch (error) {
      if (error instanceof BigMapContractMetadataNotFoundError) {
        return;
      }

      if (error instanceof HttpResponseError && error.status >= 500 && attempt < transientRpcRetries) {
        await sleep(250 * attempt);
        continue;
      }

      throw error;
    }
  }
};

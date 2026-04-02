import { HttpResponseError, STATUS_CODE } from '@taquito/http-utils';
import { BigMapContractMetadataNotFoundError } from '@taquito/tzip16';
import { sleep } from '../../config';

const transientRpcRetries = 5;

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

      if (error instanceof HttpResponseError && attempt < transientRpcRetries) {
        const transientStatus =
          error.status === STATUS_CODE.NOT_FOUND || error.status >= STATUS_CODE.INTERNAL_SERVER_ERROR;

        if (transientStatus) {
          await sleep(250 * attempt);
          continue;
        }
      }

      throw error;
    }
  }
};

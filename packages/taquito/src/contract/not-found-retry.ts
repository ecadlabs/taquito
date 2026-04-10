import { HttpResponseError, STATUS_CODE } from '@taquito/http-utils';

const CONTRACT_READ_RETRY_DELAYS_MS = [0, 200, 400, 800];

const sleep = (durationMs: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, durationMs);
  });

export const isNotFoundError = (error: unknown): error is HttpResponseError =>
  error instanceof HttpResponseError && error.status === STATUS_CODE.NOT_FOUND;

export const retryOnNotFound = async <T>(
  read: () => Promise<T>,
  retryDelaysMs = CONTRACT_READ_RETRY_DELAYS_MS
): Promise<T> => {
  let lastError: unknown;

  for (const delayMs of retryDelaysMs) {
    if (delayMs > 0) {
      await sleep(delayMs);
    }

    try {
      return await read();
    } catch (error) {
      if (!isNotFoundError(error)) {
        throw error;
      }

      lastError = error;
    }
  }

  throw lastError;
};

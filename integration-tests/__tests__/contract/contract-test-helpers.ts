import { Contract, TezosToolkit } from '@taquito/taquito';
import { HttpResponseError, STATUS_CODE } from '@taquito/http-utils';
import { sleep } from '../../config';

export const waitForContractAt = async (
  Tezos: TezosToolkit,
  address: string,
  attempts = 5
): Promise<Contract> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await Tezos.contract.at(address);
    } catch (error) {
      lastError = error;
      if (
        error instanceof HttpResponseError &&
        error.status === STATUS_CODE.NOT_FOUND &&
        attempt < attempts
      ) {
        await sleep(250 * attempt);
        continue;
      }
      throw error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error(`Unable to load contract ${address}`);
};

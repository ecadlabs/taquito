import { SaplingParams } from './types';

export type { SaplingParams } from './types';

type SaplingParamsProvider = () => Promise<SaplingParams>;

let paramsProvider: SaplingParamsProvider | undefined;
let cachedParamsPromise: Promise<SaplingParams> | undefined;

export const setSaplingParamsProvider = (provider: SaplingParamsProvider) => {
  paramsProvider = provider;
  cachedParamsPromise = undefined;
};

export const getSaplingParams = () => {
  if (!cachedParamsPromise) {
    if (!paramsProvider) {
      return Promise.reject(
        new Error(
          'Sapling parameters provider not configured. Call setSaplingParamsProvider before using @taquito/sapling.'
        )
      );
    }
    cachedParamsPromise = paramsProvider();
  }

  return cachedParamsPromise;
};


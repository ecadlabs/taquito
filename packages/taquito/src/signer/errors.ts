import { TezosToolkitConfigError } from '@taquito/core';

/**
 *  @category Error
 *  @description Error that indicates no signer has been configured in the TezosToolkit instance
 */
export class UnconfiguredSignerError extends TezosToolkitConfigError {
  constructor() {
    super();
    this.name = 'UnconfiguredSignerError';
    this.message =
      'No signer has been configured. Please configure one by calling setProvider({signer}) on your TezosToolkit instance.';
  }
}

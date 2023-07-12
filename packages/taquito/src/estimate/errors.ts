import { TaquitoError } from '@taquito/core';

/**
 *  @category Error
 *  @description Error indicates unable to get public key to estimate reveal operation in Wallet API
 */
export class RevealEstimateError extends TaquitoError {
  constructor() {
    super();
    this.name = 'RevealEstimateError';
    this.message = 'Public key is unknown, unable to estimate the reveal operation in Wallet API.';
  }
}

import { TaquitoError } from '@taquito/core';

/**
 *  @category Error
 *  Error that indicates unable to get public key to estimate reveal operation in Wallet API
 */
export class RevealEstimateError extends TaquitoError {
  constructor() {
    super();
    this.name = 'RevealEstimateError';
    this.message = 'Public key is unknown, unable to estimate the reveal operation in Wallet API.';
  }
}

export class BatchGasLimitExceededError extends TaquitoError {
  constructor(
    public readonly requiredGasLimit: number,
    public readonly hardGasLimitPerBlock: number
  ) {
    super();
    this.name = 'BatchGasLimitExceededError';
    this.message = `Batch gas estimation requires at least ${requiredGasLimit} gas, which exceeds the per-block limit of ${hardGasLimitPerBlock}. Split the batch into smaller operations.`;
  }
}

import { TaquitoError, TezosToolkitConfigError } from '@taquito/core';

/**
 *  @category Error
 *  @description Error indicates CompositeForger.forge() results doesn't match each other
 */
export class ForgingMismatchError extends TaquitoError {
  constructor(public results: string[]) {
    super('Forging mismatch error');
    this.name = 'ForgingMismatchError';
    this.message = `Mismatch forging result1: ${results[0]} result2: ${results[1]}}`;
  }
}

/**
 *  @category Error
 *  @description Error indicates no forger has been configured for CompositeForger
 */
export class UnspecifiedForgerError extends TezosToolkitConfigError {
  constructor() {
    super();
    this.name = 'UnspecifiedForgerError';
    this.message =
      'No forger has been configured. Please configure new CompositeForger([rpcForger, localForger]) with your TezosToolkit instance.';
  }
}

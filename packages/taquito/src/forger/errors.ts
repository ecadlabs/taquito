import { TaquitoError, TezosToolkitConfigError } from '@taquito/core';

/**
 *  @category Error
 *  @description Error that indicates CompositeForger.forge() results doesn't match each other
 */
export class ForgingMismatchError extends TaquitoError {
  constructor(public readonly results: string[]) {
    super();
    this.name = 'ForgingMismatchError';
    this.message = `Forging mismatch error`;
  }
}

/**
 *  @category Error
 *  @description Error that indicates no forger has been configured for CompositeForger
 */
export class UnspecifiedForgerError extends TezosToolkitConfigError {
  constructor() {
    super();
    this.name = 'UnspecifiedForgerError';
    this.message =
      'No forger has been configured. Please configure new CompositeForger([rpcForger, localForger]) with your TezosToolkit instance.';
  }
}

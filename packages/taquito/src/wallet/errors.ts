import { TezosToolkitConfigError, NetworkError } from '@taquito/core';

/**
 *  @category Error
 *  @description Error indicates undefined confirmation has not been specified or configured
 */
export class ConfirmationUndefinedError extends TezosToolkitConfigError {
  constructor() {
    super();
    this.name = 'ConfirmationUndefinedError';
    this.message = 'Default confirmation count can not be undefined';
  }
}

/**
 *  @category Error
 *  @description Error that indicates a generic failure when trying to fetch an observable
 */
export class ObservableError extends NetworkError {
  constructor(public message: string) {
    super();
    this.name = 'ObservableError';
  }
}

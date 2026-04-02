import { TezosToolkitConfigError, NetworkError } from '@taquito/core';

/**
 *  @category Error
 *  Error that indicates undefined confirmation has not been specified or configured
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
 *  Error that indicates a generic failure when trying to fetch an observable
 */
export class ObservableError extends NetworkError {
  constructor(public readonly message: string) {
    super();
    this.name = 'ObservableError';
  }
}

/**
 *  @category Error
 *  Error that indicates a newly originated wallet contract could not be resolved
 */
export class OriginationWalletOperationError extends ObservableError {
  constructor(public readonly message: string) {
    super(message);
    this.name = 'OriginationWalletOperationError';
  }
}

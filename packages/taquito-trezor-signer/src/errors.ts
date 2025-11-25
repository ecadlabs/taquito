import { TaquitoError } from '@taquito/core';

/**
 * @category Error
 * @description Error that indicates Trezor Connect is not initialized
 */
export class TrezorNotInitializedError extends TaquitoError {
  constructor() {
    super();
    this.name = 'TrezorNotInitializedError';
    this.message = 'Trezor Connect is not initialized. Call TrezorSigner.init() first.';
  }
}

/**
 * @category Error
 * @description Error that indicates a failure when trying to retrieve a Public Key from Trezor
 */
export class TrezorPublicKeyRetrievalError extends TaquitoError {
  constructor(public readonly cause?: string) {
    super();
    this.name = 'TrezorPublicKeyRetrievalError';
    this.message = cause
      ? `Unable to retrieve address from Trezor: ${cause}`
      : 'Unable to retrieve address from Trezor';
  }
}

/**
 * @category Error
 * @description Error that indicates a failure during Trezor signing operation
 */
export class TrezorSigningError extends TaquitoError {
  constructor(public readonly cause?: string) {
    super();
    this.name = 'TrezorSigningError';
    this.message = cause
      ? `Trezor signing operation failed: ${cause}`
      : 'Trezor signing operation failed';
  }
}

/**
 * @category Error
 * @description Error that indicates Trezor Connect initialization failed
 */
export class TrezorInitializationError extends TaquitoError {
  constructor(public readonly cause?: string) {
    super();
    this.name = 'TrezorInitializationError';
    this.message = cause
      ? `Failed to initialize Trezor Connect: ${cause}`
      : 'Failed to initialize Trezor Connect';
  }
}

/**
 * @category Error
 * @description Error that indicates user rejected the action on Trezor device
 */
export class TrezorActionRejectedError extends TaquitoError {
  constructor() {
    super();
    this.name = 'TrezorActionRejectedError';
    this.message = 'Action was rejected on the Trezor device';
  }
}

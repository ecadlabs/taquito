import { TaquitoError } from '@taquito/core';

/**
 *  @category Error
 *  @description Error indicates an invalid or unparseable ledger response
 */
export class InvalidLedgerResponseError extends TaquitoError {
  constructor(public message: string) {
    super();
    this.name = 'InvalidLedgerResponseError';
  }
}

/**
 *  @category Error
 *  @description Error indicates a failure when trying to retrieve a Public Key from Ledger signer
 */
export class PublicKeyRetrievalError extends TaquitoError {
  constructor(public cause: any) {
    super();
    this.name = 'PublicKeyRetrievalError';
    this.message = `Unable to retrieve Public Key from Ledger`;
  }
}

/**
 *  @category Error
 *  @description Error indicates a failure when trying to retrieve a Public Key Hash from Ledger signer
 */
export class PublicKeyHashRetrievalError extends TaquitoError {
  constructor() {
    super();
    this.name = 'PublicKeyHashRetrievalError';
    this.message = 'Unable to retrieve Public Key Hash from Ledger';
  }
}

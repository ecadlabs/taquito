export { InvalidDerivationPathError } from '@taquito/core';

/**
 *  @category Error
 *  @description Error that indicates an invalid or unparseable ledger response
 */
export class InvalidLedgerResponseError extends Error {
  public name = 'InvalidLedgerResponseError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates a failure when trying to retrieve a Public Key from Ledger signer
 */
export class PublicKeyRetrievalError extends Error {
  public name = 'PublicKeyRetrievalError';
  constructor() {
    super(`Unable to retrieve Public Key from Ledger`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates a failure when trying to retrieve a Public Key Hash from Ledger signer
 */
export class PublicKeyHashRetrievalError extends Error {
  public name = 'PublicKeyHashRetrievalError';
  constructor() {
    super(`Unable to retrieve Public Key Hash from Ledger`);
  }
}

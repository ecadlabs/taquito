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

/**
 *  @category Error
 *  @description Error that indicates an invalid derivation type being passed or used
 */
export class InvalidDerivationTypeError extends Error {
  public name = 'InvalidDerivationTypeError';
  constructor(public derivationType: string) {
    super(
      `The derivation type ${derivationType} is invalid. The derivation type must be DerivationType.ED25519, DerivationType.SECP256K1, DerivationType.P256 or DerivationType.BIP32_ED25519`
    );
  }
}

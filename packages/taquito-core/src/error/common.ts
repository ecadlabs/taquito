import {
  ParameterValidationError,
  PermissionDeniedError,
  UnsupportedAction,
  ValidationError,
} from './errors';

/**
 *  @category Error
 *  @description Error that indicates an invalid address being passed or used (both contract and implicit)
 */
export class InvalidAddressError extends ParameterValidationError {
  public name = 'InvalidAddressError';
  constructor(public address: string, errorDetail?: string) {
    super(
      errorDetail
        ? `The address '${address}' is invalid. ${errorDetail}`
        : `The address '${address}' is invalid.`
    );
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid derivation path being passed or used
 */
export class InvalidDerivationPathError extends ParameterValidationError {
  public name = 'InvalidDerivationPathError';
  constructor(public message: string) {
    super(message);
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

/**
 *  @category Error
 *  @description Error that indicates an invalid hex string being passed or used
 */
export class InvalidHexStringError extends ParameterValidationError {
  public name = 'InvalidHexStringError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid contract address being passed or used
 */
export class InvalidContractAddressError extends ParameterValidationError {
  public name = 'InvalidContractAddressError';
  constructor(public contractAddress: string) {
    super(`The contract address '${contractAddress}' is invalid`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid block hash being passed or used
 */
export class InvalidBlockHashError extends ValidationError {
  public name = 'InvalidBlockHashError';
  constructor(public blockHash: string) {
    super(`The block hash '${blockHash}' is invalid`);
  }
}

/**
 *   InvalidHexStringError,
 *   InvalidContractAddressError,
 *   InvalidKeyError,
 *   InvalidPublicKeyError,
 *   InvalidKeyHashError,
 *   InvalidOperationHashError,
 *   InvalidOperationKindError,
 *   DeprecationError,
 *   ProhibitedActionError,
 *   InvalidChainIdError,
 *
 * moved from taquito/utils
 */

/**
 *  @category Error
 *  @description Error that indicates an invalid key being passed or used
 */
export class InvalidKeyError extends ParameterValidationError {
  public name = 'InvalidKeyError';
  constructor(public key: string, public errorDetail?: string) {
    super(errorDetail ? `The key ${key} is invalid. ${errorDetail}` : `The key ${key} is invalid.`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an Invalid Public Key being passed or used
 */
export class InvalidPublicKeyError extends ParameterValidationError {
  public name = 'InvalidPublicKeyError';
  constructor(public publicKey: string, errorDetail?: string) {
    super(
      errorDetail
        ? `The public key '${publicKey}' is invalid. ${errorDetail}`
        : `The public key '${publicKey}' is invalid.`
    );
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid chain id being passed or used
 */
export class InvalidChainIdError extends ValidationError {
  public name = 'InvalidChainIdError';
  constructor(public chainId: string) {
    super(`The chain id '${chainId}' is invalid`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid key hash being passed or used
 */
export class InvalidKeyHashError extends ParameterValidationError {
  public name = 'InvalidKeyHashError';
  constructor(public keyHash: string) {
    super(`The public key hash '${keyHash}' is invalid`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid operation hash being passed or used
 */
export class InvalidOperationHashError extends ValidationError {
  public name = 'InvalidOperationHashError';
  constructor(public operationHash: string) {
    super(`The operation hash '${operationHash}' is invalid`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid operation kind being passed or used
 */
export class InvalidOperationKindError extends ParameterValidationError {
  public name = 'InvalidOperationKindError';
  constructor(public operationKind: string) {
    super(`The operation kind '${operationKind}' is unsupported`);
  }
}

/**
 *  @category Error
 *  @description General error that indicates something is no longer supported and/or deprecated
 */
export class DeprecationError extends UnsupportedAction {
  public name = 'DeprecationError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description General error that indicates an action is prohibited or not allowed
 */
export class ProhibitedActionError extends PermissionDeniedError {
  public name = 'ProhibitedActionError';
  constructor(public message: string) {
    super(message);
  }
}

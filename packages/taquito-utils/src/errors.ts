export {
  InvalidAddressError,
  InvalidBlockHashError,
  InvalidHexStringError,
  InvalidMessageError,
  InvalidKeyError,
  InvalidPublicKeyError,
  InvalidSignatureError,
} from '@taquito/core';

/**
 *  @category Error
 *  @description Error that indicates an invalid contract address being passed or used
 */
export class InvalidContractAddressError extends Error {
  public name = 'InvalidContractAddressError';
  constructor(public contractAddress: string) {
    super(`The contract address '${contractAddress}' is invalid`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid chain id being passed or used
 */
export class InvalidChainIdError extends Error {
  public name = 'InvalidChainIdError';
  constructor(public chainId: string) {
    super(`The chain id '${chainId}' is invalid`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid key hash being passed or used
 */
export class InvalidKeyHashError extends Error {
  public name = 'InvalidKeyHashError';
  constructor(public keyHash: string) {
    super(`The public key hash '${keyHash}' is invalid`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates invalid protocol hash being passed or used
 */
export class InvalidProtocolHashError extends Error {
  public name = 'InvalidProtocolHashError';
  constructor(public protocolHash: string) {
    super(`The protocol hash '${protocolHash}' is invalid`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid operation hash being passed or used
 */ export class InvalidOperationHashError extends Error {
  public name = 'InvalidOperationHashError';
  constructor(public operationHash: string) {
    super(`The operation hash '${operationHash}' is invalid`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid operation kind being passed or used
 */
export class InvalidOperationKindError extends Error {
  public name = 'InvalidOperationKindError';
  constructor(public operationKind: string) {
    super(`The operation kind '${operationKind}' is unsupported`);
  }
}

/**
 *  @category Error
 *  @description General error that indicates something is no longer supported and/or deprecated
 */
export class DeprecationError extends Error {
  public name = 'DeprecationError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description General error that indicates an action is prohibited or not allowed
 */
export class ProhibitedActionError extends Error {
  public name = 'ProhibitedActionError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description General error that indicates a failure when trying to convert data from one type to another
 */
export class ValueConversionError extends Error {
  public name = 'ValueConversionError';
  constructor(public value: string, public desiredType: string) {
    super(`Unable to convert ${value} to a ${desiredType}`);
  }
}

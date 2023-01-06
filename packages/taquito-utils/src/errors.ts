export { InvalidHexStringError, InvalidContractAddressError, InvalidAddressError, InvalidBlockHashError } from '@taquito/core';

/**
 *  @category Error
 *  @description Error that indicates an invalid key being passed or used
 */
export class InvalidKeyError extends Error {
  public name = 'InvalidKeyError';
  constructor(public key: string, public errorDetail?: string) {
    super();
    const baseMessage = `The key ${key} is invalid.`;
    this.message = errorDetail ? `${baseMessage} ${errorDetail}` : baseMessage;
  }
}

/**
 *  @category Error
 *  @description Error that indicates an Invalid Public Key being passed or used
 */
export class InvalidPublicKeyError extends Error {
  public name = 'InvalidPublicKeyError';
  constructor(public publicKey: string, errorDetail?: string) {
    super();
    const baseMessage = `The public key '${publicKey}' is invalid.`;
    this.message = errorDetail ? `${baseMessage} ${errorDetail}` : baseMessage;
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid signature being passed or used
 */
export class InvalidSignatureError extends Error {
  public name = 'InvalidSignatureError';
  constructor(public signature: string, errorDetail?: string) {
    super();
    const baseMessage = `The signature '${signature}' is invalid.`;
    this.message = errorDetail ? `${baseMessage} ${errorDetail}` : baseMessage;
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid message being passed or used
 */
export class InvalidMessageError extends Error {
  public name = 'InvalidMessageError';
  constructor(public msg: string, public errorDetail?: string) {
    super();
    const baseMessage = `The message '${msg}' is invalid.`;
    this.message = errorDetail ? `${baseMessage} ${errorDetail}` : baseMessage;
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



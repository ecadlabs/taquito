import { ValidationError } from '@taquito/core';

export {
  InvalidHexStringError,
  InvalidContractAddressError,
  InvalidKeyError,
  InvalidPublicKeyError,
  InvalidKeyHashError,
  InvalidOperationHashError,
  InvalidOperationKindError,
  DeprecationError,
  ProhibitedActionError,
  InvalidChainIdError,
} from '@taquito/core';

/**
 *  @category Error
 *  @description Error that indicates an invalid signature being passed or used
 */
export class InvalidSignatureError extends ValidationError {
  public name = 'InvalidSignatureError';
  constructor(public signature: string, errorDetail?: string) {
    super(
      errorDetail
        ? `The signature '${signature}' is invalid. ${errorDetail}`
        : `The signature '${signature}' is invalid.`
    );
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid message being passed or used
 */
export class InvalidMessageError extends ValidationError {
  public name = 'InvalidMessageError';
  constructor(public msg: string, public errorDetail?: string) {
    super(
      errorDetail
        ? `The message '${msg}' is invalid. ${errorDetail}`
        : `The message '${msg}' is invalid.`
    );
  }
}

// NOT USED
/**
 *  @category Error
 *  @description Error that indicates invalid protocol hash being passed or used
 */
export class InvalidProtocolHashError extends ValidationError {
  public name = 'InvalidProtocolHashError';
  constructor(public protocolHash: string) {
    super(`The protocol hash '${protocolHash}' is invalid`);
  }
}

/**
 *  @category Error
 *  @description General error that indicates a failure when trying to convert data from one type to another
 */
export class ValueConversionError extends ValidationError {
  public name = 'ValueConversionError';
  constructor(public value: string, public desiredType: string) {
    super(`Unable to convert ${value} to a ${desiredType}`);
  }
}

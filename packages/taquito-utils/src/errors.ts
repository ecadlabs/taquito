import { ParameterValidationError, UnsupportedActionError } from '@taquito/core';

export {
  InvalidAddressError,
  InvalidBlockHashError,
  InvalidHexStringError,
  InvalidMessageError,
  InvalidKeyError,
  InvalidPublicKeyError,
  InvalidSignatureError,
  InvalidContractAddressError,
  InvalidChainIdError,
  InvalidKeyHashError,
  InvalidOperationHashError,
  InvalidOperationKindError,
  DeprecationError,
  ProhibitedActionError,
} from '@taquito/core';

/**
 *  @category Error
 *  @description Error indicates invalid protocol hash being passed or used
 */
export class InvalidProtocolHashError extends ParameterValidationError {
  public name = 'InvalidProtocolHashError';
  constructor(public protocolHash: string, errorDetails?: string) {
    super();
    this.name = 'InvalidProtocolHashError';
    this.message = `The protocol hash '${protocolHash}' is invalid`;
    errorDetails ? (this.message += `: ${errorDetails}`) : null;
  }
}

/**
 *  @category Error
 *  @description Error indicates unable to convert data type from one to another
 */
export class ValueConversionError extends UnsupportedActionError {
  constructor(public value: string, public desiredType: string) {
    super();
    this.name = 'ValueConversionError';
    this.message = `Unable to convert ${value} to a ${desiredType}`;
  }
}

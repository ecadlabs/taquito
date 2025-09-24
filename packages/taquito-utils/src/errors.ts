import { ParameterValidationError, UnsupportedActionError, ValidationResult } from '@taquito/core';

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
 *  @description Error that indicates invalid protocol hash being passed or used
 */
export class InvalidProtocolHashError extends ParameterValidationError {
  public name = 'InvalidProtocolHashError';
  constructor(public readonly protocolHash: string, errorDetails?: string | ValidationResult) {
    super(`The protocol hash '${protocolHash}' is invalid`, errorDetails);
    this.name = this.constructor.name;
  }
}

/**
 *  @category Error
 *  @description Error that indicates unable to convert data type from one to another
 */
export class ValueConversionError extends UnsupportedActionError {
  constructor(public readonly value: string, public readonly desiredType: string) {
    super(`Unable to convert ${value} to a ${desiredType}`);
    this.name = this.constructor.name;
  }
}

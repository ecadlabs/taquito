import { TaquitoUtilsError } from '@taquito/core';

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
  InvalidSignatureError,
} from '@taquito/core';

/**
 *  @category Error
 *  @description Error that indicates an invalid message being passed or used
 */
export class InvalidMessageError extends TaquitoUtilsError {
  public name = 'InvalidMessageError';
  constructor(public msg: string, public errorDetail?: string) {
    super(
      errorDetail
        ? `The message '${msg}' is invalid. ${errorDetail}`
        : `The message '${msg}' is invalid.`
    );
  }
}

/**
 *  @category Error
 *  @description General error that indicates a failure when trying to convert data from one type to another
 */
export class ValueConversionError extends TaquitoUtilsError {
  public name = 'ValueConversionError';
  constructor(public value: string, public desiredType: string) {
    super(`Unable to convert ${value} to a ${desiredType}`);
  }
}

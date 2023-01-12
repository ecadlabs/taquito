import { ParameterValidationError, PermissionDeniedError, UnsupportedAction } from '@taquito/core';

export { InvalidDerivationPathError, InvalidHexStringError } from '@taquito/core';

/**
 *  @category Error
 *  @description Error that indicates an invalid mnemonic being passed or used
 */
export class InvalidMnemonicError extends ParameterValidationError {
  public name = 'InvalidMnemonicError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid bit size being passed or used
 */
export class InvalidBitSize extends UnsupportedAction {
  public name = 'InvalidBitSize';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid curve being passed or used
 */
export class InvalidCurveError extends UnsupportedAction {
  public name = 'InvalidCurveError';
  constructor(public curve: string) {
    super(`This Curve is not supported: ${curve}`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid seed length being passed
 */
export class InvalidSeedLengthError extends ParameterValidationError {
  public name = 'InvalidSeedLengthError';
  constructor(public seedLength: number) {
    super(`The seed has an invalid length: ${seedLength}. This Mnemonic may not be acceptable for this curve`);
  }
}

/**
 *  @category Error
 *  @description Error involving the use of a private key
 */
export class PrivateKeyError extends PermissionDeniedError {
  public name = 'PrivateKeyError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that implements a current feature under development
 */
export class ToBeImplemented extends PermissionDeniedError {
  public name = 'ToBeImplemented';
  constructor() {
    super('This feature is under developement');
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid passphrase being passed or used
 */
export class InvalidPassphraseError extends Error {
  public name = 'InvalidPassphraseError';
  constructor(public message: string) {
    super(message);
  }
}

import { ParameterValidationError, UnsupportedActionError } from '@taquito/core';

/**
 *  @category Error
 *  @description Error that indicates an invalid Mnemonic being passed or used
 */
export class InvalidMnemonicError extends ParameterValidationError {
  constructor(public readonly mnemonic: string) {
    super();
    this.name = 'InvalidMnemonicError';
    this.message = `Invalid mnemonic "${mnemonic}"`;
  }
}

/**
 *  @category Error
 *  @description Error that indicates a curve with incorrect bit size being passed or used
 */
export class InvalidBitSize extends ParameterValidationError {
  constructor(public readonly message: string) {
    super();
    this.name = 'InvalidBitSize';
  }
}

/**
 *  @category Error
 *  @description Error that indicates an unsupported cureve being passed or used
 */
export class InvalidCurveError extends ParameterValidationError {
  constructor(public readonly message: string) {
    super();
    this.name = 'InvalidCurveError';
  }
}

/**
 *  @category Error
 *  @description Error that indicates a seed with invalid length being passed or used
 */
export class InvalidSeedLengthError extends ParameterValidationError {
  constructor(public readonly seedLength: number) {
    super();
    this.name = 'InvalidSeedLengthError';
    this.message = `Invalid seed length "${seedLength}" expecting length between 16 to 64.`;
  }
}

/**
 *  @category Error
 *  @description Error that indicates a feature still under developement
 */
export class ToBeImplemented extends UnsupportedActionError {
  constructor() {
    super();
    this.name = 'ToBeImplemented';
    this.message = 'This feature is under developement';
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid passphrase being passed or used
 */
export class InvalidPassphraseError extends ParameterValidationError {
  constructor(public readonly message: string) {
    super();
    this.name = 'InvalidPassphraseError';
  }
}

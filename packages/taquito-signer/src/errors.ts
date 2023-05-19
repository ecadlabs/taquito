import { ParameterValidationError } from '@taquito/core';

/**
 *  @category Error
 *  @description Error indicates an invalid Mnemonic being passed or used
 */
export class InvalidMnemonicError extends ParameterValidationError {
  constructor(public mnemonic: string) {
    super();
    this.name = 'InvalidMnemonicError';
    this.message = `Invalid mnemonic "${mnemonic}"`;
  }
}

/**
 *  @category Error
 *  @description Error indicates a curve with incorrect bit size being passed or used
 */
export class InvalidBitSize extends ParameterValidationError {
  constructor(public message: string) {
    super();
    this.name = 'InvalidBitSize';
  }
}

/**
 *  @category Error
 *  @description Error indicates an unsupported cureve being passed or used
 */
export class InvalidCurveError extends ParameterValidationError {
  constructor(public message: string) {
    super();
    this.name = 'InvalidCurveError';
  }
}

export class InvalidSeedLengthError extends Error {
  public name = 'InvalidSeedLengthError';
  constructor(public seedLength: number) {
    super(`The seed has an invalid length: ${seedLength}`);
  }
}

export class PrivateKeyError extends Error {
  public name = 'PrivateKeyError';
  constructor(public message: string) {
    super(message);
  }
}

export class ToBeImplemented extends Error {
  public name = 'ToBeImplemented';
  constructor() {
    super('This feature is under developement');
  }
}

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

export class InvalidBitSize extends Error {
  public name = 'InvalidBitSize';
  constructor(public message: string) {
    super(message);
  }
}

export class InvalidCurveError extends Error {
  public name = 'InvalidCurveError';
  constructor(public curve: string) {
    super(`This Curve is not supported: ${curve}`);
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

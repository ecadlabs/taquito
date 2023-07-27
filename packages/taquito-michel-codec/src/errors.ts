import { ParameterValidationError, TaquitoError } from '@taquito/core';
/**
 *  @category Error
 *  @description Error that indicates an invalid Michelson being passed or used
 */
export class InvalidMichelsonError extends ParameterValidationError {
  constructor(public readonly message: string) {
    super();
    this.name = 'InvalidMichelsonError';
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid type expression being passed or used
 */
export class InvalidTypeExpressionError extends ParameterValidationError {
  constructor(public readonly message: string) {
    super();
    this.name = 'InvalidTypeExpressionError';
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid data expression being passed or used
 */
export class InvalidDataExpressionError extends ParameterValidationError {
  constructor(public readonly message: string) {
    super();
    this.name = 'InvalidDataExpressionError';
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid contract entrypoint being referenced or passed
 */
export class InvalidEntrypointError extends ParameterValidationError {
  constructor(public readonly entrypoint?: string) {
    super();
    this.name = 'InvalidEntrypointError';
    this.message = `Contract has no entrypoint named: "${entrypoint}"`;
  }
}

/**
 *  @category Error
 *  @description Error that indicates a failure happening when trying to encode Tezos ID
 */
export class TezosIdEncodeError extends ParameterValidationError {
  constructor(public readonly message: string) {
    super();
    this.name = 'TezosIdEncodeError';
  }
}

/**
 *  @category Error
 *  @description Error that indicates a general error happening when trying to create a LongInteger
 */
export class LongIntegerError extends TaquitoError {
  constructor(public readonly message: string) {
    super();
    this.name = 'LongIntegerError';
  }
}

/**
 *  @category Error
 *  @description Error that indicates a failure occurring when trying to parse a hex byte
 */
export class HexParseError extends TaquitoError {
  constructor(public readonly hexByte: string) {
    super();
    this.name = 'HexParseError';
    this.message = `Unable to parse hex byte "${hexByte}"`;
  }
}

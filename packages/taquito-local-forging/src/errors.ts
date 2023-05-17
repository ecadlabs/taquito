import { ParameterValidationError } from '@taquito/core';
import { OperationContents } from '@taquito/rpc';
import { ENTRYPOINT_MAX_LENGTH } from './constants';

/**
 *  @category Error
 *  @description Error indicates an invalid operation content being passed or used
 */ export class InvalidOperationSchemaError extends ParameterValidationError {
  constructor(public operation: OperationContents, errorDetail?: string) {
    super();
    this.name = 'InvalidOperationSchemaError';
    this.message = `Invalid operation content recevied`;
    errorDetail ? (this.message += ` ${errorDetail}.`) : '';
  }
}

/**
 *  @category Error
 *  @description Error indicates an entrypoint name exceeding maximum length
 */
export class OversizedEntryPointError extends ParameterValidationError {
  constructor(public entrypoint: string) {
    super();
    this.name = 'OversizedEntryPointError';
    this.message = `Invalid entrypoint length "${entrypoint.length}", maximum length is "${ENTRYPOINT_MAX_LENGTH}".`;
  }
}

/**
 *  @category Error
 *  @description Error indicates an invalid ballot value being used
 */
export class InvalidBallotValueError extends ParameterValidationError {
  constructor(public ballotValue: string) {
    super();
    this.name = 'InvalidBallotValueError';
    this.message = `Invalid ballot value "${ballotValue}" expecting one of the following: "yay", "nay", "pass".`;
  }
}

/**
 *  @category Error
 *  @description Error indicates a failure when trying to decode ballot value
 */
export class DecodeBallotValueError extends ParameterValidationError {
  constructor(public ballotValue: string) {
    super();
    this.name = 'DecodeBallotValueError';
    this.message = `Invalid ballot value "${ballotValue}", cannot be decoded.`;
  }
}

/**
 *  @category Error
 *  @description Error indicates unexpected Michelson Value being passed or used
 */
export class UnexpectedMichelsonValueError extends ParameterValidationError {
  constructor(public value: string) {
    super();
    this.name = 'UnexpectedMichelsonValueError';
    this.message = `Invalid Michelson value "${value}", unalbe to encode.`;
  }
}

/**
 *  @category Error
 *  @description Error indicates a failure when trying to decode an operation
 */
export class OperationDecodingError extends ParameterValidationError {
  constructor(public message: string) {
    super();
    this.name = 'OperationDecodingError';
  }
}

/**
 *  @category Error
 *  @description Error that indicates a failure when trying to encode an operation
 */
export class OperationEncodingError extends Error {
  public name = 'OperationEncodingError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an unsupported operation being passed or used
 */
export class UnsupportedOperationError extends Error {
  public name = 'UnsupportedOperationError';
  constructor(public op: string) {
    super(`The operation '${op}' is unsupported`);
  }
}

/**
 * @cateogry Error
 * @description Error that indicates an unsupported pvm being passed or used
 */
export class UnsupportedPvmKindError extends Error {
  public name = 'UnsupportedPvmKindError';
  constructor(public pvm: string) {
    super(`The Pvm "${pvm}" is not supported`);
  }
}

/**
 * @category Error
 * @description Error that indicates an unsupported decoded pvm
 */
export class DecodePvmKindError extends Error {
  public name = 'DecodePvmKindError';
  constructor(public pvm: string) {
    super(`The encoded Pvm ${pvm} is not supported`);
  }
}

/**
 * @category Error
 * @description Error that indicates an invalid Smart Rollup Address (sr1)
 */
export class InvalidSmartRollupAddressError extends Error {
  public name = 'InvalidSmartRollupContractAddress';
  constructor(public address: string) {
    super(`The Smart Rollup Contract Address: ${address} is invalid`);
  }
}

/**
 * @category Error
 * @description Error that indicates an invalid Smart Rollup Contract Address (src1)
 */
export class InvalidSmartRollupContractAddressError extends Error {
  public name = 'InvalidSmartRollupContractAddress';
  constructor(public address: string) {
    super(`The Smart Rollup Contract Address: ${address} is invalid`);
  }
}

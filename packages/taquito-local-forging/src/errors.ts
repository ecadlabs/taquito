import { ParameterValidationError } from '@taquito/core';
import { OperationContents } from '@taquito/rpc';
import { ENTRYPOINT_MAX_LENGTH } from './constants';

/**
 *  @category Error
 *  @description Error indicates an invalid operation content being passed or used
 */ export class InvalidOperationSchemaError extends ParameterValidationError {
  constructor(public readonly operation: OperationContents, public readonly errorDetail?: string) {
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
  constructor(public readonly entrypoint: string) {
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
  constructor(public readonly ballotValue: string) {
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
  constructor(public readonly ballotValue: string) {
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
  constructor(public readonly value: string) {
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
  constructor(public readonly message: string) {
    super();
    this.name = 'OperationDecodingError';
  }
}

/**
 *  @category Error
 *  @description Error indicates a failure when trying to encode an operation
 */
export class OperationEncodingError extends ParameterValidationError {
  constructor(public readonly message: string) {
    super();
    this.name = 'OperationEncodingError';
  }
}

/**
 *  @category Error
 *  @description Error indicates an unsupported operation being passed or used
 */
export class UnsupportedOperationError extends ParameterValidationError {
  constructor(public readonly op: string) {
    super();
    this.name = 'UnsupportedOperationError';
    this.message = `Unsupported operation "${op}", can submit an issue on our github for feature request.`;
  }
}

/**
 * @cateogry Error
 * @description Error indicates an unsupported pvm being passed or used
 */
export class UnsupportedPvmKindError extends ParameterValidationError {
  constructor(public readonly pvm: string) {
    super();
    this.name = 'UnsupportedPvmKindError';
    this.message = `Invalid Pvm kind "${pvm}" expecting either "arith" or "wasm_2_0_0".`;
  }
}

/**
 * @category Error
 * @description Error indicates an unsupported pvm to decode
 */
export class DecodePvmKindError extends ParameterValidationError {
  constructor(public readonly pvm: string) {
    super();
    this.name = 'DecodePvmKindError';
    this.message = `Invalid Pvm kind "${pvm}", cannot be decoded.`;
  }
}

/**
 * @category Error
 * @description Error indicates an invalid Smart Rollup Address (sr1)
 */
export class InvalidSmartRollupAddressError extends ParameterValidationError {
  constructor(public readonly address: string, public readonly errorDetail?: string) {
    super();
    this.name = 'InvalidSmartRollupAddress';
    this.message = `Invalid smart rollup address "${address}"`;
    errorDetail ? (this.message += ` ${errorDetail}.`) : '';
  }
}

/**
 * @category Error
 * @description Error indicates an invalid Smart Rollup commitment hash (src1)
 */
export class InvalidSmartRollupCommitmentHashError extends ParameterValidationError {
  constructor(public readonly hash: string, public readonly errorDetail?: string) {
    super();
    this.name = 'InvalidSmartRollupCommitmentHashError';
    this.message = `Invalid smart rollup commitment hash "${hash}"`;
    errorDetail ? (this.message += ` ${errorDetail}.`) : '';
  }
}

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
    errorDetail ? (this.message += ` ${errorDetail}`) : '';
  }
}

/**
 *  @category Error
 *  @description Error that indicates an entrypoint exceeding maximum size
 */
export class OversizedEntryPointError extends Error {
  public name = 'OversizedEntryPointError';
  constructor(public entrypoint: string) {
    super(
      `Oversized entrypoint: ${entrypoint}. The maximum length of entrypoint is ${ENTRYPOINT_MAX_LENGTH}`
    );
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid ballot value
 */
export class InvalidBallotValueError extends Error {
  public name = 'InvalidBallotValueError';
  constructor(public ballotValue: string) {
    super(`The ballot value '${ballotValue}' is invalid`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates a failure when trying to decode ballot value
 */
export class DecodeBallotValueError extends Error {
  public name = 'DecodeBallotValueError';
  constructor(public ballotValue: string) {
    super(`Failed to decode ballot value ${ballotValue}`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates unexpected Michelson Value being passed or used
 */
export class UnexpectedMichelsonValueError extends Error {
  public name = 'UnexpectedMichelsonValueError';
  constructor(public value: string) {
    super(`Failed to encode michelson value '${value}'`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates a failure when trying to decode an operation
 */
export class OperationDecodingError extends Error {
  public name = 'OperationDecodingError';
  constructor(public message: string) {
    super(message);
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

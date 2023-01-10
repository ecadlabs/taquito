import { ENTRYPOINT_MAX_LENGTH } from './constants';

/**
 *  @category Error
 *  @description Error that indicates an invalid block hash being passed or used
 */
export class InvalidBlockHashError extends Error {
  public name = 'InvalidBlockHashError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid operation schema being passed or used
 */ export class InvalidOperationSchemaError extends Error {
  public name = 'InvalidOperationSchemaError';
  constructor(public message: string) {
    super(message);
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
 *  @description Error that indicates an invalid hex string have been passed or used
 */
export class InvalidHexStringError extends Error {
  public name = 'InvalidHexStringError';
  constructor(public hexString: string) {
    super(`The hex string '${hexString}' is invalid`);
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

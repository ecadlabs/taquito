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

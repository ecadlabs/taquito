/**
 *  @category Error
 *  @description Error that indicates an invalid contract being passed or used
 */
export class InvalidContractError extends Error {
  public name = 'InvalidContractError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid type expression being passed or used
 */
export class InvalidTypeExpressionError extends Error {
  public name = 'InvalidTypeExpressionError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid data expression being passed or used
 */
export class InvalidDataExpressionError extends Error {
  public name = 'InvalidDataExpressionError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid contract entrypoint being referenced or passed
 */
export class InvalidEntrypointError extends Error {
  public name = 'InvalidEntrypointError';
  constructor(public entrypoint?: string) {
    super(`Contract has no entrypoint named: '${entrypoint}'`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates a failure happening when trying to encode Tezos ID
 */
export class TezosIdEncodeError extends Error {
  public name = 'TezosIdEncodeError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates a general error happening when trying to create a LongInteger
 */
export class LongIntegerError extends Error {
  public name = 'LongIntegerError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates a failure occurring when trying to parse a hex byte
 */
export class HexParseError extends Error {
  public name = 'HexParseError';
  constructor(public hexByte: string) {
    super(`Unable to parse hex byte: ${hexByte}`);
  }
}

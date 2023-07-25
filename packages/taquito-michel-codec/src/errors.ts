/**
 *  @category Error
 *  @description Error that indicates an invalid contract being passed or used
 */
export class InvalidContractError extends Error {
  public name = 'InvalidContractError';
  constructor(public readonly message: string) {
    super();
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid type expression being passed or used
 */
export class InvalidTypeExpressionError extends Error {
  public name = 'InvalidTypeExpressionError';
  constructor(public readonly message: string) {
    super();
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid data expression being passed or used
 */
export class InvalidDataExpressionError extends Error {
  public name = 'InvalidDataExpressionError';
  constructor(public readonly message: string) {
    super();
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid contract entrypoint being referenced or passed
 */
export class InvalidEntrypointError extends Error {
  constructor(public readonly entrypoint?: string) {
    super();
    this.name = 'InvalidEntrypointError';
    this.message = `Contract has no entrypoint named: '${entrypoint}'`;
  }
}

/**
 *  @category Error
 *  @description Error that indicates a failure happening when trying to encode Tezos ID
 */
export class TezosIdEncodeError extends Error {
  public name = 'TezosIdEncodeError';
  constructor(public readonly message: string) {
    super();
  }
}

/**
 *  @category Error
 *  @description Error that indicates a general error happening when trying to create a LongInteger
 */
export class LongIntegerError extends Error {
  public name = 'LongIntegerError';
  constructor(public readonly message: string) {
    super();
  }
}

/**
 *  @category Error
 *  @description Error that indicates a failure occurring when trying to parse a hex byte
 */
export class HexParseError extends Error {
  constructor(public readonly hexByte: string) {
    super();
    this.name = 'HexParseError';
    this.message = `Unable to parse hex byte: ${hexByte}`;
  }
}

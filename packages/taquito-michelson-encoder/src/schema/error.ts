/**
 *  @category Error
 *  @description Error that indicates a failure when encoding (transforming JS parameter into JSON Michelson)the parameter of the view
 */
export class ViewEncodingError extends Error {
  name = 'ViewEncodingError';

  constructor(public smartContractViewName: string, public originalError: any) {
    super(`Unable to encode the parameter of the view: ${smartContractViewName}.`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid on-chain view found on the script
 */
export class InvalidScriptError extends Error {
  name = 'InvalidScriptError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid RPC response being passed or used
 */
export class InvalidRpcResponseError extends Error {
  public name = 'InvalidRpcResponseError';
  constructor(public script: any) {
    super(`Invalid RPC response passed as argument(s)`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates a failure that occurred during encoding
 */
export class ParameterEncodingError extends Error {
  public name = 'ParameterEncodingError';
  constructor(public message: string, public args: any, public originalError: any) {
    super(`
      ${message}. Error encountered when trying to encode arguments: \n
      [${args}]
    `);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid big map schema being passed or used
 */
export class InvalidBigMapSchema extends Error {
  public name = 'InvalidBigMapSchema';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid big map diff being passed or used
 */
export class InvalidBigMapDiff extends Error {
  public name = 'InvalidBigMapDiff';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates a failure when trying to encode big maps
 */
export class BigMapEncodingError extends Error {
  public name = 'BigMapEncodingError';
  constructor(private obj: string, public details: any) {
    super(`Unable to encode ${obj}. ${details}`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates a failure when trying to encode storage
 */
export class StorageEncodingError extends Error {
  public name = 'StorageEncodingError';
  constructor(private obj: string, public details: any) {
    super(`Unable to encode ${obj}. ${details}`);
  }
}

/**
 *  @category Error
 *  @description General error that indicates a function not being passed a necessary argument
 */
export class MissingArgumentError extends Error {
  public name = 'MissingArgumentError';
  constructor(public message: string) {
    super(message);
  }
}

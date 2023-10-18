/* eslint-disable @typescript-eslint/no-explicit-any */

import { InvalidViewParameterError, TaquitoError } from '@taquito/core';

/**
 *  @category Error
 *  @description Error that indicates a failure when encoding (transforming JS parameter into JSON Michelson) the parameter of the view
 */
export class ParameterEncodingError extends InvalidViewParameterError {
  constructor(
    public readonly viewName: string,
    public readonly sigs: any,
    public readonly args: any,
    public readonly cause?: any
  ) {
    super(viewName, sigs, args, cause);
    this.name = 'ParameterEncodingError';
    this.message = `Could not encode parameter ${JSON.stringify(
      args
    )} received for name "${viewName}" expecting one of the following signatures ${JSON.stringify(
      sigs
    )}`;
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid on-chain view found on the script
 */
export class InvalidScriptError extends TaquitoError {
  name = 'InvalidScriptError';
  constructor(
    public readonly script: any,
    public readonly reason?: string
  ) {
    super();
    let message = `Invalid on-chain view found in the following script.`;
    if (reason) {
      message += ` Reason: ${reason}.`;
    }
    message += `Script: ${JSON.stringify(script)}`;
    this.message = message;
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid RPC response being passed or used
 */
export class InvalidRpcResponseError extends TaquitoError {
  public name = 'InvalidRpcResponseError';
  constructor(
    public readonly script: any,
    public readonly reason?: string
  ) {
    super();
    let message = `Invalid RPC response passed as argument(s).`;
    if (reason) {
      message += ` Reason: ${reason}.`;
    }
    message += ` Received: ${JSON.stringify(script)}`;
    this.message = message;
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid big map schema being passed or used
 */
export class InvalidBigMapSchemaError extends TaquitoError {
  public name = 'InvalidBigMapSchemaError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid big map diff being passed or used
 */
export class InvalidBigMapDiffError extends TaquitoError {
  public name = 'InvalidBigMapDiffError';
  constructor(
    public message: string,
    public readonly value: any
  ) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates a failure when trying to encode big maps
 */
export class BigMapEncodingError extends TaquitoError {
  public name = 'BigMapEncodingError';
  constructor(
    obj: 'key' | 'value',
    public readonly details: any,
    public readonly schema: any,
    public readonly value: any
  ) {
    super();
    this.message = `Unable to encode the big map ${obj}. Schema is: ${JSON.stringify(
      schema
    )}. The ${obj} is: ${JSON.stringify(value)}. Error details: ${details}`;
  }
}

/**
 *  @category Error
 *  @description Error that indicates a failure when trying to encode storage
 */
export class StorageEncodingError extends TaquitoError {
  public name = 'StorageEncodingError';
  constructor(
    obj: string,
    public details: any,
    public readonly schema: any,
    public readonly value: any,
    public readonly semantics?: any
  ) {
    super();
    this.message = `Unable to encode ${obj}. The schema is: ${JSON.stringify(
      schema
    )}, the value is: ${JSON.stringify(value)}.${
      semantics ? `And the semantic is: ${JSON.stringify(semantics)}` : ''
    }. Error details: ${details}`;
  }
}

/**
 *  @category Error
 *  @description General error that indicates a function not being passed a necessary argument
 */
export class MissingArgumentError extends TaquitoError {
  public name = 'MissingArgumentError';
  constructor(public message: string) {
    super(message);
  }
}

import { ParameterValidationError, RpcError } from '@taquito/core';
import { HttpResponseError } from '@taquito/http-utils';
import { MichelsonV1Expression } from '@taquito/rpc';

/**
 *  @category Error
 *  @description Error that indicates invalid smart contract parameters being passed or used
 */
export class InvalidParameterError extends ParameterValidationError {
  constructor(
    public readonly smartContractMethodName: string,
    public readonly sigs: any[],
    public readonly invalidParams: any[]
  ) {
    super();
    this.name = 'InvalidParameterError';
    this.message = `${smartContractMethodName} Received ${
      invalidParams.length
    } arguments while expecting one of the following signatures (${JSON.stringify(sigs)})`;
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid delegation source contract address being passed or used
 */
export class InvalidDelegationSource extends ParameterValidationError {
  constructor(public readonly source: string) {
    super();
    this.name = `InvalidDelegationSource`;
    this.message = `Since Babylon delegation source can no longer be a contract address ${source}. Please use the smart contract abstraction to set your delegate.`;
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid smart contract code parameter being passed or used
 */
export class InvalidCodeParameter extends ParameterValidationError {
  constructor(public readonly message: string, public readonly data: any) {
    super();
    this.name = 'InvalidCodeParameter';
  }
}

/**
 *  @category Error
 *  @description Error that indicates invalid smart contract init parameter being passed or used
 */
export class InvalidInitParameter extends ParameterValidationError {
  constructor(public readonly message: string, public readonly data: any) {
    super();
    this.name = 'InvalidInitParameter';
  }
}

/**
 *  @category Error
 *  @description Error that indicates a failure when conducting a view simulation
 */
export class ViewSimulationError extends RpcError {
  constructor(
    public readonly message: string,
    public readonly viewName: string,
    public readonly failWith?: MichelsonV1Expression,
    public readonly cause?: any
  ) {
    super();
    this.name = 'ViewSimulationError';
  }
}

export const validateAndExtractFailwith = (
  error: HttpResponseError
): MichelsonV1Expression | undefined => {
  if (isJsonString(error.body)) {
    const parsedError = JSON.parse(error.body);
    if (Array.isArray(parsedError) && 'with' in parsedError[parsedError.length - 1]) {
      return parsedError[parsedError.length - 1].with;
    }
  }
};

const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

/**
 *  @category Error
 *  @description Error that indicates invalid or unconfigured context when executing a view
 */
export class InvalidViewSimulationContext extends ParameterValidationError {
  constructor(public readonly info: string) {
    super();
    this.name = 'InvalidViewSimulationContext';
    this.message = `${info} Please configure the context of the view execution in the executeView method.`;
  }
}

/**
 *  @category Error
 *  @description Error that indicates a mistake happening during the reveal operation
 */
export class RevealOperationError extends RpcError {
  constructor(public readonly message: string) {
    super();
    this.name = 'RevealOperationError';
  }
}

/**
 *  @category Error
 *  @description Error that indicates a mistake in the parameters in the preparation of an Origination operation
 */
export class OriginationParameterError extends ParameterValidationError {
  constructor(public readonly message: string) {
    super();
    this.name;
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid balance being passed or used
 */
export class InvalidBalanceError extends ParameterValidationError {
  constructor(public readonly message: string) {
    super();
    this.name = 'InvalidBalanceError';
  }
}

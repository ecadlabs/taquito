import { ParameterValidationError, PermissionDeniedError, RpcError } from '@taquito/core';
import { HttpResponseError, STATUS_CODE } from '@taquito/http-utils';
import { MichelsonV1Expression } from '@taquito/rpc';

/**
 *  @category Error
 *  Error that indicates invalid smart contract parameters being passed or used
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
 *  Error that indicates an invalid delegation source contract address being passed or used
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
 *  Error that indicates an invalid smart contract code parameter being passed or used
 */
export class InvalidCodeParameter extends ParameterValidationError {
  constructor(
    public readonly message: string,
    public readonly data: any
  ) {
    super();
    this.name = 'InvalidCodeParameter';
  }
}

/**
 *  @category Error
 *  Error that indicates invalid smart contract init parameter being passed or used
 */
export class InvalidInitParameter extends ParameterValidationError {
  constructor(
    public readonly message: string,
    public readonly data: any
  ) {
    super();
    this.name = 'InvalidInitParameter';
  }
}

/**
 *  @category Error
 *  Error that indicates a failure when conducting a view simulation
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
 *  Error that indicates invalid or unconfigured context when executing a view
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
 *  Error that indicates a mistake happening during the reveal operation
 */
export class RevealOperationError extends RpcError {
  constructor(public readonly message: string) {
    super();
    this.name = 'RevealOperationError';
  }
}

/**
 *  @category Error
 *  Error that indicates a mistake in the parameters in the preparation of an Origination operation
 */
export class OriginationParameterError extends ParameterValidationError {
  constructor(public readonly message: string) {
    super();
    this.name;
  }
}

/**
 *  @category Error
 *  Error that indicates an invalid balance being passed or used
 */
export class InvalidBalanceError extends ParameterValidationError {
  constructor(public readonly message: string) {
    super();
    this.name = 'InvalidBalanceError';
  }
}

/**
 *  @category Error
 *  Error that indicates the RPC node refused to list big-map values (HTTP 401 or 403).
 *  Nodes using the default Octez RPC ACL allow big-map reads by key but deny value listing.
 */
export class BigMapValuesAccessDeniedError extends PermissionDeniedError {
  constructor(
    public readonly bigMapId: string,
    public readonly status: STATUS_CODE,
    public readonly url: string,
    public readonly cause: HttpResponseError
  ) {
    super();
    this.name = 'BigMapValuesAccessDeniedError';
    this.message =
      `The RPC node refused to list the values of big map ${bigMapId} (HTTP ${status} from ${url}). ` +
      `Nodes using the default Octez RPC ACL deny GET /chains/*/blocks/*/context/big_maps/* and only allow reads by key. ` +
      `Use an RPC node whose ACL allows that endpoint, read known keys with BigMapAbstraction.get() or getMultipleValues(), or use an indexer.`;
  }
}

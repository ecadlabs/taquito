import { HttpResponseError } from '@taquito/http-utils';
import { MichelsonV1Expression } from '@taquito/rpc';

/**
 *  @category Error
 *  @description Error that indicates invalid smart contract parameters being passed or used
 */
export class InvalidParameterError extends Error {
  name = 'Invalid parameters error';
  constructor(public smartContractMethodName: string, public sigs: any[], public args: any[]) {
    super(
      `${smartContractMethodName} Received ${
        args.length
      } arguments while expecting one of the following signatures (${JSON.stringify(sigs)})`
    );
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid delegation source contract address being passed or used
 */
export class InvalidDelegationSource extends Error {
  name = 'Invalid delegation source error';

  constructor(public source: string) {
    super(
      `Since Babylon delegation source can no longer be a contract address ${source}. Please use the smart contract abstraction to set your delegate.`
    );
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid smart contract code parameter being passed or used
 */
export class InvalidCodeParameter extends Error {
  public name = 'InvalidCodeParameter';
  constructor(public message: string, public readonly data: any) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates invalid smart contract init parameter being passed or used
 */
export class InvalidInitParameter extends Error {
  public name = 'InvalidInitParameter';
  constructor(public message: string, public readonly data: any) {
    super(message);
  }
}

// change class for more accurate name since other InvalidViewParameterError is fundamentally different
/**
 *  @category Error
 *  @description Error that indicates invalid view parameter of a smart contract
 */
export class InvalidContractViewParameterError extends Error {
  name = 'Invalid contract view parameters error';
  cause: any;
  constructor(
    public smartContractViewName: string,
    public sigs: any,
    public args: any,
    public originalError: any
  ) {
    super(
      `Unable to encode the parameter of the view: ${smartContractViewName}. Received ${args} as parameter while expecting one of the following signatures (${JSON.stringify(
        sigs
      )})`
    );
    this.cause = originalError;
  }
}

/**
 *  @category Error
 *  @description Error that indicates a failure when conducting a view simulation
 */
export class ViewSimulationError extends Error {
  name = 'ViewSimulationError';
  constructor(
    public message: string,
    public viewName: string,
    public failWith?: MichelsonV1Expression,
    public originalError?: any
  ) {
    super(message);
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
export class InvalidViewSimulationContext extends Error {
  public name = 'InvalidViewSimulationContext';
  constructor(public info: string) {
    super(`${info} Please configure the context of the view execution in the executeView method.`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates a mistake happening during the reveal operation
 */
export class RevealOperationError extends Error {
  public name = 'RevealOperationError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates a mistake in the parameters in the preparation of an Origination operation
 */
export class OriginationParameterError extends Error {
  public name = 'OriginationParameterError';
  constructor(public message: string) {
    super(message);
  }
}

export class IntegerError extends Error {
  public name = 'IntegerError';
  constructor(public message: string) {
    super(message);
  }
}

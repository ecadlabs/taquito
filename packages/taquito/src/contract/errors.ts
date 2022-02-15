import { HttpResponseError } from '@taquito/http-utils';
import { MichelsonV1Expression } from '@taquito/rpc';

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

export class UndefinedLambdaContractError extends Error {
  name = 'Undefined LambdaContract error';
  constructor() {
    super(
      'This might happen if you are using a sandbox. Please provide the address of a lambda contract as a parameter of the read method.'
    );
  }
}
export class InvalidDelegationSource extends Error {
  name = 'Invalid delegation source error';

  constructor(public source: string) {
    super(
      `Since Babylon delegation source can no longer be a contract address ${source}. Please use the smart contract abstraction to set your delegate.`
    );
  }
}

export class InvalidCodeParameter extends Error {
  public name = 'InvalidCodeParameter';
  constructor(public message: string, public readonly data: any) {
    super(message);
  }
}

export class InvalidInitParameter extends Error {
  public name = 'InvalidInitParameter';
  constructor(public message: string, public readonly data: any) {
    super(message);
  }
}

export class InvalidViewParameterError extends Error {
  name = 'Invalid view parameters error';
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

export class InvalidViewSimulationContext extends Error {
  public name = 'InvalidViewSimulationContext';
  constructor(public info: string) {
    super(`${info} Please configure the context of the view execution in the executeView method.`);
  }
}

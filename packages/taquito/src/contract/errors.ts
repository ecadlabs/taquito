import { HttpResponseError } from "@taquito/http-utils";
import { MichelsonV1Expression } from "@taquito/rpc";

export class InvalidParameterError implements Error {
  name: string = 'Invalid parameters error';
  message: string;
  constructor(public smartContractMethodName: string, public sigs: any[], public args: any[]) {
    this.message = `${smartContractMethodName} Received ${
      args.length
    } arguments while expecting one of the following signatures (${JSON.stringify(sigs)})`;
  }
}

export class UndefinedLambdaContractError implements Error {
  name: string = 'Undefined LambdaContract error';
  message: string;
  constructor() {
    this.message = "This might happen if you are using a sandbox. Please provide the address of a lambda contract as a parameter of the read method.";
  }
}
export class InvalidDelegationSource implements Error {
  name: string = 'Invalid delegation source error';
  message: string;

  constructor(public source: string) {
    this.message = `Since Babylon delegation source can no longer be a contract address ${source}. Please use the smart contract abstraction to set your delegate.`;
  }
}

export class InvalidCodeParameter implements Error {
  public name: string = 'InvalidCodeParameter';
  constructor(public message: string, public readonly data: any) { }
}

export class InvalidInitParameter implements Error {
  public name: string = 'InvalidInitParameter';
  constructor(public message: string, public readonly data: any) { }
}

export class InvalidViewParameterError implements Error {
  name: string = 'Invalid view parameters error';
  message: string;
  cause: any
  constructor(public smartContractViewName: string, public sigs: any, public args: any, public originalError: any) {
    this.message = `Unable to encode the parameter of the view: ${smartContractViewName}. Received ${args
      } as parameter while expecting one of the following signatures (${JSON.stringify(sigs)})`;
    this.cause = originalError;
  }
}

export class ViewSimulationError implements Error {
  name: string = 'ViewSimulationError';
  constructor(public message: string, public originalError?: any) {}
}

export const validateAndExtractFailwith = (error: HttpResponseError): MichelsonV1Expression | undefined => {
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
}

export class InvalidViewSimulationContext implements Error {
  public name: string = 'InvalidViewSimulationContext';
  public message: string;
  constructor(public info: string) {
    this.message = `${info} Please configure the context of the view execution in the executeView method.`
  }
}

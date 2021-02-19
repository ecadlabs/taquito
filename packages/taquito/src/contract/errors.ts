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

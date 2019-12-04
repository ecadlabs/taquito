import { computeLength } from './utils';

export class InvalidParameterError implements Error {
  name: string = 'Invalid parameters error';
  message: string;
  constructor(
    public smartContractMethodName: string,
    public smartContractMethodSchema: object,
    public args: any[]
  ) {
    this.message = `${smartContractMethodName} Received ${
      args.length
    } arguments while expecting ${computeLength(smartContractMethodSchema)} (${JSON.stringify(
      Object.keys(smartContractMethodSchema)
    )})`;
  }
}

export class InvalidDelegationSource implements Error {
  name: string = 'Invalid delegation source error';
  message: string;

  constructor(public source: string) {
    this.message = `Since Babylon delegation source can no longer be a contract address ${source}. Please use the smart contract abstraction to set your delegate.`;
  }
}

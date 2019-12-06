export class InvalidParameterError implements Error {
  name: string = 'Invalid parameters error';
  message: string;
  constructor(public smartContractMethodName: string, public sigs: any[], public args: any[]) {
    this.message = `${smartContractMethodName} Received ${
      args.length
    } arguments while expecting on of the follow signatures (${JSON.stringify(sigs)})`;
  }
}

export class InvalidDelegationSource implements Error {
  name: string = 'Invalid delegation source error';
  message: string;

  constructor(public source: string) {
    this.message = `Since Babylon delegation source can no longer be a contract address ${source}. Please use the smart contract abstraction to set your delegate.`;
  }
}

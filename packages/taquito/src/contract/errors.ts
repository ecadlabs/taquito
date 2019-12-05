export class InvalidParameterError implements Error {
  name: string = 'Invalid parameters error';
  message: string;
  constructor(public smartContractMethodName: string, public sigs: any[], public args: any[]) {
    this.message = `${smartContractMethodName} Received ${
      args.length
    } arguments while expecting on of the follow signatures (${JSON.stringify(sigs)})`;
  }
}

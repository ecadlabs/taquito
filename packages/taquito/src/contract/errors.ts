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

export class ViewEncodingError extends Error {
  name = 'ViewEncodingError';

  constructor(public smartContractViewName: string, public originalError: any) {
    super(`Unable to encode the parameter of the view: ${smartContractViewName}.`);
  }
}

export class InvalidScriptError extends Error {
  name = 'InvalidScriptError';
  constructor(public message: string) {
    super(message);
  }
}

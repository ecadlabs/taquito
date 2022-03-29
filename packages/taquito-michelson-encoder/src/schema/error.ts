/**
 *  @category Error
 *  @description Error that indicagtes a failure when encoding the parameter of the view
 */
export class ViewEncodingError extends Error {
  name = 'ViewEncodingError';

  constructor(public smartContractViewName: string, public originalError: any) {
    super(`Unable to encode the parameter of the view: ${smartContractViewName}.`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid on-chain view found on the script
 */
export class InvalidScriptError extends Error {
  name = 'InvalidScriptError';
  constructor(public message: string) {
    super(message);
  }
}

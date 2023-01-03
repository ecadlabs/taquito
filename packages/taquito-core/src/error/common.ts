/**
 *  @category Error
 *  @description Error that indicates an invalid address being passed or used (both contract and implicit)
 */
export class InvalidAddressError extends Error {
  public name = 'InvalidAddressError';
  constructor(public address: string, errorDetail?: string) {
    super();
    const baseMessage = `The address '${address}' is invalid.`;
    this.message = errorDetail ? `${baseMessage} ${errorDetail}` : baseMessage;
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid derivation path being passed or used
 */
export class InvalidDerivationPathError extends Error {
  public name = 'InvalidDerivationPathError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid hex string being passed or used
 */
export class InvalidHexStringError extends Error {
  public name = 'InvalidHexStringError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid contract address being passed or used
 */
export class InvalidContractAddressError extends Error {
  public name = 'InvalidContractAddressError';
  constructor(public contractAddress: string) {
    super(`The contract address '${contractAddress}' is invalid`);
  }
}

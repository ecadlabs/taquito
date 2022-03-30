/**
 *  @category Error
 *  @description Error that indicates an Invalid Public Key being passed or used
 */
export class InvalidPublicKeyError extends Error {
  public name = 'InvalidPublicKeyError';
  constructor(public publicKey: string, errorDetail?: string) {
    super(`The public key '${publicKey}' is invalid. ${errorDetail}`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid signature being passed or used
 */
export class InvalidSignatureError extends Error {
  public name = 'InvalidSignatureError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid message being passed or used
 */
export class InvalidMessageError extends Error {
  public name = 'InvalidMessageError';
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

/**
 *  @category Error
 *  @description Error that indicates an invalid address being passed or used (both contract and implicit)
 */
export class InvalidAddressError extends Error {
  public name = 'InvalidAddressError';
  constructor(public address: string) {
    super(`The address '${address}' is invalid`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid chain id being passed or used
 */
export class InvalidChainIdError extends Error {
  public name = 'InvalidChainIdError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid key hash being passed or used
 */
export class InvalidKeyHashError extends Error {
  public name = 'InvalidKeyHashError';
  constructor(public keyHash: string) {
    super(`The public key hash '${keyHash}' is invalid`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid block hash being passed or used
 */ export class InvalidBlockHashError extends Error {
  public name = 'InvalidBlockHashError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates invalid protocol hash being passed or used
 */
export class InvalidProtocolHashError extends Error {
  public name = 'InvalidProtocolHashError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid operation hash being passed or used
 */ export class InvalidOperationHashError extends Error {
  public name = 'InvalidOperationHashError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid operation kind being passed or used
 */
export class InvalidOperationKindError extends Error {
  public name = 'InvalidOperationKindError';
  constructor(public message: string) {
    super(message);
  }
}

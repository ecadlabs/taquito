// ==========================================================================================
// parent error classes for Taquito
// ==========================================================================================
/**
 *  @category Error
 *  @description Parent error class all taquito errors to extend from
 */
export class TaquitoError extends Error {}

/**
 *  @category Error
 *  @description Error indicates invalid user inputs
 */
export class ParameterValidationError extends TaquitoError {}

/**
 *  @category Error
 *  @description Error returned by RPC node
 */
export class RpcError extends TaquitoError {}

/**
 *  @category Error
 *  @description Error indicates TezosToolKit has not been configured appropriately
 */
export class TezosToolkitConfigError extends TaquitoError {}

/**
 *  @category Error
 *  @description Error indicates a requested action is not supported by Taquito
 */
export class UnsupportedAction extends TaquitoError {}

/**
 *  @category Error
 *  @description Error returned by network
 */
export class NetworkError extends TaquitoError {}

/**
 *  @category Error
 *  @description Error indicates user attempts an action without necessary permissions
 */
export class PermissionDeniedError extends TaquitoError {}

// ==========================================================================================
// common error classes for Taquito
// ==========================================================================================
/**
 *  @category Error
 *  @description Error indicates an invalid originated or implicit address being passed or used
 */
export class InvalidAddressError extends ParameterValidationError {
  constructor(public address: string, errorDetail?: string) {
    super();
    this.name = 'InvalidAddressError';
    this.message = `Address "${address}" is invalid.`;
    errorDetail ? (this.message += ` ${errorDetail}`) : null;
  }
}

/**
 *  @category Error
 *  @description Error indicates an invalid block hash being passed or used
 */ export class InvalidBlockHashError extends ParameterValidationError {
  constructor(public blockHash: string) {
    super();
    this.name = 'InvalidBlockHashError';
    this.message = `Block hash "${blockHash}" is invalid.`;
  }
}

/**
 *  @category Error
 *  @description Error indicates an invalid derivation path being passed or used
 */
export class InvalidDerivationPathError extends ParameterValidationError {
  constructor(public derivationPath: string, errorDetail?: string) {
    super();
    this.name = 'InvalidDerivationPathError';
    this.message = `Derivation path "${derivationPath}" is invalid.`;
    errorDetail ? (this.message += ` ${errorDetail}`) : null;
  }
}

/**
 *  @category Error
 *  @description Error indicates an invalid hex string have been passed or used
 */
export class InvalidHexStringError extends ParameterValidationError {
  constructor(public hexString: string, errorDetail?: string) {
    super();
    this.name = 'InvalidHexStringError';
    this.message = `Hex string "${hexString}" is invalid.`;
    errorDetail ? (this.message += ` ${errorDetail}`) : null;
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid message being passed or used
 */
export class InvalidMessageError extends ParameterValidationError {
  constructor(public msg: string, errorDetail?: string) {
    super();
    this.name = 'InvalidMessageError';
    this.message = `Message "${msg}" is invalid.`;
    errorDetail ? (this.message += ` ${errorDetail}`) : null;
  }
}

/**
 *  @category Error
 *  @description Error indicates invalid view parameter of a smart contract
 */
export class InvalidViewParameterError extends ParameterValidationError {
  constructor(public viewName: string, public sigs: any, public args: any, public cause?: any) {
    super();
    this.name = 'InvalidViewParameterError';
    this.message = `view name: ${viewName} received arguments: ${JSON.stringify(
      args
    )} while expecting one of the following signatures: (${JSON.stringify(sigs)}).`;
  }
}

/**
 *  @category Error
 *  @description Error indicates an invalid key being passed or used
 */
export class InvalidKeyError extends ParameterValidationError {
  constructor(public key: string, public errorDetail?: string) {
    super();
    this.name = 'InvalidKeyError';
    this.message = `The key '${key}' is invalid.`;
    errorDetail ? (this.message += ` ${errorDetail}`) : null;
  }
}

/**
 *  @category Error
 *  @description Error indicates an Invalid Public Key being passed or used
 */
export class InvalidPublicKeyError extends ParameterValidationError {
  constructor(public publicKey: string, errorDetail?: string) {
    super();
    this.name = 'InvalidPublicKeyError';
    this.message = `The public key '${publicKey}' is invalid.`;
    errorDetail ? (this.message += ` ${errorDetail}`) : null;
  }
}

/**
 *  @category Error
 *  @description Error indicates an invalid signature being passed or used
 */
export class InvalidSignatureError extends ParameterValidationError {
  constructor(public signature: string, errorDetail?: string) {
    super();
    this.name = 'InvalidSignatureError';
    this.message = `The signature '${signature}' is invalid.`;
    errorDetail ? (this.message += ` ${errorDetail}`) : null;
  }
}

/**
 *  @category Error
 *  @description Error indicates an invalid contract address being passed or used
 */
export class InvalidContractAddressError extends ParameterValidationError {
  constructor(public contractAddress: string, errorDetail?: string) {
    super();
    this.name = 'InvalidContractAddressError';
    this.message = `The contract address '${contractAddress}' is invalid.`;
    errorDetail ? (this.message += ` ${errorDetail}`) : null;
  }
}

/**
 *  @category Error
 *  @description Error indicates an invalid chain id being passed or used
 */
export class InvalidChainIdError extends ParameterValidationError {
  constructor(public chainId: string, errorDetail?: string) {
    super();
    this.name = 'InvalidChainIdError';
    this.message = `The chain id '${chainId}' is invalid.`;
    errorDetail ? (this.message += ` ${errorDetail}`) : null;
  }
}

/**
 *  @category Error
 *  @description Error indicates an invalid public key hash being passed or used
 */
export class InvalidKeyHashError extends ParameterValidationError {
  constructor(public keyHash: string, errorDetail?: string) {
    super();
    this.name = 'InvalidKeyHashError';
    this.message = `The public key hash '${keyHash}' is invalid.`;
    errorDetail ? (this.message += ` ${errorDetail}`) : null;
  }
}

/**
 *  @category Error
 *  @description Error indicates an invalid operation hash being passed or used
 */ export class InvalidOperationHashError extends ParameterValidationError {
  constructor(public operationHash: string, errorDetail?: string) {
    super();
    this.name = 'InvalidOperationHashError';
    this.message = `The operation hash '${operationHash}' is invalid.`;
    errorDetail ? (this.message += ` ${errorDetail}`) : null;
  }
}

/**
 *  @category Error
 *  @description Error indicates an invalid operation kind being passed or used
 */
export class InvalidOperationKindError extends ParameterValidationError {
  constructor(public operationKind: string, errorDetail?: string) {
    super();
    this.name = 'InvalidOperationKindError';
    this.message = `The operation kind '${operationKind}' is unsupported.`;
    errorDetail ? (this.message += ` ${errorDetail}`) : null;
  }
}

/**
 *  @category Error
 *  @description General error that indicates something is no longer supported and/or deprecated
 */
export class DeprecationError extends UnsupportedAction {
  constructor(public message: string) {
    super();
    this.name = 'DeprecationError';
  }
}

/**
 *  @category Error
 *  @description General error that indicates an action is prohibited or not allowed
 */
export class ProhibitedActionError extends UnsupportedAction {
  constructor(public message: string) {
    super();
    this.name = 'ProhibitedActionError';
  }
}

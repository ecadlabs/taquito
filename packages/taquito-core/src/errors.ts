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
export class UnsupportedActionError extends TaquitoError {}

/**
 *  @category Error
 *  @description Error during a network operation
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
    this.message = `Invalid address "${address}"`;
    errorDetail ? (this.message += ` ${errorDetail}.`) : null;
  }
}

/**
 *  @category Error
 *  @description Error indicates an invalid block hash being passed or used
 */
export class InvalidBlockHashError extends ParameterValidationError {
  constructor(public blockHash: string, errorDetail?: string) {
    super();
    this.name = 'InvalidBlockHashError';
    this.message = `Invalid block hash "${blockHash}"`;
    errorDetail ? (this.message += ` ${errorDetail}.`) : null;
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
    this.message = `Invalid derivation path "${derivationPath}"`;
    errorDetail ? (this.message += ` ${errorDetail}.`) : null;
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
    this.message = `Invalid hex string "${hexString}"`;
    errorDetail ? (this.message += ` ${errorDetail}.`) : null;
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
    this.message = `Invalid message "${msg}"`;
    errorDetail ? (this.message += ` ${errorDetail}.`) : null;
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
    this.message = `Invalid view arguments ${JSON.stringify(
      args
    )} received for name "${viewName}" expecting one of the following signatures ${JSON.stringify(
      sigs
    )}.`;
  }
}

/**
 *  @category Error
 *  @description Error indicates an invalid private key being passed or used
 */
export class InvalidKeyError extends ParameterValidationError {
  constructor(public errorDetail?: string) {
    super();
    this.name = 'InvalidKeyError';
    this.message = `Invalid private key`;
    errorDetail ? (this.message += ` ${errorDetail}.`) : null;
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
    this.message = `Invalid public key "${publicKey}"`;
    errorDetail ? (this.message += ` ${errorDetail}.`) : null;
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
    this.message = `Invalid signature "${signature}"`;
    errorDetail ? (this.message += ` ${errorDetail}.`) : null;
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
    this.message = `Invalid contract address "${contractAddress}"`;
    errorDetail ? (this.message += ` ${errorDetail}.`) : null;
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
    this.message = `Invalid chain id "${chainId}"`;
    errorDetail ? (this.message += ` ${errorDetail}.`) : null;
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
    this.message = `Invalid public key hash "${keyHash}"`;
    errorDetail ? (this.message += ` ${errorDetail}.`) : null;
  }
}

/**
 *  @category Error
 *  @description Error indicates an invalid operation hash being passed or used
 */
export class InvalidOperationHashError extends ParameterValidationError {
  constructor(public operationHash: string, errorDetail?: string) {
    super();
    this.name = 'InvalidOperationHashError';
    this.message = `Invalid operation hash "${operationHash}"`;
    errorDetail ? (this.message += ` ${errorDetail}.`) : null;
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
    this.message = `Invalid operation kind "${operationKind}"`;
    errorDetail ? (this.message += ` ${errorDetail}.`) : null;
  }
}

/**
 *  @category Error
 *  @description General error that indicates something is no longer supported and/or deprecated
 */
export class DeprecationError extends UnsupportedActionError {
  constructor(public message: string) {
    super();
    this.name = 'DeprecationError';
  }
}

/**
 *  @category Error
 *  @description General error that indicates an action is prohibited or not allowed
 */
export class ProhibitedActionError extends UnsupportedActionError {
  constructor(public message: string) {
    super();
    this.name = 'ProhibitedActionError';
  }
}

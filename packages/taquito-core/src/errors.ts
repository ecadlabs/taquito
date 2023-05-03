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

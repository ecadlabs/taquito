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
 *  @description Error that indicates an invalid address being passed or used (both contract and implicit)
 */
export class InvalidAddressError extends Error {
  constructor(address: string, errorDetail?: string) {
    super();
    this.name = 'InvalidAddressError';
    this.message = errorDetail
      ? `${errorDetail!} address '${address}' is invalid.`
      : `address '${address}' is invalid.`;
  }
}

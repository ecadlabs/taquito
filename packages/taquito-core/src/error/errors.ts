/**
 *  @category Error
 *  @description Error that indicates an invalid user data input
 */
export class ParameterValidationError extends Error {
  public name = 'ParameterValidationError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error returned by RPC
 */
export class RpcError extends Error {
  public name = 'RpcError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates TezosToolKit has not been configured appropriately
 */
export class TezosToolkitConfigError extends Error {
  public name = 'TezosToolkitConfigError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an action is not supported by Taquito
 */
export class UnsupportedAction extends Error {
  public name = 'UnsupportedAction';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error returned by node / network
 */
export class NetworkError extends Error {
  public name = 'NetworkError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates
 */
export class PermissionDeniedError extends Error {
  public name = 'PermissionDeniedError';
  constructor(public message: string) {
    super(message);
  }
}

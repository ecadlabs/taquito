/**
 *  @category Error
 *  @description Error that indicates the data get from third party has incorrect format
 */
export class InternalValidationError extends Error {
  public name = 'InternalValidationError';
  public category = this.name;
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid user data input
 */
export class ParameterValidationError extends Error {
  public name = 'ParameterValidationError';
  public category = this.name;
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
  public category = this.name;
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
  public category = this.name;
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
  public category = this.name;
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
  public category = this.name;
  constructor(public message: string) {
    super(message);
  }
}

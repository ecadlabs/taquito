/**
 *  @category Error
 *  @description Original Error class that all high-level category errors extend from
 */
export class TaquitoError extends Error {
  public name = 'TaquitoError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates invalid data being fetched from other services
 */
export class InternalValidationError extends TaquitoError {
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
export class ParameterValidationError extends TaquitoError {
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
export class RpcError extends TaquitoError {
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
export class TezosToolkitConfigError extends TaquitoError {
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
export class UnsupportedAction extends TaquitoError {
  public name = 'UnsupportedAction';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error returned by node / network
 */
export class NetworkError extends TaquitoError {
  public name = 'NetworkError';
  public category = this.name;
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that permission deneied for a certain action
 */
export class PermissionDeniedError extends TaquitoError {
  public name = 'PermissionDeniedError';
  public category = this.name;
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error with Http services
 */
export class HttpError extends TaquitoError {
  public name = 'HttpError';
  public category = this.name;
  constructor(public message: string) {
    super(message);
  }
}

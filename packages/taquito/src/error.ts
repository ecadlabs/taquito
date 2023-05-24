/**
 *  @category Error
 *  @description Error that indicates invalid confirmation count has been passed or configured
 */
export class InvalidConfirmationCountError extends Error {
  public name = 'InvalidConfirmationCountError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates undefined confirmation has not been specified or configured
 */
export class ConfirmationUndefinedError extends Error {
  public name = 'ConfirmationUndefinedError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid filter expression being passed or used
 */
export class InvalidFilterExpressionError extends Error {
  public name = 'InvalidFilterExpressionError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an error being returned from the RPC response
 */
export class RPCResponseError extends Error {
  public name = 'RPCResponseError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates invalid Preparation parameters being passed
 */
export class InvalidPrepareParamsError extends Error {
  public name = 'InvalidOperationParamsError';
  constructor(public opKind: string) {
    super(`No '${opKind}' operation parameters have been passed`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates invalid Preparation parameters being passed
 */
export class PublicKeyNotFoundError extends Error {
  public name = 'PublicKeyNotFoundError';
  constructor() {
    super(
      `Unable to retrieve public key from signer. If you are using a wallet, make sure your account is revealed`
    );
  }
}

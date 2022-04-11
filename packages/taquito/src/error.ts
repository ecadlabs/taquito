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

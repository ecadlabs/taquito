/**
 *  @category Error
 *  @description Error that indicates invalid confirmation count has been returned
 */
export class InvalidConfirmationCountError extends Error {
  public name = 'InvalidConfirmationCountError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates undefined confirmation has been returned
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

/**
 *  @category Error
 *  @description Error that indicates a failure in grabbing the public key
 */
export class KeyNotFoundError extends Error {
  public name = 'KeyNotFoundError';
  constructor(public message: string, public innerException: any) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an unauthorized operation being attempted
 */
export class OperationNotAuthorizedError extends Error {
  public name = 'OperationNotAuthorized';
  constructor(public message: string, public innerException: any) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates bad signing data
 */
export class BadSigningDataError extends Error {
  public name = 'BadSigningData';
  constructor(public message: string, public innerException: any, public readonly data: any) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates a mismatch between the initialized and the requested public key
 */
export class PublicKeyMismatch extends Error {
  public name = 'PublicKeyMismatch';
  constructor(public requested: string, initialized: string) {
    super(
      `Requested public key hash does not match the initialized public key hash: {
        requested: ${requested},
        initialized: ${initialized}
      }`
    );
  }
}

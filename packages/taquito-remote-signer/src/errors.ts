/**
 *  @category Error
 *  @description Error indicates a failure in grabbing the public key
 */
export class KeyNotFoundError extends Error {
  constructor(public message: string, public innerException: any) {
    super(message);
    this.name = 'KeyNotFoundError';
  }
}

/**
 *  @category Error
 *  @description Error indicates an unauthorized operation being attempted
 */
export class OperationNotAuthorizedError extends Error {
  constructor(public message: string, public innerException: any) {
    super(message);
    this.name = 'OperationNotAuthorized';
  }
}

/**
 *  @category Error
 *  @description Error indicates bad signing data
 */
export class BadSigningDataError extends Error {
  constructor(public message: string, public innerException: any, public readonly data: any) {
    super(message);
    this.name = 'BadSigningData';
  }
}

/**
 *  @category Error
 *  @description Error indicates a mismatch between the initialized and the requested public key
 */
export class PublicKeyMismatch extends Error {
  constructor(public requested: string, initialized: string) {
    super(
      `Requested public key hash does not match the initialized public key hash: {
        requested: ${requested},
        initialized: ${initialized}
      }`
    );
    this.name = 'PublicKeyMismatch';
  }
}

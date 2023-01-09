import { NetworkError, ParameterValidationError, PermissionDeniedError } from "@taquito/core";

/**
 *  @category Error
 *  @description Error that indicates a failure in grabbing the public key
 */
export class KeyNotFoundError extends ParameterValidationError {
  public name = 'KeyNotFoundError';
  constructor(public message: string, public innerException: any) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an unauthorized operation being attempted
 */
export class OperationNotAuthorizedError extends PermissionDeniedError {
  public name = 'OperationNotAuthorized';
  constructor(public message: string, public innerException: any) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates bad signing data
 */
export class BadSigningDataError extends NetworkError {
  public name = 'BadSigningData';
  constructor(public message: string, public innerException: any, public readonly data: any) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates a mismatch between the initialized and the requested public key
 */
export class PublicKeyMismatch extends ParameterValidationError {
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

/**
 *  @category Error
 *  @description Error validating signature with signed bytes
 */
export class SignatureVerificationFailedError extends ParameterValidationError {
  public name = 'SignatureVerificationFailedError';
  constructor(public bytes: string, public signature: string) {
    super(
      `
        Signature failed verification against public key:
        {
          bytes: ${bytes},
          signature: ${signature}
        }
      `
    );
  }
}

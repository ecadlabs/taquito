import { PermissionDeniedError, TaquitoError } from '@taquito/core';

/**
 *  @category Error
 *  @description Error indicates an unauthorized operation being attempted
 */
export class OperationNotAuthorizedError extends PermissionDeniedError {
  constructor(public message: string, public cause: any) {
    super();
    this.name = 'OperationNotAuthorized';
  }
}

/**
 *  @category Error
 *  @description Error indicates bad signing data
 */
export class BadSigningDataError extends TaquitoError {
  constructor(public cause: any, public bytes: string, watermark?: Uint8Array) {
    super();
    this.name = 'BadSigningData';
    this.message = watermark
      ? `Invalid signing data with watermark`
      : `Invalid signing data: "${bytes}"`;
  }
}

/**
 *  @category Error
 *  @description Error indicates a mismatch between the initialized and the requested public key
 */
export class PublicKeyVerificationError extends TaquitoError {
  constructor(
    public requestedPk: string,
    public requestedPkh: string,
    public initializedPkh: string
  ) {
    super();
    this.name = 'PublicKeyVerificationFailedError';
    this.message = `Requested pk "${requestedPk}" has pkh "${requestedPkh}" deesn't match initialized pkh "${initializedPkh}."`;
  }
}

/**
 *  @category Error
 *  @description Error
 */
export class SignatureVerificationError extends TaquitoError {
  public name = 'SignatureVerificationFailedError';
  constructor(public bytes: string, public signature: string) {
    super();
    this.name = 'SignatureVerificationFailedError';
    this.message = `Invalid signature of bytes failed verification agaisnt public key.`;
  }
}

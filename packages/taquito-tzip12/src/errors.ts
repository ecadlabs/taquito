import { TaquitoError } from '@taquito/core';

/**
 *  @category Error
 *  @description Error indicates the metadata not being found on the contract
 */
export class TokenMetadataNotFound extends TaquitoError {
  constructor(public address: string) {
    super();
    this.name = 'TokenMetadataNotFound';
    this.message = `No token metadata was found for the contract: ${address}`;
  }
}

/**
 *  @category Error
 *  @description Error indicates the token ID not being found
 */
export class TokenIdNotFound extends TaquitoError {
  constructor(public tokenId: number) {
    super(`Could not find token metadata for the token ID: ${tokenId}`);
    this.name = 'TokenIdNotFound';
  }
}

/**
 *  @category Error
 *  @description Error indicates that the token metadata is invalid (not compliant with the TZIP-12 standard)
 */
export class InvalidTokenMetadata extends TaquitoError {
  constructor() {
    super();
    this.name = 'InvalidTokenMetadata';
    this.message =
      'Non-compliance with the TZIP-012 standard. The required property `decimals` is missing.';
  }
}

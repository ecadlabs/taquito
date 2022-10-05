/**
 *  @category Error
 *  @description Error that indicates the metadata not being found on the contract
 */
export class TokenMetadataNotFound extends Error {
  name = 'TokenMetadataNotFound';

  constructor(public address: string) {
    super(`No token metadata was found for the contract: ${address}`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates the token ID not being found
 */
export class TokenIdNotFound extends Error {
  name = 'TokenIdNotFound';

  constructor(public tokenId: number) {
    super(`Could not find token metadata for the token ID: ${tokenId}`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates that the token metadata is invalid (not compliant with the TZIP-12 standard)
 */
export class InvalidTokenMetadata extends Error {
  name = 'InvalidTokenMetadata';

  constructor() {
    super(
      'Non-compliance with the TZIP-012 standard. The required property `decimals` is missing.'
    );
  }
}

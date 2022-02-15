export class TokenMetadataNotFound extends Error {
  name = 'TokenMetadataNotFound';

  constructor(public address: string) {
    super(`No token metadata was found for the contract: ${address}`);
  }
}

export class TokenIdNotFound extends Error {
  name = 'TokenIdNotFound';

  constructor(public tokenId: number) {
    super(`Could not find token metadata for the token ID: ${tokenId}`);
  }
}

export class InvalidTokenMetadata extends Error {
  name = 'InvalidTokenMetadata';

  constructor() {
    super(
      'Non-compliance with the TZIP-012 standard. The required property `decimals` is missing.'
    );
  }
}

export class TokenMetadataNotFound implements Error {
    name: string = 'TokenMetadataNotFound';
    message: string;

    constructor(public address: string) {
        this.message = `No token metadata was found for the contract: ${address}`;
    }
}

export class TokenIdNotFound implements Error {
    name: string = 'TokenIdNotFound';
    message: string;

    constructor(public tokenId: number) {
        this.message = `Could not find token metadata for the token ID: ${tokenId}`;
    }
}

export class InvalidTokenMetadata implements Error {
    name = 'InvalidTokenMetadata';
    message = 'Non-compliance with the TZIP-012 standard. The required property `decimals` is missing.';
}
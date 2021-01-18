export class TokenMetadataNotFound implements Error {
    name: string = 'TokenMetadataNotFound';
    message: string;

    constructor(public address: string) {
        this.message = `No token metadata was found for the contract: ${address}`;
    }
}
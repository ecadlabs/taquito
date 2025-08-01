export interface SignResult {
    signature: string; // Base58 untyped signature ('sig...')
    prefixedSignature: string; // Base58 typed signature
    rawSignature: Uint8Array;
}

export interface SigningKey {
    sign(message: Uint8Array): Promise<SignResult>;
    publicKey(): Promise<string>;
    publicKeyHash(): Promise<string>;
    secretKey(): Promise<string>;
}

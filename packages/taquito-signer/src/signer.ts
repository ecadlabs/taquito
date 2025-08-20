export interface SignResult {
    sig: string; // Base58 untyped signature ('sig...')
    prefixSig: string; // Base58 typed signature
    rawSignature: Uint8Array;
}

export interface SigningKey {
    sign(message: Uint8Array): Promise<SignResult>;
    publicKey(): Promise<string>;
    publicKeyHash(): Promise<string>;
    secretKey(): Promise<string>;
    provePossession?: () => Promise<SignResult>;
}

export interface SigningKeyWithProofOfPossession extends SigningKey {
    provePossession(): Promise<SignResult>;
}

export function isPOP(k: SigningKey): k is SigningKeyWithProofOfPossession {
    return 'provePossession' in k
}
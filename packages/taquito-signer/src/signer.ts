export interface SignResult {
    sig: string; // Base58 untyped signature ('sig...')
    prefixSig: string; // Base58 typed signature
    rawSignature: Uint8Array;
}

export interface SigningKey {
    sign(message: Uint8Array): SignResult;
    publicKey(): PublicKey;
    secretKey(): string;
    provePossession?: () => SignResult;
}

export interface SigningKeyWithProofOfPossession extends SigningKey {
    provePossession(): SignResult;
}

export function isPOP(k: SigningKey): k is SigningKeyWithProofOfPossession {
    return 'provePossession' in k
}

export interface PublicKey {
    compare(other: PublicKey): number;
    hash(): string;
    bytes(compress?: boolean): Uint8Array;
    toProtocol(): Uint8Array;
}

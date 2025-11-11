import { ParametersOutputProof } from './types';
export declare class SaplingWrapper {
    withProvingContext<T>(action: (context: number) => Promise<T>): Promise<T>;
    getRandomBytes(length: number): Uint8Array;
    randR(): Promise<Buffer>;
    getOutgoingViewingKey(vk: Buffer): Promise<Buffer>;
    preparePartialOutputDescription(parametersOutputProof: ParametersOutputProof): Promise<{
        commitmentValue: Buffer;
        commitment: Buffer;
        proof: Buffer;
    }>;
    getDiversifiedFromRawPaymentAddress(decodedDestination: Uint8Array): Promise<Buffer>;
    deriveEphemeralPublicKey(diversifier: Buffer, esk: Buffer): Promise<Buffer>;
    getPkdFromRawPaymentAddress(destination: Uint8Array): Promise<Buffer>;
    keyAgreement(p: Buffer, sk: Buffer): Promise<Buffer>;
    createBindingSignature(saplingContext: number, balance: string, transactionSigHash: Uint8Array): Promise<Buffer>;
    initSaplingParameters(): Promise<void>;
}

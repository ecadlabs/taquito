import { Buffer } from 'buffer';
import * as sapling from './sapling-wasm';
import { ParametersOutputProof } from './types';
import { preloadSaplingParams } from './sapling-params-loader';

type RandomValueSource = {
  getRandomValues<T extends ArrayBufferView | null>(array: T): T;
};

const getRandomValueSource = (): RandomValueSource => {
  const crypto = globalThis.crypto as RandomValueSource | undefined;

  if (!crypto?.getRandomValues) {
    throw new Error('Sapling randomness requires globalThis.crypto.getRandomValues');
  }

  return crypto;
};

export class SaplingWrapper {
  async withProvingContext<T>(action: (context: number) => Promise<T>) {
    await preloadSaplingParams();
    return sapling.withProvingContext(action);
  }

  getRandomBytes(length: number) {
    const bytes = new Uint8Array(length);
    getRandomValueSource().getRandomValues(bytes);
    return bytes;
  }

  async randR() {
    return sapling.randR();
  }

  async getOutgoingViewingKey(vk: Buffer) {
    return sapling.getOutgoingViewingKey(vk);
  }

  async preparePartialOutputDescription(parametersOutputProof: ParametersOutputProof) {
    const partialOutputDesc = await sapling.preparePartialOutputDescription(
      parametersOutputProof.saplingContext,
      parametersOutputProof.address,
      parametersOutputProof.randomCommitmentTrapdoor,
      parametersOutputProof.ephemeralPrivateKey,
      parametersOutputProof.amount
    );
    return {
      commitmentValue: partialOutputDesc.cv,
      commitment: partialOutputDesc.cm,
      proof: partialOutputDesc.proof,
    };
  }

  async getDiversifiedFromRawPaymentAddress(decodedDestination: Uint8Array) {
    return sapling.getDiversifiedFromRawPaymentAddress(decodedDestination);
  }

  async deriveEphemeralPublicKey(diversifier: Buffer, esk: Buffer) {
    return sapling.deriveEphemeralPublicKey(diversifier, esk);
  }

  async getPkdFromRawPaymentAddress(destination: Uint8Array) {
    return sapling.getPkdFromRawPaymentAddress(destination);
  }

  async keyAgreement(p: Buffer, sk: Buffer) {
    return sapling.keyAgreement(p, sk);
  }

  async createBindingSignature(
    saplingContext: number,
    balance: string,
    transactionSigHash: Uint8Array
  ) {
    return sapling.createBindingSignature(saplingContext, balance, transactionSigHash);
  }

  async initSaplingParameters() {
    return preloadSaplingParams();
  }
}

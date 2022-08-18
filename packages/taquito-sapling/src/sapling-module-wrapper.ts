import * as sapling from '@airgap/sapling-wasm';
import { randomBytes } from '@stablelib/random';
import {
  ParametersOutputProof,
  ParametersSpendProof,
  ParametersSpendSig,
  SaplingSpendDescription,
  SaplingTransactionInput,
} from './types';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const saplingOutputParams = require('../saplingOutputParams');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const saplingSpendParams = require('../saplingSpendParams');

export class SaplingWrapper {
  async withProvingContext<T>(action: (context: number) => Promise<T>) {
    await this.initSaplingParameters();
    return sapling.withProvingContext(action);
  }

  getRandomBytes(length: number) {
    return randomBytes(length);
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

  async prepareSpendDescription(
    parametersSpendProof: ParametersSpendProof
  ): Promise<Omit<SaplingSpendDescription, 'signature'>> {
    const spendDescription = await sapling.prepareSpendDescriptionWithSpendingKey(
      parametersSpendProof.saplingContext,
      parametersSpendProof.spendingKey,
      parametersSpendProof.address,
      parametersSpendProof.randomCommitmentTrapdoor,
      parametersSpendProof.publicKeyReRandomization,
      parametersSpendProof.amount,
      parametersSpendProof.root,
      parametersSpendProof.witness
    );
    return {
      commitmentValue: spendDescription.cv,
      nullifier: spendDescription.nf,
      randomizedPublicKey: spendDescription.rk,
      rtAnchor: spendDescription.rt,
      proof: spendDescription.proof,
    };
  }

  async getDiversifiedFromRawPaymentAddress(decodedDestination: Uint8Array) {
    return sapling.getDiversifiedFromRawPaymentAddress(decodedDestination);
  }

  async deriveEphemeralPublicKey(diversifier: Buffer, esk: Buffer) {
    return sapling.deriveEphemeralPublicKey(diversifier, esk);
  }

  async signSpendDescription(
    parametersSpendSig: ParametersSpendSig
  ): Promise<SaplingTransactionInput> {
    const signedSpendDescription = await sapling.signSpendDescription(
      {
        cv: parametersSpendSig.unsignedSpendDescription.commitmentValue,
        rt: parametersSpendSig.unsignedSpendDescription.rtAnchor,
        nf: parametersSpendSig.unsignedSpendDescription.nullifier,
        rk: parametersSpendSig.unsignedSpendDescription.randomizedPublicKey,
        proof: parametersSpendSig.unsignedSpendDescription.proof,
      },
      parametersSpendSig.spendingKey,
      parametersSpendSig.publicKeyReRandomization,
      parametersSpendSig.hash
    );
    return {
      commitmentValue: signedSpendDescription.cv,
      nullifier: signedSpendDescription.nf,
      randomizedPublicKey: signedSpendDescription.rk,
      proof: signedSpendDescription.proof,
      signature: signedSpendDescription.spendAuthSig,
    };
  }

  async getPkdFromRawPaymentAddress(destination: Uint8Array) {
    return sapling.getPkdFromRawPaymentAddress(destination);
  }

  async keyAgreement(p: Buffer, sk: Buffer) {
    return sapling.keyAgreement(p, sk);
  }

  async getPaymentAddressFromViewingKey(vk: Buffer) {
    return (await sapling.getPaymentAddressFromViewingKey(vk)).raw;
  }

  async createBindingSignature(
    saplingContext: number,
    balance: string,
    transactionSigHash: Uint8Array
  ) {
    return sapling.createBindingSignature(saplingContext, balance, transactionSigHash);
  }

  async initSaplingParameters() {
    const spendParams = Buffer.from(saplingSpendParams.saplingSpendParams, 'base64');
    const outputParams = Buffer.from(saplingOutputParams.saplingOutputParams, 'base64');

    return sapling.initParameters(spendParams, outputParams);
  }
}

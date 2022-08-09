import * as sapling from '@airgap/sapling-wasm';
import { randomBytes } from '@stablelib/random';
import {
  ParametersOutputProof,
  ParametersSpendProof,
  ParametersSpendSig,
  SaplingTransactionInput,
} from '../types';
import * as path from 'path';
import * as fs from 'fs';
import axios, { AxiosResponse } from 'axios';

const SAPLING_PARAMS_DIR = path.resolve(__dirname, 'sapling-params');
const ZCASH_DOWNLOAD_URL = 'https://download.z.cash/downloads';
const SPEND_PARAMS_FILE_NAME = 'sapling-spend.params';
const OUTPUT_PARAMS_FILE_NAME = 'sapling-output.params';
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
    return sapling.preparePartialOutputDescription(
      parametersOutputProof.saplingContext,
      parametersOutputProof.address,
      parametersOutputProof.rcm,
      parametersOutputProof.esk,
      parametersOutputProof.amount
    );
  }

  async prepareSpendDescription(parametersSpendProof: ParametersSpendProof) {
    return sapling.prepareSpendDescription(
      parametersSpendProof.saplingContext,
      parametersSpendProof.sk,
      parametersSpendProof.address,
      parametersSpendProof.rcm,
      parametersSpendProof.ar,
      parametersSpendProof.amount,
      parametersSpendProof.root,
      parametersSpendProof.witness
    );
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rt, spendAuthSig, ...rest } = await sapling.signSpendDescription(
      parametersSpendSig.unsignedSpendDescription,
      parametersSpendSig.sk,
      parametersSpendSig.ar,
      parametersSpendSig.hash
    );
    return {
      ...rest,
      signature: spendAuthSig,
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

  async initSaplingParameters(): Promise<void> {
    const [spendParams, outputParams] = await Promise.all([
      this.prepareParams(SPEND_PARAMS_FILE_NAME),
      this.prepareParams(OUTPUT_PARAMS_FILE_NAME),
    ]);

    return sapling.initParameters(spendParams, outputParams);
  }

  private async prepareParams(name: string): Promise<Buffer> {
    const paramsFilePath: string = path.resolve(SAPLING_PARAMS_DIR, name);

    if (!fs.existsSync(paramsFilePath)) {
      await this.fetchSaplingParams(name);
    }

    return fs.readFileSync(paramsFilePath);
  }

  private async fetchSaplingParams(name: string): Promise<void> {
    const response: AxiosResponse = await axios.get(`${ZCASH_DOWNLOAD_URL}/${name}`, {
      responseType: 'stream',
    });

    fs.mkdirSync(SAPLING_PARAMS_DIR, { recursive: true });
    const writer: fs.WriteStream = fs.createWriteStream(path.resolve(SAPLING_PARAMS_DIR, name));

    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      let error: Error | undefined = undefined;
      writer.on('error', (err: Error) => {
        error = err;
        writer.close();
      });

      writer.on('close', () => {
        if (error !== undefined) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}

import blake from 'blakejs';
import { secretBox } from '@stablelib/nacl';
import { DEFAULT_MEMO, KDF_KEY, OCK_KEY } from '../constants';
import { SaplingForger } from '../sapling-forger/sapling-forger';
import { BigNumber } from 'bignumber.js';
import {
  Input,
  SaplingTransactionOutput,
  SaplingTransactionInput,
  ParametersBindingSig,
  ChosenSpendableInputs,
  ParametersOutputDescription,
  ParametersCiphertext,
  Ciphertext,
  SaplingContractDetails,
  SaplingTransaction,
} from '../types';
import { SaplingDiffResponse } from '@taquito/rpc';
import { b58cdecode, Prefix, prefix } from '@taquito/utils';
import { TzReadProvider } from '@taquito/taquito';
import { convertValueToBigNumber } from '../sapling-tx-viewer/helpers';
import { SaplingState } from '../sapling-state/sapling-state';
import { SaplingWrapper } from './sapling-module-wrapper';
import { InMemorySpendingKey } from '../sapling-keys/in-memory-spending-key';

export class SaplingTransactionBuilder {
  #inMemorySpendingKey: InMemorySpendingKey;
  #saplingForger: SaplingForger;
  #contractAddress: string;
  #saplingId: string | undefined;
  #memoSize: number;
  #readProvider: TzReadProvider;
  #saplingWrapper: SaplingWrapper;
  #chainId: string | undefined;
  #saplingState: SaplingState;

  constructor(
    inMemorySpendingKey: InMemorySpendingKey,
    saplingForger: SaplingForger,
    saplingContractDetails: SaplingContractDetails,
    readProvider: TzReadProvider,
    saplingWrapper = new SaplingWrapper()
  ) {
    this.#saplingForger = saplingForger;
    this.#contractAddress = saplingContractDetails.contractAddress;
    this.#memoSize = saplingContractDetails.memoSize;
    this.#inMemorySpendingKey = inMemorySpendingKey;
    this.#saplingState = new SaplingState(32);
    this.#saplingId = saplingContractDetails.saplingId;
    this.#saplingWrapper = saplingWrapper;
    this.#readProvider = readProvider;
  }

  async createShieldedTx(
    saplingTransactionParams: {
      to: string;
      amount: string;
      memo: string;
    }[],
    txTotalAmount: BigNumber,
    boundData: Buffer
  ): Promise<Pick<SaplingTransaction, 'inputs' | 'outputs' | 'signature' | 'balance'>> {
    const rcm = await this.#saplingWrapper.randR();

    const balance = this.calculateTransactionBalance('0', txTotalAmount.toString());

    const { signature, inputs, outputs } = await this.#saplingWrapper.withProvingContext(
      async (saplingContext: number) => {
        const outputs: SaplingTransactionOutput[] = [];
        const inputs: SaplingTransactionInput[] = [];

        for (const i in saplingTransactionParams) {
          outputs.push(
            await this.prepareSaplingOutputDescription({
              saplingContext,
              address: b58cdecode(saplingTransactionParams[i].to, prefix[Prefix.ZET1]),
              amount: saplingTransactionParams[i].amount,
              memo: saplingTransactionParams[i].memo,
              rcm,
            })
          );
        }

        const signature = await this.createBindingSignature({
          saplingContext,
          inputs,
          outputs,
          balance,
          boundData,
        });
        return { signature, inputs, outputs };
      }
    );

    return {
      inputs,
      outputs,
      signature,
      balance,
    };
  }

  // Note that the number of inputs is limited to 5208 and number of outputs to 2019
  async createSaplingTx(
    saplingTransactionParams: {
      to: string;
      amount: string;
      memo: string;
    }[],
    txTotalAmount: BigNumber,
    boundData: Buffer,
    chosenInputs: ChosenSpendableInputs
  ) {
    const rcm = await this.#saplingWrapper.randR();
    const vk = (await this.#inMemorySpendingKey.getInMemoryViewingKey()).getFullViewingKey();
    const ovk = await this.#saplingWrapper.getOutgoingViewingKey(vk);

    const { signature, balance, inputs, outputs } = await this.#saplingWrapper.withProvingContext(
      async (saplingContext: number) => {
        const outputs: SaplingTransactionOutput[] = [];
        const inputs: SaplingTransactionInput[] = [];

        inputs.push(
          ...(await this.prepareSaplingSpendDescription(saplingContext, chosenInputs.inputsToSpend))
        );

        let sumAmountOutput = new BigNumber(0);

        for (const i in saplingTransactionParams) {
          sumAmountOutput = sumAmountOutput.plus(new BigNumber(saplingTransactionParams[i].amount));

          outputs.push(
            await this.prepareSaplingOutputDescription({
              saplingContext,
              address: b58cdecode(saplingTransactionParams[i].to, prefix[Prefix.ZET1]),
              amount: saplingTransactionParams[i].amount,
              memo: saplingTransactionParams[i].memo,
              rcm,
              ovk,
            })
          );
        }

        if (chosenInputs.sumSelectedInputs.isGreaterThan(sumAmountOutput)) {
          const payBackAddress = await this.#saplingWrapper.getPaymentAddressFromViewingKey(vk);
          const { payBackOutput, payBackAmount } = await this.createPaybackOutput(
            {
              saplingContext,
              address: payBackAddress,
              amount: txTotalAmount.toString(),
              memo: DEFAULT_MEMO,
              rcm,
              ovk,
            },
            chosenInputs.sumSelectedInputs
          );

          sumAmountOutput = sumAmountOutput.plus(new BigNumber(payBackAmount));
          outputs.push(payBackOutput);
        }

        const balance = this.calculateTransactionBalance(
          chosenInputs.sumSelectedInputs.toString(),
          sumAmountOutput.toString()
        );

        const signature = await this.createBindingSignature({
          saplingContext,
          inputs,
          outputs,
          balance,
          boundData,
        });

        return { signature, balance, inputs, outputs };
      }
    );

    return {
      inputs,
      outputs,
      signature,
      balance,
    };
  }

  // sum of values of inputs minus sums of values of output equals balance
  calculateTransactionBalance(inputTotal: string, outputTotal: string) {
    return new BigNumber(inputTotal).minus(new BigNumber(outputTotal));
  }

  async prepareSaplingOutputDescription(
    parametersOutputDescription: ParametersOutputDescription
  ): Promise<SaplingTransactionOutput> {
    const esk = await this.#saplingWrapper.randR();
    const { cv, cm, proof } = await this.#saplingWrapper.preparePartialOutputDescription({
      saplingContext: parametersOutputDescription.saplingContext,
      address: parametersOutputDescription.address,
      rcm: parametersOutputDescription.rcm,
      esk,
      amount: parametersOutputDescription.amount,
    });

    const diversifier = await this.#saplingWrapper.getDiversifiedFromRawPaymentAddress(
      parametersOutputDescription.address
    );
    const epk = await this.#saplingWrapper.deriveEphemeralPublicKey(diversifier, esk);
    const ock = parametersOutputDescription.ovk
      ? blake.blake2b(
          Buffer.concat([cv, cm, epk, parametersOutputDescription.ovk]),
          Buffer.from(OCK_KEY),
          32
        )
      : this.#saplingWrapper.getRandomBytes(32);
    const ciphertext = await this.encryptCiphertext({
      address: parametersOutputDescription.address,
      esk,
      diversifier,
      ock,
      amount: parametersOutputDescription.amount,
      rcm: parametersOutputDescription.rcm,
      memo: parametersOutputDescription.memo,
    });

    return {
      cm,
      proof,
      ciphertext: {
        ...ciphertext,
        cv,
        epk,
      },
    };
  }

  async prepareSaplingSpendDescription(saplingContext: number, inputsToSpend: Input[]) {
    const ar = await this.#saplingWrapper.randR();

    let stateDiff: SaplingDiffResponse;
    if (this.#saplingId) {
      stateDiff = await this.#readProvider.getSaplingDiffById({ id: this.#saplingId }, 'head');
    } else {
      stateDiff = await this.#readProvider.getSaplingDiffByContract(this.#contractAddress, 'head');
    }

    const stateTree = await this.#saplingState.getStateTree(stateDiff, true);

    const saplingSpendDescriptions: SaplingTransactionInput[] = [];

    for (let i = 0; i < inputsToSpend.length; i++) {
      const amount = convertValueToBigNumber(inputsToSpend[i].value).toString();
      const witness = await this.#saplingState.getWitness(
        stateTree,
        new BigNumber(inputsToSpend[i].position)
      );

      const unsignedSpendDescription = await this.#saplingWrapper.prepareSpendDescription({
        saplingContext,
        sk: b58cdecode(this.#inMemorySpendingKey.getSpendingKey(), prefix[Prefix.SASK]),
        address: inputsToSpend[i].paymentAddress,
        rcm: inputsToSpend[i].rcm,
        ar,
        amount,
        root: stateDiff.root,
        witness,
      });

      const unsignedSpendDescriptionBytes =
        this.#saplingForger.forgeUnsignedTxInput(unsignedSpendDescription);
      const hash = blake.blake2b(unsignedSpendDescriptionBytes, await this.getAntiReplay(), 32);
      const spendDescription = await this.#saplingWrapper.signSpendDescription({
        sk: b58cdecode(this.#inMemorySpendingKey.getSpendingKey(), prefix[Prefix.SASK]),
        ar,
        unsignedSpendDescription,
        hash,
      });

      if (spendDescription.signature === undefined) {
        throw new Error('Spend signing failed');
      }
      saplingSpendDescriptions.push(spendDescription);
    }

    return saplingSpendDescriptions;
  }

  async encryptCiphertext(
    parametersCiphertext: ParametersCiphertext
  ): Promise<Pick<Ciphertext, 'payloadEnc' | 'nonceEnc' | 'payloadOut' | 'nonceOut'>> {
    const pkd = await this.#saplingWrapper.getPkdFromRawPaymentAddress(
      parametersCiphertext.address
    );
    const keyAgreement = await this.#saplingWrapper.keyAgreement(pkd, parametersCiphertext.esk);
    const keyAgreementHash = blake.blake2b(keyAgreement, Buffer.from(KDF_KEY), 32);
    const nonceEnc = Buffer.from(this.#saplingWrapper.getRandomBytes(24));

    const transactionPlaintext = this.#saplingForger.forgeTransactionPlaintext({
      diversifier: parametersCiphertext.diversifier,
      amount: parametersCiphertext.amount,
      rcm: parametersCiphertext.rcm,
      memoSize: this.#memoSize * 2,
      memo: parametersCiphertext.memo,
    });

    const nonceOut = Buffer.from(this.#saplingWrapper.getRandomBytes(24));
    const payloadEnc = Buffer.from(secretBox(keyAgreementHash, nonceEnc, transactionPlaintext));
    const payloadOut = Buffer.from(
      secretBox(parametersCiphertext.ock, nonceOut, Buffer.concat([pkd, parametersCiphertext.esk]))
    );

    return { payloadEnc, nonceEnc, payloadOut, nonceOut };
  }

  async createPaybackOutput(params: ParametersOutputDescription, sumSelectedInputs: BigNumber) {
    const payBackAmount = sumSelectedInputs.minus(params.amount).toString();
    const payBackOutput = await this.prepareSaplingOutputDescription({
      saplingContext: params.saplingContext,
      address: params.address,
      amount: payBackAmount,
      memo: params.memo,
      rcm: params.rcm,
      ovk: params.ovk,
    });

    return { payBackOutput, payBackAmount };
  }

  async createBindingSignature(parametersBindingSig: ParametersBindingSig) {
    const outputs = this.#saplingForger.forgeOutputDescriptions(parametersBindingSig.outputs);
    const inputs = this.#saplingForger.forgeSpendDescriptions(parametersBindingSig.inputs);
    const transactionSigHash = blake.blake2b(
      Buffer.concat([inputs, outputs, parametersBindingSig.boundData]),
      await this.getAntiReplay(),
      32
    );

    return this.#saplingWrapper.createBindingSignature(
      parametersBindingSig.saplingContext,
      parametersBindingSig.balance.toFixed(),
      transactionSigHash
    );
  }

  async getAntiReplay() {
    let chainId = this.#chainId;
    if (!chainId) {
      chainId = await this.#readProvider.getChainId();
      this.#chainId = chainId;
    }
    return Buffer.from(`${this.#contractAddress}${chainId}`);
  }
}

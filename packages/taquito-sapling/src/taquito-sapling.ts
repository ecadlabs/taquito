/**
 * @packageDocumentation
 * @module @taquito/sapling
 */

import BigNumber from 'bignumber.js';
import { MichelCodecPacker, Packer, TzReadProvider } from '@taquito/taquito';
import {
  b58DecodeAndCheckPrefix,
  b58DecodePublicKeyHash,
  format,
  PrefixV2,
  validateKeyHash,
  ValidationResult,
} from '@taquito/utils';
import { InsufficientBalance, InvalidMemo } from './errors';
import { convertValueToBigNumber } from './sapling-tx-viewer/helpers';
import { InMemorySpendingKey } from './sapling-keys/in-memory-spending-key';
import { SaplingForger } from './sapling-forger/sapling-forger';
import { SaplingTransactionViewer } from './sapling-tx-viewer/sapling-transaction-viewer';
import {
  ChosenSpendableInputs,
  Input,
  ParametersSaplingTransaction,
  ParametersUnshieldedTransaction,
  SaplingContractDetails,
  SaplingContractId,
} from './types';
import { SaplingTransactionBuilder } from './sapling-tx-builder/sapling-transactions-builder';
import { DEFAULT_BOUND_DATA, DEFAULT_MEMO } from './constants';
import { InMemoryProvingKey } from './sapling-keys/in-memory-proving-key';
import { InvalidAddressError, InvalidKeyHashError } from '@taquito/core';

export { SaplingTransactionViewer } from './sapling-tx-viewer/sapling-transaction-viewer';
export { InMemoryViewingKey } from './sapling-keys/in-memory-viewing-key';
export { InMemorySpendingKey } from './sapling-keys/in-memory-spending-key';
export { InMemoryProvingKey } from './sapling-keys/in-memory-proving-key';

/**
 * @description Class that surfaces all of the sapling capability allowing to read from a sapling state and prepare transactions
 *
 * @param keys.saplingSigner Holds the sapling spending key
 * @param keys.saplingProver (Optional) Allows to generate the proofs with the proving key rather than the spending key
 * @param saplingContractDetails Contains the address of the sapling contract, the memo size, and an optional sapling id that must be defined if the sapling contract contains more than one sapling state
 * @param readProvider Allows to read data from the blockchain
 * @param packer (Optional) Allows packing data. Use the `MichelCodecPacker` by default.
 * @param saplingForger (Optional) Allows serializing the sapling transactions. Use the `SaplingForger` by default.
 * @param saplingTxBuilder (Optional) Allows to prepare the sapling transactions. Use the `SaplingTransactionBuilder` by default.
 * @example
 * ```
 * const inMemorySpendingKey = await InMemorySpendingKey.fromMnemonic('YOUR_MNEMONIC');
 * const readProvider = new RpcReadAdapter(new RpcClient('https://YOUR_PREFERRED_RPC_URL'))
 *
 * const saplingToolkit = new SaplingToolkit(
 *    { saplingSigner: inMemorySpendingKey },
 *    { contractAddress: SAPLING_CONTRACT_ADDRESS, memoSize: 8 },
 *    readProvider
 * )
 * ```
 */
export class SaplingToolkit {
  #inMemorySpendingKey: InMemorySpendingKey;
  #saplingId: string | undefined;
  #contractAddress: string;
  #memoSize: number;
  #readProvider: TzReadProvider;
  #packer: Packer;
  #saplingForger: SaplingForger;
  #saplingTxBuilder: SaplingTransactionBuilder;
  #saplingTransactionViewer: SaplingTransactionViewer | undefined;
  constructor(
    keys: {
      saplingSigner: InMemorySpendingKey;
      saplingProver?: InMemoryProvingKey;
    },
    saplingContractDetails: SaplingContractDetails,
    readProvider: TzReadProvider,
    packer = new MichelCodecPacker(),
    saplingForger = new SaplingForger(),
    saplingTxBuilder = new SaplingTransactionBuilder(
      keys,
      saplingForger,
      saplingContractDetails,
      readProvider
    )
  ) {
    this.#inMemorySpendingKey = keys.saplingSigner;
    this.#saplingId = saplingContractDetails.saplingId;
    this.#contractAddress = saplingContractDetails.contractAddress;
    this.#memoSize = saplingContractDetails.memoSize;
    this.#readProvider = readProvider;
    this.#packer = packer;
    this.#saplingForger = saplingForger;
    this.#saplingTxBuilder = saplingTxBuilder;
  }

  /**
   * @description Get an instance of `SaplingTransactionViewer` which allows to retrieve and decrypt sapling transactions and calculate the unspent balance.
   */
  async getSaplingTransactionViewer() {
    let saplingTransactionViewer: SaplingTransactionViewer;

    if (!this.#saplingTransactionViewer) {
      const saplingViewingKey = await this.#inMemorySpendingKey.getSaplingViewingKeyProvider();
      saplingTransactionViewer = new SaplingTransactionViewer(
        saplingViewingKey,
        this.getSaplingContractId(),
        this.#readProvider
      );
      this.#saplingTransactionViewer = saplingTransactionViewer;
    }
    return this.#saplingTransactionViewer;
  }

  /**
   * @description Prepare a shielded transaction
   * @param shieldedTxParams `to` is the payment address that will receive the shielded tokens (zet).
   * `amount` is the amount of shielded tokens in tez by default.
   * `mutez` needs to be set to true if the amount of shielded tokens is in mutez.
   * `memo` is an empty string by default.
   * @returns a string representing the sapling transaction
   */
  async prepareShieldedTransaction(shieldedTxParams: ParametersSaplingTransaction[]) {
    const { formatedParams, totalAmount } = this.formatTransactionParams(
      shieldedTxParams,
      this.validateDestinationSaplingAddress
    );
    const root = await this.getRoot();

    const { inputs, outputs, signature, balance } = await this.#saplingTxBuilder.createShieldedTx(
      formatedParams,
      totalAmount,
      DEFAULT_BOUND_DATA
    );

    const forgedSaplingTx = this.#saplingForger.forgeSaplingTransaction({
      inputs,
      outputs,
      balance,
      root,
      boundData: DEFAULT_BOUND_DATA,
      signature,
    });

    return forgedSaplingTx.toString('hex');
  }

  /**
   * @description Prepare an unshielded transaction
   * @param unshieldedTxParams `to` is the Tezos address that will receive the unshielded tokens (tz1, tz2 or tz3).
   * `amount` is the amount of unshielded tokens in tez by default.
   * `mutez` needs to be set to true if the amount of unshielded tokens is in mutez.
   * @returns a string representing the sapling transaction.
   */
  async prepareUnshieldedTransaction(unshieldedTxParams: ParametersUnshieldedTransaction) {
    const { formatedParams, totalAmount } = this.formatTransactionParams(
      [unshieldedTxParams],
      this.validateDestinationImplicitAddress
    );

    const boundData = await this.createBoundData(formatedParams[0].to);

    const root = await this.getRoot();
    const chosenInputs = await this.selectInputsToSpend(new BigNumber(formatedParams[0].amount));

    const { inputs, outputs, signature, balance } = await this.#saplingTxBuilder.createSaplingTx(
      [],
      totalAmount,
      boundData,
      chosenInputs
    );

    const forgedSaplingTx = this.#saplingForger.forgeSaplingTransaction({
      inputs,
      outputs,
      balance,
      root,
      boundData,
      signature,
    });

    return forgedSaplingTx.toString('hex');
  }

  /**
   * @description Prepare a sapling transaction (zet to zet)
   * @param saplingTxParams `to` is the payment address that will receive the shielded tokens (zet).
   * `amount` is the amount of unshielded tokens in tez by default.
   * `mutez` needs to be set to true if the amount of unshielded tokens is in mutez.
   * `memo` is an empty string by default.
   * @returns a string representing the sapling transaction.
   */
  async prepareSaplingTransaction(saplingTxParams: ParametersSaplingTransaction[]) {
    const { formatedParams, totalAmount } = this.formatTransactionParams(
      saplingTxParams,
      this.validateDestinationSaplingAddress
    );

    const root = await this.getRoot();
    const chosenInputs = await this.selectInputsToSpend(totalAmount);
    const { inputs, outputs, signature, balance } = await this.#saplingTxBuilder.createSaplingTx(
      formatedParams,
      totalAmount,
      DEFAULT_BOUND_DATA,
      chosenInputs
    );

    const forgedSaplingTx = this.#saplingForger.forgeSaplingTransaction({
      inputs,
      outputs,
      balance,
      root,
      boundData: DEFAULT_BOUND_DATA,
      signature,
    });

    return forgedSaplingTx.toString('hex');
  }

  private formatTransactionParams(
    txParams: ParametersSaplingTransaction[],
    validateDestination: (to: string) => void
  ) {
    const formatedParams: {
      to: string;
      amount: string;
      memo: string;
    }[] = [];

    let totalAmount = new BigNumber(0);

    txParams.forEach((param) => {
      validateDestination(param.to);
      const amountMutez = param.mutez
        ? param.amount.toString()
        : format('tz', 'mutez', param.amount).toString();
      totalAmount = totalAmount.plus(new BigNumber(amountMutez));
      const memo = param.memo ?? DEFAULT_MEMO;
      if (memo.length > this.#memoSize) {
        throw new InvalidMemo(memo, `expecting length to be less than ${this.#memoSize}`);
      }

      formatedParams.push({ to: param.to, amount: amountMutez, memo });
    });

    return { formatedParams, totalAmount };
  }

  private async getRoot() {
    if (this.#saplingId) {
      const { root } = await this.#readProvider.getSaplingDiffById({ id: this.#saplingId }, 'head');
      return root;
    } else {
      const { root } = await this.#readProvider.getSaplingDiffByContract(
        this.#contractAddress,
        'head'
      );
      return root;
    }
  }

  private async createBoundData(destination: string) {
    const bytes = b58DecodePublicKeyHash(destination, 'hex');
    const packedDestination = await this.#packer.packData({
      data: { bytes },
      type: { prim: 'bytes' },
    });
    return Buffer.from(packedDestination.packed, 'hex');
  }

  private validateDestinationImplicitAddress(to: string) {
    const toValidation = validateKeyHash(to);
    if (toValidation !== ValidationResult.VALID) {
      throw new InvalidKeyHashError(to, toValidation);
    }
  }

  private validateDestinationSaplingAddress(to: string) {
    try {
      b58DecodeAndCheckPrefix(to, [PrefixV2.SaplingAddress]);
    } catch {
      throw new InvalidAddressError(to, `expecting prefix ${PrefixV2.SaplingAddress}.`);
    }
  }

  private getSaplingContractId() {
    let saplingContractId: SaplingContractId;
    if (this.#saplingId) {
      saplingContractId = { saplingId: this.#saplingId };
    } else {
      saplingContractId = { contractAddress: this.#contractAddress };
    }
    return saplingContractId;
  }

  private async selectInputsToSpend(amountMutez: BigNumber): Promise<ChosenSpendableInputs> {
    const saplingTxViewer = await this.getSaplingTransactionViewer();

    const { incoming } = await saplingTxViewer.getIncomingAndOutgoingTransactionsRaw();

    const inputsToSpend: Input[] = [];
    let sumSelectedInputs = new BigNumber(0);

    incoming.forEach((input) => {
      if (!input.isSpent && sumSelectedInputs.isLessThan(amountMutez)) {
        const txAmount = convertValueToBigNumber(input.value);
        sumSelectedInputs = sumSelectedInputs.plus(txAmount);
        const { isSpent: _isSpent, ...rest } = input;
        inputsToSpend.push(rest);
      }
    });

    if (sumSelectedInputs.isLessThan(new BigNumber(amountMutez))) {
      throw new InsufficientBalance(sumSelectedInputs.toString(), amountMutez.toString());
    }
    return { inputsToSpend, sumSelectedInputs };
  }
}

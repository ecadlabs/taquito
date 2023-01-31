import { Context } from '../context';
import { ContractStorageType, DefaultContractType } from '../contract/contract';
import { ContractMethod } from '../contract/contract-methods/contract-method-flat-param';
import { SendParams } from '../contract/contract-methods/contract-method-interface';
import { ContractProvider } from '../contract/interface';
import {
  createOriginationOperation,
  createRegisterGlobalConstantOperation,
  createRevealOperation,
  createTxRollupOriginationOperation,
  createSetDelegateOperation,
  createTransferOperation,
  createTxRollupBatchOperation,
  createTransferTicketOperation,
  createIncreasePaidStorageOperation,
  createSmartRollupAddMessagesOperation,
  createSmartRollupOriginateOperation,
} from '../contract/prepare';
import { BatchOperation } from '../operations/batch-operation';
import { OperationEmitter } from '../operations/operation-emitter';
import {
  ActivationParams,
  DelegateParams,
  OriginateParams,
  RPCOperation,
  TransferParams,
  ParamsWithKind,
  isOpWithFee,
  withKind,
  RevealParams,
  RegisterGlobalConstantParams,
  TxRollupOriginateParams,
  TxRollupBatchParams,
  TransferTicketParams,
  IncreasePaidStorageParams,
  SmartRollupAddMessagesParams,
  SmartRollupOriginateParamsWithProof,
} from '../operations/types';
import { OpKind } from '@taquito/rpc';
import { ContractMethodObject } from '../contract/contract-methods/contract-method-object-param';
import {
  validateAddress,
  validateKeyHash,
  InvalidAddressError,
  InvalidKeyHashError,
  ValidationResult,
  InvalidOperationKindError,
} from '@taquito/utils';
import { EstimationProvider } from '../estimate/estimate-provider-interface';

export const BATCH_KINDS = [
  OpKind.ACTIVATION,
  OpKind.ORIGINATION,
  OpKind.TRANSACTION,
  OpKind.DELEGATION,
];
export type BatchKinds =
  | OpKind.ACTIVATION
  | OpKind.ORIGINATION
  | OpKind.TRANSACTION
  | OpKind.DELEGATION;

export class OperationBatch extends OperationEmitter {
  private operations: ParamsWithKind[] = [];

  constructor(context: Context, private estimator: EstimationProvider) {
    super(context);
  }

  /**
   *
   * @description Add a transaction operation to the batch
   *
   * @param params Transfer operation parameter
   */
  withTransfer(params: TransferParams) {
    if (validateAddress(params.to) !== ValidationResult.VALID) {
      throw new InvalidAddressError(params.to);
    }
    this.operations.push({ kind: OpKind.TRANSACTION, ...params });
    return this;
  }

  /**
   *
   * @description Transfer tickets from a Tezos address (tz1,tz2 or tz3) to a smart contract address( KT1)
   *
   * @param params Transfer operation parameter
   */
  withTransferTicket(params: TransferTicketParams) {
    if (validateAddress(params.destination) !== ValidationResult.VALID) {
      throw new InvalidAddressError(params.destination, 'param destination');
    }
    this.operations.push({ kind: OpKind.TRANSFER_TICKET, ...params });
    return this;
  }

  /**
   *
   * @description Add a contract call to the batch
   *
   * @param params Call a contract method
   * @param options Generic operation parameters
   */
  withContractCall(
    params: ContractMethod<ContractProvider> | ContractMethodObject<ContractProvider>,
    options: Partial<SendParams> = {}
  ) {
    return this.withTransfer(params.toTransferParams(options));
  }

  /**
   *
   * @description Add a delegation operation to the batch
   *
   * @param params Delegation operation parameter
   */
  withDelegation(params: DelegateParams) {
    if (params.source && validateAddress(params.source) !== ValidationResult.VALID) {
      throw new InvalidAddressError(params.source);
    }
    if (params.delegate && validateAddress(params.delegate) !== ValidationResult.VALID) {
      throw new InvalidAddressError(params.delegate);
    }
    this.operations.push({ kind: OpKind.DELEGATION, ...params });
    return this;
  }

  /**
   *
   * @description Add an activation operation to the batch
   *
   * @param params Activation operation parameter
   */
  withActivation({ pkh, secret }: ActivationParams) {
    if (validateKeyHash(pkh) !== ValidationResult.VALID) {
      throw new InvalidKeyHashError(pkh);
    }
    this.operations.push({ kind: OpKind.ACTIVATION, pkh, secret });
    return this;
  }

  /**
   *
   * @description Add an origination operation to the batch
   *
   * @param params Origination operation parameter
   */
  withOrigination<TContract extends DefaultContractType = DefaultContractType>(
    params: OriginateParams<ContractStorageType<TContract>>
  ) {
    this.operations.push({ kind: OpKind.ORIGINATION, ...params });
    return this;
  }

  /**
   *
   * @description Add an operation to register a global constant to the batch
   *
   * @param params RegisterGlobalConstant operation parameter
   */
  withRegisterGlobalConstant(params: RegisterGlobalConstantParams) {
    this.operations.push({ kind: OpKind.REGISTER_GLOBAL_CONSTANT, ...params });
    return this;
  }

  /**
   *
   * @description Add an operation to increase paid storage to the batch
   *
   * @param params IncreasePaidStorage operation parameter
   */
  withIncreasePaidStorage(params: IncreasePaidStorageParams) {
    this.operations.push({ kind: OpKind.INCREASE_PAID_STORAGE, ...params });
    return this;
  }

  /**
   *
   * @description Add an operation to originate a rollup to the batch
   *
   * @param params Rollup origination operation parameter
   */
  withTxRollupOrigination(params?: TxRollupOriginateParams) {
    this.operations.push({ kind: OpKind.TX_ROLLUP_ORIGINATION, ...params });
    return this;
  }

  /**
   *
   * @description Add an operation to add messages to a smart rollup
   *
   * @param params Rollup origination operation parameter
   */
  withSmartRollupAddMessages(params: SmartRollupAddMessagesParams) {
    this.operations.push({ kind: OpKind.SMART_ROLLUP_ADD_MESSAGES, ...params });
    return this;
  }

  /**
   *
   * @description Add an operation to originate a smart rollup to batch
   *
   * @param params Smart Rollup Originate operation parameter
   */
  withSmartRollupOriginate(params: SmartRollupOriginateParamsWithProof) {
    this.operations.push({ kind: OpKind.SMART_ROLLUP_ORIGINATE, ...params });
    return this;
  }

  /**
   *
   * @description Add an operation to submit a tx rollup batch to the batch
   *
   * @param params Tx rollup batch operation parameter
   */
  withTxRollupSubmitBatch(params: TxRollupBatchParams) {
    this.operations.push({ kind: OpKind.TX_ROLLUP_SUBMIT_BATCH, ...params });
    return this;
  }

  async getRPCOp(param: ParamsWithKind) {
    switch (param.kind) {
      case OpKind.TRANSACTION:
        return createTransferOperation({
          ...param,
        });
      case OpKind.ORIGINATION:
        return createOriginationOperation(
          await this.context.parser.prepareCodeOrigination({
            ...param,
          })
        );
      case OpKind.DELEGATION:
        return createSetDelegateOperation({
          ...param,
        });
      case OpKind.ACTIVATION:
        return {
          ...param,
        };
      case OpKind.REGISTER_GLOBAL_CONSTANT:
        return createRegisterGlobalConstantOperation({
          ...param,
        });
      case OpKind.INCREASE_PAID_STORAGE:
        return createIncreasePaidStorageOperation({
          ...param,
        });
      case OpKind.TX_ROLLUP_ORIGINATION:
        return createTxRollupOriginationOperation({
          ...param,
        });
      case OpKind.TX_ROLLUP_SUBMIT_BATCH:
        return createTxRollupBatchOperation({
          ...param,
        });
      case OpKind.TRANSFER_TICKET:
        return createTransferTicketOperation({
          ...param,
        });
      case OpKind.SMART_ROLLUP_ADD_MESSAGES:
        return createSmartRollupAddMessagesOperation({
          ...param,
        });
      case OpKind.SMART_ROLLUP_ORIGINATE: {
        return createSmartRollupOriginateOperation({
          ...param,
        });
      }
      default:
        throw new InvalidOperationKindError((param as any).kind);
    }
  }

  /**
   *
   * @description Add a group operation to the batch. Operation will be applied in the order they are in the params array
   *
   * @param params Operations parameter
   */
  with(params: ParamsWithKind[]) {
    for (const param of params) {
      switch (param.kind) {
        case OpKind.TRANSACTION:
          this.withTransfer(param);
          break;
        case OpKind.ORIGINATION:
          this.withOrigination(param);
          break;
        case OpKind.DELEGATION:
          this.withDelegation(param);
          break;
        case OpKind.ACTIVATION:
          this.withActivation(param);
          break;
        case OpKind.REGISTER_GLOBAL_CONSTANT:
          this.withRegisterGlobalConstant(param);
          break;
        case OpKind.INCREASE_PAID_STORAGE:
          this.withIncreasePaidStorage(param);
          break;
        case OpKind.TX_ROLLUP_ORIGINATION:
          this.withTxRollupOrigination(param);
          break;
        case OpKind.TX_ROLLUP_SUBMIT_BATCH:
          this.withTxRollupSubmitBatch(param);
          break;
        case OpKind.TRANSFER_TICKET:
          this.withTransferTicket(param);
          break;
        case OpKind.SMART_ROLLUP_ADD_MESSAGES:
          this.withSmartRollupAddMessages(param);
          break;
        case OpKind.SMART_ROLLUP_ORIGINATE:
          this.withSmartRollupOriginate(param);
          break;
        default:
          throw new InvalidOperationKindError((param as any).kind);
      }
    }

    return this;
  }

  async toPrepare() {
    const publicKeyHash = await this.signer.publicKeyHash();
    const publicKey = await this.signer.publicKey();
    const estimates = await this.estimator.batch(this.operations);

    const revealNeeded = await this.isRevealOpNeeded(this.operations, publicKeyHash);
    let i = revealNeeded ? 1 : 0;

    const ops: RPCOperation[] = [];
    for (const op of this.operations) {
      if (isOpWithFee(op)) {
        const estimated = await this.estimate(op, async () => estimates[i]);
        ops.push(await this.getRPCOp({ ...op, ...estimated }));
      } else {
        ops.push({ ...op });
      }
      i++;
    }
    if (revealNeeded) {
      const reveal: withKind<RevealParams, OpKind.REVEAL> = { kind: OpKind.REVEAL };
      const estimatedReveal = await this.estimate(reveal, async () => estimates[0]);
      ops.unshift(await createRevealOperation({ ...estimatedReveal }, publicKeyHash, publicKey));
    }

    return ops;
  }

  /**
   *
   * @description Forge and Inject the operation batch
   *
   * @param params Optionally specify the source of the operation
   */
  async send(params?: { source?: string }) {
    const publicKeyHash = await this.signer.publicKeyHash();
    const publicKey = await this.signer.publicKey();
    const estimates = await this.estimator.batch(this.operations);

    const revealNeeded = await this.isRevealOpNeeded(this.operations, publicKeyHash);
    let i = revealNeeded ? 1 : 0;

    const ops: RPCOperation[] = [];
    for (const op of this.operations) {
      if (isOpWithFee(op)) {
        const estimated = await this.estimate(op, async () => estimates[i]);
        ops.push(await this.getRPCOp({ ...op, ...estimated }));
      } else {
        ops.push({ ...op });
      }
      i++;
    }
    if (revealNeeded) {
      const reveal: withKind<RevealParams, OpKind.REVEAL> = { kind: OpKind.REVEAL };
      const estimatedReveal = await this.estimate(reveal, async () => estimates[0]);
      ops.unshift(await createRevealOperation({ ...estimatedReveal }, publicKeyHash, publicKey));
    }

    const source = (params && params.source) || publicKeyHash;
    const prepared = await this.prepareOperation({
      operation: ops,
      source,
    });
    const opBytes = await this.forge(prepared);
    const { hash, context, forgedBytes, opResponse } = await this.signAndInject(opBytes);
    return new BatchOperation(hash, ops, source, forgedBytes, opResponse, context);
  }
}

export class RPCBatchProvider {
  constructor(private context: Context, private estimator: EstimationProvider) {}

  /***
   *
   * @description Batch a group of operation together. Operations will be applied in the order in which they are added to the batch
   *
   * @param params List of operation to batch together
   */
  batch(params?: ParamsWithKind[]) {
    const batch = new OperationBatch(this.context, this.estimator);

    if (Array.isArray(params)) {
      batch.with(params);
    }

    return batch;
  }
}

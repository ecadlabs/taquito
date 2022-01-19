import { Context } from '../context';
import { ContractMethod } from '../contract/contract-methods/contract-method-flat-param';
import { EstimationProvider, ContractProvider } from '../contract/interface';
import {
  createOriginationOperation,
  createRegisterGlobalConstantOperation,
  createRevealOperation,
  createSetDelegateOperation,
  createTransferOperation,
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
} from '../operations/types';
import { OpKind } from '@taquito/rpc';
import { ContractMethodObject } from '../contract/contract-methods/contract-method-object-param';
import { 
  validateAddress, 
  validateKeyHash, 
  InvalidAddressError, 
  InvalidKeyHashError, 
  ValidationResult 
} from '@taquito/utils'

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
      throw new InvalidAddressError(`Invalid 'to' address: ${params.to}`)
    }
    this.operations.push({ kind: OpKind.TRANSACTION, ...params });
    return this;
  }

  /**
   *
   * @description Add a transaction operation to the batch
   *
   * @param params Transfer operation parameter
   */
  withContractCall(params: ContractMethod<ContractProvider> | ContractMethodObject<ContractProvider>) {
    return this.withTransfer(params.toTransferParams());
  }

  /**
   *
   * @description Add a delegation operation to the batch
   *
   * @param params Delegation operation parameter
   */
  withDelegation(params: DelegateParams) {
    if (validateAddress(params.source) !== ValidationResult.VALID) {
      throw new InvalidAddressError(`Invalid source address: ${params.delegate}`);
    }
    if (params.delegate && validateAddress(params.delegate) !== ValidationResult.VALID) {
      throw new InvalidAddressError(`Invalid delegate address: ${params.delegate}`);
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
      throw new InvalidKeyHashError(`Invalid Key Hash: ${pkh}`);
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
  withOrigination(params: OriginateParams) {
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

  private async getRPCOp(param: ParamsWithKind) {
    switch (param.kind) {
      case OpKind.TRANSACTION:
        return createTransferOperation({
          ...param,
        });
      case OpKind.ORIGINATION:
        return createOriginationOperation(
          await this.context.parser.prepareCodeOrigination({
          ...param,
        }));
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
      default:
        throw new Error(`Unsupported operation kind: ${(param as any).kind}`);
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
        default:
          throw new Error(`Unsupported operation kind: ${(param as any).kind}`);
      }
    }

    return this;
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
      const reveal: withKind<RevealParams, OpKind.REVEAL> = { kind: OpKind.REVEAL }
      const estimatedReveal = await this.estimate(reveal, async () => estimates[0]);
      ops.unshift(await createRevealOperation({ ...estimatedReveal }, publicKeyHash, publicKey))
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
  constructor(private context: Context, private estimator: EstimationProvider) { }

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

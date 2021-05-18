import { Context } from '../context';
import { ContractMethod } from '../contract/contract';
import { EstimationProvider, ContractProvider } from '../contract/interface';
import {
  createOriginationOperation,
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
  isOpRequireReveal,
} from '../operations/types';
import { OpKind } from '@taquito/rpc';

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
    this.operations.push({ kind: OpKind.TRANSACTION, ...params });
    return this;
  }

  /**
   *
   * @description Add a transaction operation to the batch
   *
   * @param params Transfer operation parameter
   */
  withContractCall(params: ContractMethod<ContractProvider>) {
    return this.withTransfer(params.toTransferParams());
  }

  /**
   *
   * @description Add a delegation operation to the batch
   *
   * @param params Delegation operation parameter
   */
  withDelegation(params: DelegateParams) {
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
    const ops: RPCOperation[] = [];
    let i = 0;
    let opRequireReveal = false;
    for (const op of this.operations) {
      if(isOpRequireReveal(op)){
        opRequireReveal = true;
      }
      if (isOpWithFee(op)) {
        const estimated = await this.estimate(op, async () => estimates[i]);
        ops.push(await this.getRPCOp({ ...op, ...estimated }));
      } else {
        ops.push({ ...op });
      }
      i++;
    }
    if(opRequireReveal) {
      const estimateReveal = await this.estimator.reveal();
      if(estimateReveal){
        const reveal: withKind<RevealParams, OpKind.REVEAL> = { kind: OpKind.REVEAL }
        const estimatedReveal = await this.estimate(reveal, async () => estimateReveal);
        ops.unshift(await createRevealOperation({ ...estimatedReveal}, publicKeyHash, publicKey))
      }
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

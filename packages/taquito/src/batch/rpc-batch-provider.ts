import { Context } from '../context';
import { ContractMethod } from '../contract/contract';
import { EstimationProvider } from '../contract/interface';
import {
  createOriginationOperation,
  createSetDelegateOperation,
  createTransferOperation,
} from '../contract/prepare';
import { BatchOperation } from '../operations/batch-operation';
import { OperationEmitter } from '../operations/operation-emitter';
import {
  ActivationParams,
  DelegateParams,
  OriginateParams,
  RPCActivateOperation,
  RPCDelegateOperation,
  RPCOperation,
  RPCOriginationOperation,
  RPCTransferOperation,
  TransferParams,
} from '../operations/types';

type withKind<T, K> = T & { kind: K };

type withParams =
  | withKind<OriginateParams, 'origination'>
  | withKind<DelegateParams, 'delegation'>
  | withKind<TransferParams, 'transaction'>
  | withKind<ActivationParams, 'activate_account'>;

export class OperationBatch extends OperationEmitter {
  private operations: (() => Promise<RPCOperation>)[] = [];

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
    const opFactory = async () => {
      const estimate = await this.estimate(params, this.estimator.transfer.bind(this.estimator));
      return createTransferOperation({
        ...params,
        ...estimate,
      });
    };

    this.operations.push(opFactory);
    return this;
  }

  /**
   *
   * @description Add a transaction operation to the batch
   *
   * @param params Transfer operation parameter
   */
  withContractCall(params: ContractMethod) {
    return this.withTransfer(params.toTransferParams());
  }

  /**
   *
   * @description Add a delegation operation to the batch
   *
   * @param params Delegation operation parameter
   */
  withDelegation(params: DelegateParams) {
    const opFactory = async () => {
      const estimate = await this.estimate(params, this.estimator.setDelegate.bind(this.estimator));
      return createSetDelegateOperation({
        ...params,
        ...estimate,
      });
    };

    this.operations.push(opFactory);
    return this;
  }

  /**
   *
   * @description Add an activation operation to the batch
   *
   * @param params Activation operation parameter
   */
  withActivation({ pkh, secret }: ActivationParams) {
    const opFactory = async () => {
      const operation: RPCActivateOperation = {
        kind: 'activate_account',
        pkh,
        secret,
      };
      return operation;
    };

    this.operations.push(opFactory);
    return this;
  }

  /**
   *
   * @description Add an origination operation to the batch
   *
   * @param params Origination operation parameter
   */
  withOrigination(params: OriginateParams) {
    const opFactory = async () => {
      const estimate = await this.estimate(params, this.estimator.originate.bind(this.estimator));
      return createOriginationOperation({
        ...params,
        ...estimate,
      });
    };

    this.operations.push(opFactory);
    return this;
  }

  private isOpWithFee(
    op: RPCOperation
  ): op is RPCDelegateOperation | RPCOriginationOperation | RPCTransferOperation {
    return ['transaction', 'delegation', 'origination'].indexOf(op.kind) !== -1;
  }

  /**
   * @description Provide an estimate of total fees, gas and storage (does not account for reveal)
   */
  async getTotals() {
    let totalGas = 0;
    let totalStorage = 0;
    let totalFee = 0;

    const operations = await this.getOperations();

    for (const op of operations) {
      if (this.isOpWithFee(op)) {
        totalFee += op.fee;
        totalGas += op.gas_limit;
        totalStorage += op.storage_limit;
      }
    }

    return {
      totalFee,
      totalGas,
      totalStorage,
    };
  }

  private async getOperations() {
    const operations: RPCOperation[] = [];
    for (const opFactory of this.operations) {
      const op = await opFactory();
      operations.push(op);
    }
    return operations;
  }

  /**
   *
   * @description Add a group operation to the batch. Operation will be applied in the order they are in the params array
   *
   * @param params Operations parameter
   */
  with(params: withParams[]) {
    for (const param of params) {
      switch (param.kind) {
        case 'transaction':
          this.withTransfer(param);
          break;
        case 'origination':
          this.withOrigination(param);
          break;
        case 'delegation':
          this.withDelegation(param);
          break;
        case 'activate_account':
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
    const operation = await this.getOperations();
    const source = (params && params.source) || (await this.signer.publicKeyHash());
    const opBytes = await this.prepareAndForge({
      operation,
      source,
    });
    const { hash, context, forgedBytes, opResponse } = await this.signAndInject(opBytes);
    return new BatchOperation(hash, operation, source, forgedBytes, opResponse, context);
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
  batch(params?: withParams[]) {
    const batch = new OperationBatch(this.context, this.estimator);

    if (Array.isArray(params)) {
      batch.with(params);
    }

    return batch;
  }
}

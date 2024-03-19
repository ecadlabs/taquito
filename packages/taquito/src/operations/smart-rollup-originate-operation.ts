import {
  OperationContentsAndResult,
  OperationContentsAndResultSmartRollupOriginate,
  OperationContentsSmartRollupOriginate,
  OpKind,
} from '@taquito/rpc';
import { Context } from '../context';
import { Operation } from './operations';
import {
  FeeConsumingOperation,
  ForgedBytes,
  GasConsumingOperation,
  StorageConsumingOperation,
} from './types';

/**
 *
 * @description SmartRollupOriginate Operation provides utility to fetch properties for Operation of kind SmartRollupOriginate
 *
 */
export class SmartRollupOriginateOperation
  extends Operation
  implements GasConsumingOperation, StorageConsumingOperation, FeeConsumingOperation
{
  constructor(
    hash: string,
    private readonly params: OperationContentsSmartRollupOriginate,
    public readonly source: string,
    raw: ForgedBytes,
    private readonly preResults: OperationContentsAndResult[],
    context: Context
  ) {
    super(hash, raw, [], context);
  }

  get preapplyResults() {
    const smartRollupOriginateOp =
      Array.isArray(this.preResults) &&
      (this.preResults.find(
        (op) => op.kind === OpKind.SMART_ROLLUP_ORIGINATE
      ) as OperationContentsAndResultSmartRollupOriginate);
    const result =
      smartRollupOriginateOp &&
      smartRollupOriginateOp.metadata &&
      smartRollupOriginateOp.metadata.operation_result;
    return result ? result : undefined;
  }

  get operationResults() {
    const smartRollupOriginateOp =
      Array.isArray(this.results) &&
      (this.results.find(
        (op) => op.kind === OpKind.SMART_ROLLUP_ORIGINATE
      ) as OperationContentsAndResultSmartRollupOriginate);
    const result =
      smartRollupOriginateOp &&
      smartRollupOriginateOp.metadata &&
      smartRollupOriginateOp.metadata.operation_result;
    return result ? result : undefined;
  }

  get smartRollupAddress() {
    return this.operationResults && this.operationResults.address;
  }

  get genesisCommitmentHash() {
    return this.operationResults && this.operationResults.genesis_commitment_hash;
  }

  get smartRollupSize() {
    return this.operationResults && this.operationResults.size;
  }

  get status() {
    return this.operationResults?.status ?? 'unknown';
  }

  get fee() {
    return Number(this.params.fee);
  }

  get gasLimit() {
    return Number(this.params.gas_limit);
  }

  get storageLimit() {
    return Number(this.params.storage_limit);
  }

  get consumedMilliGas() {
    return this.operationResults?.consumed_milligas;
  }

  get pvmKind() {
    return this.params.pvm_kind;
  }

  get kernel() {
    return this.params.kernel;
  }

  get errors() {
    return this.operationResults?.errors;
  }
}

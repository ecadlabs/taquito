import {
  OperationContentsAndResult,
  OperationContentsAndResultOrigination,
  OperationContentsOrigination,
} from '@taquito/rpc';
import BigNumber from 'bignumber.js';
import { Context } from '../context';
import { DefaultContractType } from '../contract/contract';
import { RpcContractProvider } from '../contract/rpc-contract-provider';
import { OriginationOperationError } from './errors';
import { Operation } from './operations';
import {
  FeeConsumingOperation,
  ForgedBytes,
  GasConsumingOperation,
  hasMetadataWithResult,
  StorageConsumingOperation,
} from './types';

/**
 * @description Origination operation provide utility function to fetch newly originated contract
 *
 * @warn Currently support only one origination per operation
 */
export class OriginationOperation<TContract extends DefaultContractType = DefaultContractType>
  extends Operation
  implements GasConsumingOperation, StorageConsumingOperation, FeeConsumingOperation
{
  /**
   * @description Contract address of the newly originated contract
   */
  public readonly contractAddress?: string;

  constructor(
    hash: string,
    private readonly params: OperationContentsOrigination,
    raw: ForgedBytes,
    results: OperationContentsAndResult[],
    context: Context,
    private contractProvider: RpcContractProvider
  ) {
    super(hash, raw, results, context);

    const originatedContracts = this.operationResults && this.operationResults.originated_contracts;
    if (Array.isArray(originatedContracts)) {
      this.contractAddress = originatedContracts[0];
    }
  }

  get status() {
    return this.operationResults?.status ?? 'unknown';
  }

  get operationResults() {
    const originationOp =
      Array.isArray(this.results) &&
      (this.results.find((op) => op.kind === 'origination') as
        | OperationContentsAndResultOrigination
        | undefined);

    const result =
      originationOp &&
      hasMetadataWithResult(originationOp) &&
      originationOp.metadata.operation_result;
    return result ? result : undefined;
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

  get consumedGas() {
    BigNumber.config({ DECIMAL_PLACES: 0, ROUNDING_MODE: BigNumber.ROUND_UP });
    return this.consumedMilliGas
      ? new BigNumber(this.consumedMilliGas).dividedBy(1000).toString()
      : undefined;
  }

  get consumedMilliGas() {
    return this.operationResults?.consumed_milligas;
  }

  get storageDiff() {
    const storageDiff = this.operationResults && this.operationResults.paid_storage_size_diff;
    return storageDiff ? storageDiff : undefined;
  }

  get storageSize() {
    const storageSize = this.operationResults && this.operationResults.storage_size;
    return storageSize ? storageSize : undefined;
  }

  get errors() {
    return this.operationResults?.errors;
  }

  /**
   * @description Provide the contract abstract of the newly originated contract
   * @throws {@link OriginationOperationError}
   */
  async contract(confirmations?: number, timeout?: number) {
    if (!this.contractAddress) {
      throw new OriginationOperationError('No contract was originated in this operation');
    }

    await this.confirmation(confirmations, timeout);
    return this.contractProvider.at<TContract>(this.contractAddress);
  }
}

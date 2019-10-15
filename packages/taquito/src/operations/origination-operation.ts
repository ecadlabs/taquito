import { OperationContentsAndResult, OperationContentsAndResultOrigination } from '@taquito/rpc';
import { Context } from '../context';
import { RpcContractProvider } from '../contract/rpc-contract-provider';
import { Operation } from './operations';
import { ForgedBytes } from './types';

type Results = OperationContentsAndResult[];

/**
 * @description Origination operation provide utility function to fetch newly originated contract
 *
 * @warn Currently support only one origination per operation
 */
export class OriginationOperation extends Operation {
  /**
   * @description Contract address of the newly originated contract
   */
  public readonly contractAddress?: string;

  constructor(
    hash: string,
    raw: ForgedBytes,
    results: Results,
    context: Context,
    private contractProvider: RpcContractProvider
  ) {
    super(hash, raw, results, context);

    const originatedContracts = this.operationResults && this.operationResults.originated_contracts;
    if (Array.isArray(originatedContracts)) {
      this.contractAddress = originatedContracts[0];
    }
  }

  private get operationResults() {
    const originationOp =
      Array.isArray(this.results) &&
      (this.results.find(op => op.kind === 'origination') as OperationContentsAndResultOrigination);
    return originationOp && originationOp.metadata && originationOp.metadata.operation_result;
  }

  get consumedGas() {
    return this.operationResults && this.operationResults.consumed_gas;
  }

  get storageDiff() {
    return this.operationResults && this.operationResults.paid_storage_size_diff;
  }

  get storageSize() {
    return this.operationResults && this.operationResults.storage_size;
  }

  get errors() {
    return this.operationResults && this.operationResults.errors;
  }

  /**
   * @description Provide the contract abstract of the newly originated contract
   */
  async contract(confirmations?: number, interval?: number, timeout?: number) {
    if (!this.contractAddress) {
      throw new Error('No contract was originated in this operation');
    }

    await this.confirmation(confirmations, interval, timeout);
    return this.contractProvider.at(this.contractAddress);
  }
}

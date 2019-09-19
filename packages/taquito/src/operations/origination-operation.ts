import { Context } from '../context';
import { RpcContractProvider } from '../contract/rpc-contract-provider';
import { Operation } from './operations';

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
    raw: {},
    results: any,
    context: Context,
    private contractProvider: RpcContractProvider
  ) {
    super(hash, raw, results, context);

    const originationOp = Array.isArray(results) && results.find(op => op.kind === 'origination');

    const originatedContracts =
      originationOp &&
      originationOp.metadata &&
      originationOp.metadata.operation_result &&
      originationOp.metadata.operation_result.originated_contracts;
    if (Array.isArray(originatedContracts)) {
      this.contractAddress = originatedContracts[0];
    }
  }

  /**
   * @description Provide the contract abstract of the newly originated contract
   */
  async contract() {
    if (!this.contractAddress) {
      throw new Error('No contract was originated in this operation');
    }

    await this.confirmation();
    return this.contractProvider.at(this.contractAddress);
  }
}

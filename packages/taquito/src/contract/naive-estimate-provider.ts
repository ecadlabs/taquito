import { DEFAULT_FEE, DEFAULT_GAS_LIMIT, DEFAULT_STORAGE_LIMIT } from '../constants';
import { OriginateParams, TransferParams, ParamsWithKind } from '../operations/types';
import { Estimate } from './estimate';
import { EstimationProvider } from './interface';

/**
 * @description Naïve implementation of an estimate provider. Will work for basic transaction but your operation risk to fail if they are more complex (smart contract interaction)
 */
export class NaiveEstimateProvider implements EstimationProvider {
  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for an origination operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param OriginationOperation Originate operation parameter
   */
  async originate({
    fee = DEFAULT_FEE.ORIGINATION,
    storageLimit = DEFAULT_STORAGE_LIMIT.ORIGINATION,
    gasLimit = DEFAULT_GAS_LIMIT.ORIGINATION,
  }: OriginateParams) {
    return new Estimate(gasLimit, storageLimit, 185, fee);
  }

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for an transfer operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param TransferOperation Originate operation parameter
   */
  async transfer({
    fee = DEFAULT_FEE.TRANSFER,
    storageLimit = DEFAULT_STORAGE_LIMIT.TRANSFER,
    gasLimit = DEFAULT_GAS_LIMIT.TRANSFER,
  }: TransferParams) {
    return new Estimate(gasLimit, storageLimit, 162, fee);
  }

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for a delegate operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param Estimate
   */
  async setDelegate({
    fee = DEFAULT_FEE.DELEGATION,
    gasLimit = DEFAULT_GAS_LIMIT.DELEGATION,
  }): Promise<Estimate> {
    return new Estimate(gasLimit, 0, 157, fee);
  }

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for a delegate operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param Estimate
   */
  async registerDelegate({
    fee = DEFAULT_FEE.DELEGATION,
    gasLimit = DEFAULT_GAS_LIMIT.DELEGATION,
  }): Promise<Estimate> {
    return new Estimate(gasLimit, 0, 157, fee);
  }

  async batch(params: ParamsWithKind[]) {
    const estimates: Estimate[] = [];
    for (const param of params) {
      switch (param.kind) {
        case 'transaction':
          estimates.push(await this.transfer(param));
          break;
        case 'origination':
          estimates.push(await this.originate(param));
          break;
        case 'delegation':
          estimates.push(await this.setDelegate(param));
          break;
        case 'activate_account':
          estimates.push(new Estimate(0, 0, 0, 0));
          break;
        default:
          throw new Error(`Unsupported operation kind: ${(param as any).kind}`);
      }
    }
    return estimates;
  }
}

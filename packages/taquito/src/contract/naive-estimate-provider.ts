import { DEFAULT_GAS_LIMIT, DEFAULT_STORAGE_LIMIT, DEFAULT_FEE } from '../constants';
import { OriginateParams, TransferParams } from '../operations/types';
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
}

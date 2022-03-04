import { DEFAULT_FEE, DEFAULT_GAS_LIMIT, DEFAULT_STORAGE_LIMIT, Protocols } from '../constants';
import {
  OriginateParams,
  TransferParams,
  ParamsWithKind,
  RegisterGlobalConstantParams,
} from '../operations/types';
import { Estimate } from './estimate';
import { EstimationProvider } from '../estimate/estimate-provider-interface';

/**
 * @description Naïve implementation of an estimate provider. Will work for basic transaction but your operation risk to fail if they are more complex (smart contract interaction)
 *
 * @deprecated Deprecated in favor of RPCEstimateProvider
 */
export class NaiveEstimateProvider implements EstimationProvider {
  private _costPerByte: number;
  constructor(private readonly protocol: Protocols) {
    this._costPerByte = 250;
  }
  registerGlobalConstant(params: RegisterGlobalConstantParams): Promise<Estimate> {
    throw new Error(`Unsupported operation kind: ${(params as any).kind}`);
  }
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
    gasLimit = DEFAULT_GAS_LIMIT.ORIGINATION * 1000,
  }: OriginateParams) {
    return new Estimate(gasLimit, storageLimit, 185, this._costPerByte, fee);
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
    gasLimit = DEFAULT_GAS_LIMIT.TRANSFER * 1000,
  }: TransferParams) {
    return new Estimate(gasLimit, storageLimit, 162, this._costPerByte, fee);
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
    gasLimit = DEFAULT_GAS_LIMIT.DELEGATION * 1000,
  }): Promise<Estimate> {
    return new Estimate(gasLimit, 0, 157, this._costPerByte, fee);
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
    gasLimit = DEFAULT_GAS_LIMIT.DELEGATION * 1000,
  }): Promise<Estimate> {
    return new Estimate(gasLimit, 0, 157, this._costPerByte, fee);
  }

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for a reveal operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param Estimate
   */
  async reveal() {
    return new Estimate(
      DEFAULT_GAS_LIMIT.REVEAL * 1000,
      DEFAULT_STORAGE_LIMIT.REVEAL,
      64,
      this._costPerByte,
      DEFAULT_FEE.REVEAL
    );
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
          estimates.push(new Estimate(0, 0, 0, this._costPerByte, 0));
          break;
        default:
          throw new Error(`Unsupported operation kind: ${(param as any).kind}`);
      }
    }
    return estimates;
  }
}

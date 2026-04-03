import { MempoolFilterResponse, RpcRatio } from '@taquito/rpc';

export interface FeeParams {
  minimalFeeMutez: number;
  feePerGasMutez: number;
  feePerByteMutez: number;
}

export const DEFAULT_FEE_PARAMS: FeeParams = {
  minimalFeeMutez: 100,
  feePerGasMutez: 0.1,
  feePerByteMutez: 1,
};

const parseRatio = (value: RpcRatio | undefined): number | undefined => {
  if (!Array.isArray(value) || value.length < 2) {
    return;
  }

  const numerator = Number(value[0]);
  const denominator = Number(value[1]);

  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
    return;
  }

  return numerator / denominator;
};

export const feeParamsFromMempoolFilter = (
  response?: Pick<
    MempoolFilterResponse,
    'minimal_fees' | 'minimal_nanotez_per_gas_unit' | 'minimal_nanotez_per_byte'
  >
): FeeParams => {
  // L1 historically behaves like Taquito's long-standing defaults. Tezos X keeps the
  // same fee formula shape, but these mempool values become material and may change
  // over time, so estimation must read them from RPC instead of hardcoding them.
  const minimalFeeMutez = Number(response?.minimal_fees);
  const feePerGasNanotez = parseRatio(response?.minimal_nanotez_per_gas_unit);
  const feePerByteNanotez = parseRatio(response?.minimal_nanotez_per_byte);

  return {
    minimalFeeMutez: Number.isFinite(minimalFeeMutez)
      ? minimalFeeMutez
      : DEFAULT_FEE_PARAMS.minimalFeeMutez,
    feePerGasMutez:
      // `mempool/filter` returns nanotez ratios, while `Estimate` works in mutez.
      typeof feePerGasNanotez === 'number'
        ? feePerGasNanotez / 1000
        : DEFAULT_FEE_PARAMS.feePerGasMutez,
    feePerByteMutez:
      typeof feePerByteNanotez === 'number'
        ? feePerByteNanotez / 1000
        : DEFAULT_FEE_PARAMS.feePerByteMutez,
  };
};

export interface EstimateProperties {
  milligasLimit: number;
  storageLimit: number;
  opSize: number;
  minimalFeePerStorageByteMutez: number;
  baseFeeMutez?: number;
  feeParams?: FeeParams;
}

/**
 * Examples of use :
 *
 *  Estimate a transfer operation :
 * ```
 * // Assuming that provider and signer are already configured...
 *
 * const amount = 2;
 * const address = 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY';
 *
 * // Estimate gasLimit, storageLimit and fees for a transfer operation
 * const est = await Tezos.estimate.transfer({ to: address, amount: amount })
 * console.log(est.burnFeeMutez, est.gasLimit, est.minimalFeeMutez, est.storageLimit,
 *  est.suggestedFeeMutez, est.totalCost, est.usingBaseFeeMutez)
 *
 * ```
 *
 * Estimate a contract origination :
 * ```
 * // generic.json is referring to a Michelson Smart Contract
 *
 * const genericMultisigJSON = require('./generic.json')
 * const est = await Tezos.estimate.originate({
 *   code: genericMultisigJSON,
 *   storage: {
 *     stored_counter: 0,
 *     threshold: 1,
 *     keys: ['edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t']
 *   }
 * })
 * console.log(est.burnFeeMutez, est.gasLimit, est.minimalFeeMutez, est.storageLimit,
 *   est.suggestedFeeMutez, est.totalCost, est.usingBaseFeeMutez)
 *
 * ```
 *
 * Fee estimation keeps the same overall formula shape on Tezos L1 and on Tezos X / Tezlink:
 * a fixed minimal fee plus byte and gas-price components. The important difference is that on
 * Tezos X the byte fee and gas-price terms exposed by `mempool/filter` are material and may
 * change over time, while on L1 they have historically been close to Taquito's long-standing
 * defaults. `Estimate` therefore accepts fee parameters computed by the estimator instead of
 * assuming L1 values internally.
 */
export class Estimate {
  constructor(
    private readonly _milligasLimit: number | string,
    private readonly _storageLimit: number | string,
    public readonly opSize: number | string,
    private readonly minimalFeePerStorageByteMutez: number | string,
    /**
     * Base fee in mutez (1 mutez = 1e10−6 tez)
     */
    private readonly baseFeeMutez: number | string = DEFAULT_FEE_PARAMS.minimalFeeMutez,
    private readonly feeParams: FeeParams = DEFAULT_FEE_PARAMS
  ) {}

  /**
   * The number of Mutez that will be burned for the storage of the [operation](https://tezos.gitlab.io/user/glossary.html#operations). (Storage + Allocation fees)
   */
  get burnFeeMutez() {
    return this.roundUp(Number(this.storageLimit) * Number(this.minimalFeePerStorageByteMutez));
  }

  /**
   *  The limit on the amount of storage an [operation](https://tezos.gitlab.io/user/glossary.html#operations) can use with 20 buffer.
   */
  get storageLimit() {
    return Math.max(Number(this._storageLimit), 0);
  }

  /**
   * The limit on the amount of [gas](https://tezos.gitlab.io/user/glossary.html#gas) a given operation can consume with 100 buffer depends on the operation.
   */
  get gasLimit() {
    return this.roundUp(Number(this._milligasLimit) / 1000);
  }

  private get operationFeeMutez() {
    return (
      this.gasLimit * this.feeParams.feePerGasMutez +
      Number(this.opSize) * this.feeParams.feePerByteMutez
    );
  }

  private roundUp(nanotez: number) {
    return Math.ceil(Number(nanotez));
  }

  /**
   * Minimum fees for the [operation](https://tezos.gitlab.io/user/glossary.html#operations) according to [baker](https://tezos.gitlab.io/user/glossary.html#baker) defaults.
   */
  get minimalFeeMutez() {
    return this.roundUp(this.operationFeeMutez + this.feeParams.minimalFeeMutez);
  }

  /**
   * The suggested fee for the operation which includes minimal fees and a small buffer.
   */
  get suggestedFeeMutez() {
    return this.roundUp(this.operationFeeMutez + this.feeParams.minimalFeeMutez * 1.2);
  }

  /**
   * Fees according to your specified base fee will ensure that at least minimum fees are used.
   */
  get usingBaseFeeMutez() {
    return (
      Math.max(Number(this.baseFeeMutez), this.feeParams.minimalFeeMutez) +
      this.roundUp(this.operationFeeMutez)
    );
  }

  /**
   * The sum of `minimalFeeMutez` + `burnFeeMutez`.
   */
  get totalCost() {
    return this.minimalFeeMutez + this.burnFeeMutez;
  }

  /**
   * Since Delphinet, consumed gas is provided in milligas for more precision.
   * This function returns an estimation of the gas that operation will consume in milligas.
   */
  get consumedMilligas() {
    return Number(this._milligasLimit);
  }

  static createEstimateInstanceFromProperties(estimateProperties: EstimateProperties[]) {
    let milligasLimit = 0;
    let storageLimit = 0;
    let opSize = 0;
    let minimalFeePerStorageByteMutez = 0;
    let baseFeeMutez: number | undefined;
    const feeParams = estimateProperties[0]?.feeParams;

    estimateProperties.forEach((estimate) => {
      milligasLimit += estimate.milligasLimit;
      storageLimit += estimate.storageLimit;
      opSize += estimate.opSize;
      minimalFeePerStorageByteMutez = Math.max(
        estimate.minimalFeePerStorageByteMutez,
        minimalFeePerStorageByteMutez
      );
      if (estimate.baseFeeMutez) {
        baseFeeMutez = baseFeeMutez ? baseFeeMutez + estimate.baseFeeMutez : estimate.baseFeeMutez;
      }
    });
    return new Estimate(
      milligasLimit,
      storageLimit,
      opSize,
      minimalFeePerStorageByteMutez,
      baseFeeMutez,
      feeParams
    );
  }

  static createArrayEstimateInstancesFromProperties(estimateProperties: EstimateProperties[]) {
    return estimateProperties.map(
      (x) =>
        new Estimate(
          x.milligasLimit,
          x.storageLimit,
          x.opSize,
          x.minimalFeePerStorageByteMutez,
          x.baseFeeMutez,
          x.feeParams
        )
    );
  }
}

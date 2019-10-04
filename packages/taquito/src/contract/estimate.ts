const MINIMAL_FEE_MUTEZ = 100;
const MINIMAL_FEE_PER_BYTE_MUTEZ = 1;
const MINIMAL_FEE_PER_STORAGE_BYTE_MUTEZ = 1000;
const MINIMAL_FEE_PER_GAS_MUTEZ = 0.1;

const GAS_BUFFER = 100;

export class Estimate {
  constructor(
    private readonly _gasLimit: number | string,
    private readonly _storageLimit: number | string,
    private readonly opSize: number | string,
    /**
     * @description Base fee in mutez (1 mutez = 1e10−6 tez)
     */
    private readonly baseFeeMutez: number | string = MINIMAL_FEE_MUTEZ
  ) {}

  /**
   * @description Burn fee in mutez
   */
  get burnFeeMutez() {
    return this.roundUp(Number(this.storageLimit) * MINIMAL_FEE_PER_STORAGE_BYTE_MUTEZ);
  }

  /**
   * @description Get the estimated storage limit
   */
  get storageLimit() {
    const limit = Math.max(Number(this._storageLimit), 0);
    return limit > 0 ? limit : 0;
  }

  /**
   * @description Suggested gasLimit for operation
   */
  get gasLimit() {
    return Number(this._gasLimit) + GAS_BUFFER;
  }

  private get operationFeeMutez() {
    return (
      this.gasLimit * MINIMAL_FEE_PER_GAS_MUTEZ + Number(this.opSize) * MINIMAL_FEE_PER_BYTE_MUTEZ
    );
  }

  private roundUp(nanotez: number) {
    return Math.ceil(Number(nanotez));
  }

  /**
   * @description Minimum fees for operation according to baker defaults
   */
  get minimalFeeMutez() {
    return this.roundUp(MINIMAL_FEE_MUTEZ + this.operationFeeMutez);
  }

  /**
   * @description Suggested fee for operation (minimal fees plus a small buffer)
   */
  get suggestedFeeMutez() {
    return this.roundUp(this.operationFeeMutez + MINIMAL_FEE_MUTEZ * 2);
  }

  /**
   * @description Fees according to your specified base fee will ensure that at least minimum fees are used
   */
  get usingBaseFeeMutez() {
    return (
      Math.max(Number(this.baseFeeMutez), MINIMAL_FEE_MUTEZ) + this.roundUp(this.operationFeeMutez)
    );
  }

  get totalCost() {
    return this.minimalFeeMutez + this.burnFeeMutez;
  }
}

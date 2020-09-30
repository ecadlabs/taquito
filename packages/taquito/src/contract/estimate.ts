const MINIMAL_FEE_MUTEZ = 100;
const MINIMAL_FEE_PER_BYTE_MUTEZ = 1;
const MINIMAL_FEE_PER_GAS_MUTEZ = 0.1;

const GAS_BUFFER = 100;

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
 */

export class Estimate {
  constructor(
    private readonly _gasLimit: number | string,
    private readonly _storageLimit: number | string,
    private readonly opSize: number | string,
    private readonly minimal_fee_per_storage_byte_mutez: number | string,
    /**
     * @description Base fee in mutez (1 mutez = 1e10−6 tez)
     */
    private readonly baseFeeMutez: number | string = MINIMAL_FEE_MUTEZ
  ) {}

  /**
   * @description The number of Mutez that will be burned for the storage of the [operation](https://tezos.gitlab.io/user/glossary.html#operations). (Storage + Allocation fees)
   */
  get burnFeeMutez() {
    return this.roundUp(Number(this.storageLimit) * Number(this.minimal_fee_per_storage_byte_mutez));
  }

  /**
   * @description  The limit on the amount of storage an [operation](https://tezos.gitlab.io/user/glossary.html#operations) can use.
   */
  get storageLimit() {
    const limit = Math.max(Number(this._storageLimit), 0);
    return limit > 0 ? limit : 0;
  }

  /**
   * @description The limit on the amount of [gas](https://tezos.gitlab.io/user/glossary.html#gas) a given operation can consume.
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
   * @description Minimum fees for the [operation](https://tezos.gitlab.io/user/glossary.html#operations) according to [baker](https://tezos.gitlab.io/user/glossary.html#baker) defaults.
   */
  get minimalFeeMutez() {
    return this.roundUp(MINIMAL_FEE_MUTEZ + this.operationFeeMutez);
  }

  /**
   * @description The suggested fee for the operation which includes minimal fees and a small buffer.
   */
  get suggestedFeeMutez() {
    return this.roundUp(this.operationFeeMutez + MINIMAL_FEE_MUTEZ * 2);
  }

  /**
   * @description Fees according to your specified base fee will ensure that at least minimum fees are used.
   */
  get usingBaseFeeMutez() {
    return (
      Math.max(Number(this.baseFeeMutez), MINIMAL_FEE_MUTEZ) + this.roundUp(this.operationFeeMutez)
    );
  }

  /**
   * @description The sum of `minimalFeeMutez` + `burnFeeMutez`.
   */
  get totalCost() {
    return this.minimalFeeMutez + this.burnFeeMutez;
  }
}

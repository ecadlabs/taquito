export interface ContractProvider {
  /**
   *
   * @param contract Address of the contract
   */
  getSchema<T>(contract: string): T
  /**
   *
   * @param contract Address of the contract
   */
  getStorage<T>(contract: string): T
}

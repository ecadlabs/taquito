export type ContractSchema = unknown

export interface ContractProvider {
  /**
   *
   * @param contract Address of the contract
   */
  getStorage<T>(contract: string, schema?: ContractSchema): Promise<T>
}

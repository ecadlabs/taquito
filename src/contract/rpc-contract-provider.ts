import { RpcClient } from '../rpc/rpc'
import { ContractProvider, ContractSchema } from './interface'
import { Schema } from '@ecadlabs/tezos-parser'

export class RpcContractProvider implements ContractProvider {
  constructor(private rpc: RpcClient) {}

  /**
   *
   * @description Return a well formatted json object of the contract storage
   *
   * @param contract contract address you want to get the storage from
   * @param schema optional schema can either be the contract script rpc response or a tezos-parser schema
   *
   * @see http://tezos.gitlab.io/master/api/rpc.html#get-block-id-context-contracts-contract-id-script
   */
  async getStorage<T>(contract: string, schema?: ContractSchema): Promise<T> {
    if (!schema) {
      schema = await this.rpc.getScript(contract)
    }

    let contractSchema: Schema
    if (schema instanceof Schema) {
      contractSchema = schema
    } else {
      contractSchema = Schema.fromRPCResponse({ script: schema })
    }

    const storage = await this.rpc.getStorage(contract)

    return contractSchema.Execute(storage) as T // Cast into T because only the caller can know the true type of the storage
  }
}

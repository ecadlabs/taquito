import { RpcClient } from '../rpc/rpc'
import { ContractProvider, ContractSchema } from './interface'
import { Schema } from '@ecadlabs/tezos-parser'

export class RpcContractProvider implements ContractProvider {
  constructor(private rpc: RpcClient) {}
  async getStorage<T>(contract: string, schema?: ContractSchema): Promise<T> {
    if (!schema) {
      schema = await this.rpc.getScript(contract)
    }

    const storage = await this.rpc.getStorage(contract)

    // TODO: Parse into standard json object

    return storage as T // Cast into T because only the caller can know the true type of the storage
  }
}

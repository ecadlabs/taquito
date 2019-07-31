import { TzProvider } from './interface'
import { RpcClient } from '../rpc/rpc'

export class RpcTzProvider implements TzProvider {
  constructor(private rpc: RpcClient) {}

  async getBalance(address: string): Promise<number> {
    const result = await this.rpc.getBalance(address)
    return Number(result)
  }
}

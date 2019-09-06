import { TzProvider } from './interface';
import { RpcClient } from '@tezos-ts/rpc';
import BigNumber from 'bignumber.js';
import { Context } from '../context';

export class RpcTzProvider implements TzProvider {
  constructor(private context: Context) {}

  get rpc() {
    return this.context.rpc;
  }

  async getBalance(address: string): Promise<BigNumber> {
    return this.rpc.getBalance(address);
  }

  async getDelegate(address: string): Promise<string | null> {
    return this.rpc.getDelegate(address);
  }
}

import { TzProvider } from "./interface";
import { RpcClient } from "@tezos-ts/rpc";
import BigNumber from "bignumber.js";

export class RpcTzProvider implements TzProvider {
  constructor(private rpc: RpcClient) {}

  async getBalance(address: string): Promise<BigNumber> {
    return this.rpc.getBalance(address);
  }

  async getDelegate(address: string): Promise<string | null> {
    return this.rpc.getDelegate(address);
  }
}

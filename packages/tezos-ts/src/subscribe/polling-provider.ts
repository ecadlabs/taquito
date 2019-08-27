import { SubscribeProvider } from './interface';
import { RpcClient } from '@tezos-ts/rpc';

export class Subscription {
  constructor(private timeout: NodeJS.Timeout) {}

  public close() {
    clearInterval(this.timeout);
  }
}

export class PollingSubscribeProvider implements SubscribeProvider {
  constructor(private rpc: RpcClient, private readonly POLL_INTERVAL = 20000) {}

  subscribe(_filter: 'head', cb: (hash: string) => void): Subscription {
    let previousHash = '';
    const poll = async () => {
      const hash = await this.rpc.getBlockHash();
      if (hash && hash !== previousHash) {
        previousHash = hash;
        cb(hash);
      }
    };
    const interval = setInterval(async () => {
      await poll();
    }, this.POLL_INTERVAL);
    // tslint:disable-next-line: no-floating-promises
    poll();
    return new Subscription(interval);
  }

  public setRPC(rpc: RpcClient) {
    this.rpc = rpc;
  }
}

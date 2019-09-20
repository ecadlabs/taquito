import { SubscribeProvider } from './interface';
import { Context } from '../context';

class Subscription {
  private errorListeners: Array<(error: Error) => void> = [];
  private messageListeners: Array<(data: string) => void> = [];
  private closeListeners: Array<() => void> = [];
  private interval: any;

  constructor(private readonly context: Context, public readonly POLL_INTERVAL = 20000) {
    let previousHash = '';
    const poll = async () => {
      try {
        const hash = await this.context.rpc.getBlockHash();
        if (hash && hash !== previousHash) {
          previousHash = hash;
          this.call(this.messageListeners, hash);
        }
      } catch (ex) {
        this.call(this.errorListeners, ex);
      }
    };
    this.interval = setInterval(async () => {
      await poll();
    }, this.POLL_INTERVAL);
    // tslint:disable-next-line: no-floating-promises
    poll();
  }

  private call(listeners: Array<(val: any) => void>, value?: string | Error) {
    for (const l of listeners) {
      try {
        l(value);
      } catch (ex) {
        console.error(ex);
      }
    }
  }

  private remove(listeners: Array<any>, value: any) {
    const idx = listeners.indexOf(value);
    if (idx !== -1) {
      listeners.splice(idx, 1);
    }
  }

  public on(type: 'error', cb: (error: Error) => void): void;
  // tslint:disable-next-line: unified-signatures
  public on(type: 'data', cb: (data: string) => void): void;
  public on(type: 'close', cb: () => void): void;

  public on(type: 'data' | 'error' | 'close', cb: any): void {
    switch (type) {
      case 'data':
        this.messageListeners.push(cb);
        break;
      case 'error':
        this.errorListeners.push(cb);
        break;
      case 'close':
        this.closeListeners.push(cb);
        break;
      default:
        throw new Error(`Trying to register on an unsupported event: ${type}`);
    }
  }

  public off(type: 'error', cb: (error: Error) => void): void;
  // tslint:disable-next-line: unified-signatures
  public off(type: 'data', cb: (data: string) => void): void;
  public off(type: 'close', cb: () => void): void;

  public off(type: 'data' | 'error' | 'close', cb: any): void {
    switch (type) {
      case 'data':
        this.remove(this.messageListeners, cb);
        break;
      case 'error':
        this.remove(this.errorListeners, cb);
        break;
      case 'close':
        this.remove(this.closeListeners, cb);
        break;
      default:
        throw new Error(`Trying to unregister on an unsupported event: ${type}`);
    }
  }

  public close() {
    clearInterval(this.interval);
    this.call(this.closeListeners);
  }
}

export class PollingSubscribeProvider implements SubscribeProvider {
  constructor(private context: Context, public readonly POLL_INTERVAL = 20000) {}

  subscribe(_filter: 'head'): Subscription {
    return new Subscription(this.context, this.POLL_INTERVAL);
  }
}

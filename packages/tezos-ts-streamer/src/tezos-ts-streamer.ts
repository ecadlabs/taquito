import { SubscribeProvider } from '@tezos-ts/tezos-ts';
import * as WS from 'ws';

const DEFAULT_STREAMER_URL = 'wss://api.tez.ie/streamer/mainnet/subscribe';

export class Subscription {
  private errorListeners: Array<(error: Error) => void> = [];
  private messageListeners: Array<(data: string) => void> = [];
  private closeListeners: Array<() => void> = [];

  constructor(private readonly ws: WS) {
    ws.onmessage = (event: WS.MessageEvent) => {
      this.call(this.messageListeners, JSON.parse(event.data.toString()));
    };
    ws.onclose = (_event: WS.CloseEvent) => {
      this.call(this.closeListeners);
    };
    ws.onerror = (event: WS.ErrorEvent) => {
      this.call(this.messageListeners, event.error);
    };
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
        console.warn(`Trying to register on an unsupported event: ${type}`);
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
        console.warn(`Trying to unregister on an unsupported event: ${type}`);
    }
  }

  public close() {
    this.ws.close();
  }
}

export class StreamerProvider implements SubscribeProvider {
  constructor(private url: string = DEFAULT_STREAMER_URL) {}

  subscribe(_filter: 'head'): Subscription {
    const ws = new WS(this.url);
    return new Subscription(ws);
  }
}

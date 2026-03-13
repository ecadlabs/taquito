import { BlockResponse, InternalOperationResult } from '@taquito/rpc';
import {
  EventFilter,
  Filter,
  OperationContent,
  SubscribeProvider,
  Subscription,
} from '@taquito/taquito';

class NeverSubscription<T> implements Subscription<T> {
  on(_type: 'error', _cb: (error: Error) => void): void;
  on(_type: 'data', _cb: (data: T) => void): void;
  on(_type: 'close', _cb: () => void): void;
  on(): void {}

  off(_type: 'error', _cb: (error: Error) => void): void;
  off(_type: 'data', _cb: (data: T) => void): void;
  off(_type: 'close', _cb: () => void): void;
  off(): void {}

  close(): void {}
}

export class NeverStreamProvider implements SubscribeProvider {
  subscribe(_filter: 'head'): Subscription<string> {
    return new NeverSubscription<string>();
  }

  subscribeBlock(_filter: 'head'): Subscription<BlockResponse> {
    return new NeverSubscription<BlockResponse>();
  }

  subscribeOperation(_filter: Filter): Subscription<OperationContent> {
    return new NeverSubscription<OperationContent>();
  }

  subscribeEvent(_filter?: EventFilter): Subscription<InternalOperationResult> {
    return new NeverSubscription<InternalOperationResult>();
  }
}

export interface SubscribeProvider {
  subscribe(filter: 'head'): Subscription;
}

export interface Subscription {
  on(type: 'error', cb: (error: Error) => void): void;
  on(type: 'data', cb: (data: string) => void): void;
  on(type: 'close', cb: () => void): void;

  off(type: 'error', cb: (error: Error) => void): void;
  off(type: 'data', cb: (data: string) => void): void;
  off(type: 'close', cb: () => void): void;
  close(): void;
}

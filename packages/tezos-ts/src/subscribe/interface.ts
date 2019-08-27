export interface SubscribeProvider {
  subscribe(filter: 'head', cb: (hash: string) => void): Subscription;
}

export interface Subscription {
  close(): void;
}

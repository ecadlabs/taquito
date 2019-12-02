import { OperationEntry } from '@taquito/rpc';

export type FilterExpression = {
  or?: OpFilter[] | FilterExpression[];
  and?: OpFilter[] | FilterExpression[];
};

export interface OpHashFilter {
  opHash: string;
}

export interface SourceFilter {
  source: string;
}

export interface KindFilter {
  kind: string;
}

export interface DestinationFilter {
  destination: string;
}

export type OpFilter = OpHashFilter | SourceFilter | KindFilter | DestinationFilter;

export type Filter = FilterExpression | FilterExpression[] | OpFilter | OpFilter[];

export interface SubscribeProvider {
  subscribe(filter: 'head'): Subscription<string>;
  subscribeOperation(filter: Filter): Subscription<OperationEntry>;
}

export interface Subscription<T> {
  on(type: 'error', cb: (error: Error) => void): void;
  on(type: 'data', cb: (data: T) => void): void;
  on(type: 'close', cb: () => void): void;

  off(type: 'error', cb: (error: Error) => void): void;
  off(type: 'data', cb: (data: T) => void): void;
  off(type: 'close', cb: () => void): void;
  close(): void;
}

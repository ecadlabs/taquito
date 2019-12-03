import { OperationEntry } from '@taquito/rpc';

export type FilterExpression = {
  or?: ExpressionOrOpFilter[];
  and?: ExpressionOrOpFilter[];
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

export type ExpressionOrOpFilter = OpFilter | FilterExpression

export type Filter = ExpressionOrOpFilter | ExpressionOrOpFilter[];

export type OperationContent = OperationEntry['contents'][0] & {hash: string};

export interface SubscribeProvider {
  subscribe(filter: 'head'): Subscription<string>;
  subscribeOperation(filter: Filter): Subscription<OperationContent>;
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

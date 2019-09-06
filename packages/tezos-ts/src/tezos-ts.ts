import { IndexerClient } from '@tezos-ts/indexer';
import { RpcClient } from '@tezos-ts/rpc';

import { ContractProvider } from './contract/interface';
import { RpcContractProvider } from './contract/rpc-contract-provider';
import { IndexerProvider } from './query/indexer-provider';
import { QueryProvider } from './query/interface';
import { SubscribeProvider } from './subscribe/interface';
import { PollingSubscribeProvider } from './subscribe/polling-provider';
import { TzProvider } from './tz/interface';
import { RpcTzProvider } from './tz/rpc-tz-provider';
import { format } from './format';
import { Signer } from './signer/interface';
import { Context } from './context';
import { NoopSigner } from './signer/noop';
export { SubscribeProvider } from './subscribe/interface';
export interface SetProviderOptions {
  rpc?: string | RpcClient;
  indexer?: string | IndexerClient;
  stream?: string | SubscribeProvider;
  signer?: Signer;
}

/**
 * @description Facade class that surfaces all of the libraries capability and allow it's configuration
 */
export class TezosToolkit {
  private _rpcClient = new RpcClient();
  private _indexerClient: IndexerClient = new IndexerClient();
  private _query!: QueryProvider;
  private _stream!: SubscribeProvider;
  private _options: SetProviderOptions = {};

  private _context: Context = new Context();

  private _tz = new RpcTzProvider(this._context);
  private _contract = new RpcContractProvider(this._context);

  public readonly format = format;

  constructor() {
    this.setProvider({ rpc: this._rpcClient });
  }

  /**
   *
   * @param options rpc url or rpcClient to use to interact with the Tezos network and indexer url to use to interact with the Tezos network
   */
  setProvider({ rpc, indexer, stream, signer }: SetProviderOptions) {
    this.setRpcProvider(rpc);
    this.setIndexerProvider(indexer);
    this.setStreamProvider(stream);
    this.setSignerProvider(signer);
  }

  private setSignerProvider(signer: SetProviderOptions['signer']) {
    if (!this._options.signer && typeof signer === 'undefined') {
      this._context.signer = new NoopSigner();
      this._options.signer = signer;
    } else if (typeof signer !== 'undefined') {
      this._context.signer = signer;
      this._options.signer = signer;
    }
  }

  private setRpcProvider(rpc: SetProviderOptions['rpc']) {
    if (typeof rpc === 'string') {
      this._rpcClient = new RpcClient(rpc);
    } else if (rpc instanceof RpcClient) {
      this._rpcClient = rpc;
    } else {
      this._rpcClient = new RpcClient();
    }
    this._options.rpc = rpc;
    this._context.rpc = this._rpcClient;
  }

  private setIndexerProvider(indexer: SetProviderOptions['indexer']) {
    if (typeof indexer === 'string') {
      this._indexerClient = new IndexerClient(indexer);
    } else if (indexer instanceof IndexerClient) {
      this._indexerClient = indexer;
    } else {
      this._indexerClient = new IndexerClient();
    }

    this._query = new IndexerProvider(this._indexerClient);
    this._options.indexer = indexer;
  }

  private setStreamProvider(stream: SetProviderOptions['stream']) {
    if (typeof stream === 'string') {
      this._stream = new PollingSubscribeProvider(new Context(new RpcClient(stream)));
    } else if (typeof stream !== 'undefined') {
      this._stream = stream;
    } else {
      this._stream = new PollingSubscribeProvider(this._context);
    }
    this._options.stream = stream;
  }

  /**
   * @description Provide access to tezos account management
   */
  get tz(): TzProvider {
    return this._tz;
  }

  /**
   * @description Provide access to smart contract utilities
   */
  get contract(): ContractProvider {
    return this._contract;
  }

  /**
   * @description Provide access to querying utilities backed by an indexer implementation
   */
  get query(): QueryProvider {
    return this._query;
  }

  get stream(): SubscribeProvider {
    return this._stream;
  }

  get rpc(): RpcClient {
    return this._rpcClient;
  }
}

/**
 * @description Default Tezos toolkit instance
 */
export const Tezos = new TezosToolkit();

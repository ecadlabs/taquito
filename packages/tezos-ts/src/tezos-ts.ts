import { RpcClient } from '@tezos-ts/rpc';

import { ContractProvider } from './contract/interface';
import { RpcContractProvider } from './contract/rpc-contract-provider';
import { QueryProvider } from './query/interface';
import { TzProvider } from './tz/interface';
import { IndexerProvider } from './query/indexer-provider';
import { RpcTzProvider } from './tz/rpc-tz-provider';
import { IndexerClient } from '@tezos-ts/indexer';
import { format } from './format';
export interface SetProviderOptions {
  rpc?: string | RpcClient;
  indexer?: string | IndexerClient;
}

/**
 * @description Facade class that surfaces all of the libraries capability and allow it's configuration
 */
export class TezosToolkit {
  private _rpcClient = new RpcClient();
  private _indexerClient: IndexerClient = new IndexerClient();
  private _query!: QueryProvider;
  private _tz!: TzProvider;
  private _contract!: ContractProvider;

  public readonly format = format;

  constructor() {
    this.setProvider({ rpc: this._rpcClient });
  }

  /**
   *
   * @param options rpc url or rpcClient to use to interact with the Tezos network and indexer url to use to interact with the Tezos network
   */
  setProvider({ rpc, indexer }: SetProviderOptions) {
    this.setRpcProvider(rpc);
    this.setIndexerProvider(indexer);
  }

  private setRpcProvider(rpc: SetProviderOptions['rpc']) {
    if (typeof rpc === 'string') {
      this._rpcClient = new RpcClient(rpc);
    } else if (rpc instanceof RpcClient) {
      this._rpcClient = rpc;
    } else {
      this._rpcClient = new RpcClient();
    }
    this._tz = new RpcTzProvider(this._rpcClient);
    this._contract = new RpcContractProvider(this._rpcClient);
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
}

/**
 * @description Default Tezos toolkit instance
 */
export const Tezos = new TezosToolkit();

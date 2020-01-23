import { RpcClient } from '@taquito/rpc';
import { InMemorySigner } from '@taquito/signer';
import { Protocols } from './constants';
import { Context, Config, TaquitoProvider } from './context';
import { ContractProvider, EstimationProvider } from './contract/interface';
import { RpcContractProvider } from './contract/rpc-contract-provider';
import { RPCEstimateProvider } from './contract/rpc-estimate-provider';
import { format } from './format';
import { Signer } from './signer/interface';
import { NoopSigner } from './signer/noop';
import { SubscribeProvider } from './subscribe/interface';
import { PollingSubscribeProvider } from './subscribe/polling-provider';
import { TzProvider } from './tz/interface';
import { RpcTzProvider } from './tz/rpc-tz-provider';
import { Forger } from './forger/interface';
import { RpcForger } from './forger/rpc-forger';
import { RPCBatchProvider } from './batch/rpc-batch-provider';

export * from './signer/interface';
export * from './subscribe/interface';
export * from './forger/interface';
export * from './tz/interface';
export * from './contract';
export * from './contract/big-map';
export * from './constants';

export { OpKind } from './operations/types';

export { TaquitoProvider } from './context';
export { PollingSubscribeProvider } from './subscribe/polling-provider';
export { RpcForger } from './forger/rpc-forger';
export { CompositeForger } from './forger/composite-forger';
export {
  MichelsonMap,
  MichelsonMapKey,
  MapTypecheckError,
  UnitValue,
} from '@taquito/michelson-encoder';

export {
  TezosOperationError,
  TezosOperationErrorWithMessage,
  TezosPreapplyFailureError,
} from './operations/operation-errors';

export { SubscribeProvider } from './subscribe/interface';
export interface SetProviderOptions {
  forger?: Forger;
  rpc?: string | RpcClient;
  stream?: string | SubscribeProvider;
  signer?: Signer;
  protocol?: Protocols;
  config?: Config;
}

/**
 * @description Facade class that surfaces all of the libraries capability and allow it's configuration
 */
export class TezosToolkit {
  private _rpcClient = new RpcClient();
  private _stream!: SubscribeProvider;
  private _options: SetProviderOptions = {};

  private _context: Context = new Context();

  private _tz = new RpcTzProvider(this._context);
  private _estimate = new RPCEstimateProvider(this._context);
  private _contract = new RpcContractProvider(this._context, this._estimate);
  private _batch = new RPCBatchProvider(this._context, this._estimate);

  public readonly format = format;

  constructor() {
    this.setProvider({ rpc: this._rpcClient });
  }

  /**
   * @description Sets configuration on the Tezos Taquito instance. Allows user to choose which signer, rpc client, rpc url, forger and so forth
   *
   * @param options rpc url or rpcClient to use to interact with the Tezos network and  url to use to interact with the Tezos network
   *
   * @example Tezos.setProvider({signer: new InMemorySigner(“edsk...”)})
   * @example Tezos.setProvider({config: {confirmationPollingTimeoutSecond: 300}})
   *
   */
  setProvider({ rpc, stream, signer, protocol, config, forger }: SetProviderOptions) {
    this.setRpcProvider(rpc);
    this.setStreamProvider(stream);
    this.setSignerProvider(signer);
    this.setForgerProvider(forger);

    this._context.proto = protocol;
    this._context.config = config as Required<Config>;
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
    } else if (this._options.rpc === undefined) {
      this._rpcClient = new RpcClient();
    }
    this._options.rpc = rpc;
    this._context.rpc = this._rpcClient;
  }

  private setForgerProvider(forger: SetProviderOptions['forger']) {
    const f = typeof forger === 'undefined' ? new RpcForger(this._context) : forger;
    this._options.forger = f;
    this._context.forger = f;
  }

  private setStreamProvider(stream: SetProviderOptions['stream']) {
    if (typeof stream === 'string') {
      this._stream = new PollingSubscribeProvider(new Context(new RpcClient(stream)));
    } else if (typeof stream !== 'undefined') {
      this._stream = stream;
    } else if (this._options.stream === undefined) {
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

  public batch = this._batch.batch.bind(this._batch);

  /**
   * @description Provide access to operation estimation utilities
   */
  get estimate(): EstimationProvider {
    return this._estimate;
  }

  /**
   * @description Provide access to streaming utilities backed by an streamer implementation
   */
  get stream(): SubscribeProvider {
    return this._stream;
  }

  /**
   * @description Provide access to the currently used rpc client
   */
  get rpc(): RpcClient {
    return this._context.rpc;
  }

  /**
   * @description Provide access to the currently used signer
   */
  get signer() {
    return this._context.signer;
  }

  getFactory<T, K extends Array<any>>(ctor: TaquitoProvider<T, K>) {
    return (...args: K) => {
      return new ctor(this._context, ...args);
    };
  }
}

/**
 * @description Default Tezos toolkit instance
 */
export const Tezos = new TezosToolkit();

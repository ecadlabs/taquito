import { RpcClient } from '@taquito/rpc';
import { importKey } from '@taquito/signer';
import { Protocols } from './constants';
import { Config, Context, TaquitoProvider } from './context';
import { ContractProvider, EstimationProvider } from './contract/interface';
import { Forger } from './forger/interface';
import { RpcForger } from './forger/rpc-forger';
import { format } from './format';
import { Signer } from './signer/interface';
import { NoopSigner } from './signer/noop';
import { SubscribeProvider } from './subscribe/interface';
import { PollingSubscribeProvider } from './subscribe/polling-provider';
import { TzProvider } from './tz/interface';
import { LegacyWalletProvider, Wallet, WalletProvider } from './wallet';
import { OperationFactory } from './wallet/opreation-factory';

export { MichelsonMap, UnitValue } from '@taquito/michelson-encoder';
export * from './constants';
export * from './context';
export { TaquitoProvider } from './context';
export * from './contract';
export * from './contract/big-map';
export { CompositeForger } from './forger/composite-forger';
export * from './forger/interface';
export { RpcForger } from './forger/rpc-forger';
export {
  TezosOperationError,
  TezosOperationErrorWithMessage,
  TezosPreapplyFailureError,
} from './operations/operation-errors';
export { OpKind } from './operations/types';
export * from './signer/interface';
export * from './subscribe/interface';
export { SubscribeProvider } from './subscribe/interface';
export { PollingSubscribeProvider } from './subscribe/polling-provider';
export * from './tz/interface';
export * from './wallet';

export interface SetProviderOptions {
  forger?: Forger;
  wallet?: WalletProvider;
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
  private _wallet: Wallet = new Wallet(this._context);

  public readonly format = format;

  constructor() {
    this.setProvider({ rpc: this._rpcClient });
  }

  /**
   * @description Sets configuration on the Tezos Taquito instance. Allows user to choose which signer, rpc client, rpc url, forger and so forth
   *
   * @param options rpc url or rpcClient to use to interact with the Tezos network
   *
   * @example Tezos.setProvider({rpc: 'https://api.tez.ie/rpc/mainnet', signer: new InMemorySigner.fromSecretKey(“edsk...”)})
   * @example Tezos.setProvider({ config: { confirmationPollingTimeoutSecond: 300 }})
   *
   */

  setProvider({ rpc, stream, signer, protocol, config, forger, wallet }: SetProviderOptions) {
    this.setRpcProvider(rpc);
    this.setStreamProvider(stream);
    this.setSignerProvider(signer);
    this.setForgerProvider(forger);
    this.setWalletProvider(wallet);

    this._context.proto = protocol;
    this._context.config = config as Required<Config>;
  }

  /**
   * @description Sets signer provider on the Tezos Taquito instance.
   *
   * @param options signer to use to interact with the Tezos network
   *
   * @example Tezos.setSignerProvider(new InMemorySigner.fromSecretKey('edsk...'))
   *
   */
  setSignerProvider(signer?: SetProviderOptions['signer']) {
    if (!this._options.signer && typeof signer === 'undefined') {
      this._context.signer = new NoopSigner();
      this._options.signer = signer;
    } else if (typeof signer !== 'undefined') {
      this._context.signer = signer;
      this._options.signer = signer;
    }
  }

  /**
   * @description Sets rpc provider on the Tezos Taquito instance
   *
   * @param options rpc url or rpcClient to use to interact with the Tezos network
   *
   * @example Tezos.setRpcProvider('https://api.tez.ie/rpc/mainnet')
   *
   */
  setRpcProvider(rpc?: SetProviderOptions['rpc']) {
    if (typeof rpc === 'string') {
      this._rpcClient = new RpcClient(rpc);
    } else if (rpc instanceof RpcClient) {
      this._rpcClient = rpc;
    } else if (this._options.rpc === undefined) {
      this._rpcClient = new RpcClient();
    }
    this._options.rpc = this._rpcClient;
    this._context.rpc = this._rpcClient;
  }

  /**
   * @description Sets forger provider on the Tezos Taquito instance
   *
   * @param options forger to use to interact with the Tezos network
   *
   * @example Tezos.setForgerProvider(localForger)
   *
   */
  setForgerProvider(forger?: SetProviderOptions['forger']) {
    const f = typeof forger === 'undefined' ? new RpcForger(this._context) : forger;
    this._options.forger = f;
    this._context.forger = f;
  }

  /**
   * @description Sets wallet provider on the Tezos Taquito instance
   *
   * @param options wallet provider to use to interact with the Tezos network
   *
   * @example Tezos.setWalletProvider(...)
   *
   */
  setWalletProvider(wallet: SetProviderOptions['wallet']) {
    if (!this._options.wallet && typeof wallet === 'undefined') {
      const w = this.getFactory(LegacyWalletProvider)();
      this._options.wallet = w;
      this._context.walletProvider = w;
    } else if (typeof wallet !== 'undefined') {
      this._options.wallet = wallet;
      this._context.walletProvider = wallet;
    }
  }

  /**
   * @description Sets stream provider on the Tezos Taquito instance
   *
   * @param options stream to use to interact with the Tezos network
   *
   * @example Tezos.setStreamProvider(...)
   *
   */
  setStreamProvider(stream?: SetProviderOptions['stream']) {
    if (typeof stream === 'string') {
      this._stream = new PollingSubscribeProvider(new Context(new RpcClient(stream)));
    } else if (typeof stream !== 'undefined') {
      this._stream = stream;
    } else if (this._options.stream === undefined) {
      this._stream = this.getFactory(PollingSubscribeProvider)();
    }
    this._options.stream = stream;
  }

  /**
   * @description Provide access to tezos account management
   */
  get tz(): TzProvider {
    return this._context.tz;
  }

  /**
   * @description Provide access to smart contract utilities
   */
  get contract(): ContractProvider {
    return this._context.contract;
  }

  get wallet(): Wallet {
    return this._wallet;
  }

  get operation(): OperationFactory {
    return this._context.operationFactory;
  }

  public batch = this._context.batch.batch.bind(this._context.batch);

  /**
   * @description Provide access to operation estimation utilities
   */
  get estimate(): EstimationProvider {
    return this._context.estimate;
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

  /**
   * @deprecated Deprecated in favor of setting the signer provider with @taquito/signer importKey
   */
  importKey(privateKeyOrEmail: string, passphrase?: string, mnemonic?: string, secret?: string) {
    return importKey(this, privateKeyOrEmail, passphrase, mnemonic, secret);
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

/**
 * @packageDocumentation
 * @module @taquito/taquito
 */

import { RpcClient, RpcClientInterface } from '@taquito/rpc';
import { RPCBatchProvider } from './batch/rpc-batch-provider';
import { Protocols } from './constants';
import { ConfigConfirmation, ConfigStreamer, Context, TaquitoProvider } from './context';
import { ContractProvider, EstimationProvider } from './contract/interface';
import { Extension } from './extension/extension';
import { Forger } from './forger/interface';
import { RpcForger } from './forger/rpc-forger';
import { format } from './format';
import { GlobalConstantsProvider } from './global-constants/interface-global-constants-provider';
import { NoopGlobalConstantsProvider } from './global-constants/noop-global-constants-provider';
import { Packer } from './packer/interface';
import { RpcPacker } from './packer/rpc-packer';
import { Signer } from './signer/interface';
import { NoopSigner } from './signer/noop';
import { SubscribeProvider } from './subscribe/interface';
import { PollingSubscribeProvider } from './subscribe/polling-provider';
import { TzProvider } from './tz/interface';
import { VERSION } from './version';
import { LegacyWalletProvider, Wallet, WalletProvider } from './wallet';
import { OperationFactory } from './wallet/operation-factory';

export { MichelsonMap, UnitValue } from '@taquito/michelson-encoder';
export * from './constants';
export * from './context';
export { TaquitoProvider } from './context';
export * from './contract';
export * from './contract/big-map';
export { CompositeForger } from './forger/composite-forger';
export * from './forger/interface';
export { RpcForger } from './forger/rpc-forger';
export * from './operations';
export { OperationBatch } from './batch/rpc-batch-provider';
export * from './signer/interface';
export * from './subscribe/interface';
export { SubscribeProvider } from './subscribe/interface';
export { PollingSubscribeProvider } from './subscribe/polling-provider';
export { ObservableSubscription } from './subscribe/observable-subscription';
export * from './tz/interface';
export * from './wallet';
export { Extension } from './extension/extension';
export * from './parser/interface';
export * from './parser/michel-codec-parser';
export * from './parser/noop-parser';
export * from './packer/interface';
export * from './packer/michel-codec-packer';
export * from './packer/rpc-packer';
export * from './global-constants/default-global-constants-provider';
export * from './global-constants/error';
export * from './global-constants/interface-global-constants-provider';

export interface SetProviderOptions {
  forger?: Forger;
  wallet?: WalletProvider;
  rpc?: string | RpcClientInterface;
  stream?: string | SubscribeProvider;
  signer?: Signer;
  protocol?: Protocols;
  config?: Partial<ConfigConfirmation> & Partial<ConfigStreamer>;
  packer?: Packer;
  globalConstantsProvider?: GlobalConstantsProvider;
}

export interface VersionInfo {
  commitHash: string;
  version: string;
}

/**
 * @description Facade class that surfaces all of the libraries capability and allow it's configuration
 *
 * @param _rpc The RPC server to use
 */
export class TezosToolkit {
  private _stream!: SubscribeProvider;
  private _options: SetProviderOptions = {};
  private _rpcClient: RpcClientInterface;
  private _wallet: Wallet;
  private _context: Context;
  /**
   * @deprecated TezosToolkit.batch has been deprecated in favor of TezosToolkit.contract.batch
   *
   */
  public batch: RPCBatchProvider['batch'];

  public readonly format = format;

  constructor(private _rpc: RpcClientInterface | string) {
    if (typeof this._rpc === 'string') {
      this._rpcClient = new RpcClient(this._rpc);
    } else {
      this._rpcClient = this._rpc;
    }
    this._context = new Context(_rpc);
    this._wallet = new Wallet(this._context);
    this.setProvider({ rpc: this._rpcClient });
    // tslint:disable-next-line: deprecation
    this.batch = this._context.batch.batch.bind(this._context.batch);
  }

  /**
   * @description Sets configuration on the Tezos Taquito instance. Allows user to choose which signer, rpc client, rpc url, forger and so forth
   *
   * @param options rpc url or rpcClient to use to interact with the Tezos network
   *
   * @example Tezos.setProvider({rpc: 'https://mainnet.api.tez.ie/', signer: new InMemorySigner.fromSecretKey(“edsk...”)})
   * @example Tezos.setProvider({ config: { confirmationPollingTimeoutSecond: 300 }})
   *
   */

  setProvider({
    rpc,
    stream,
    signer,
    protocol,
    config,
    forger,
    wallet,
    packer,
    globalConstantsProvider
  }: SetProviderOptions) {
    this.setRpcProvider(rpc);
    this.setStreamProvider(stream);
    this.setSignerProvider(signer);
    this.setForgerProvider(forger);
    this.setWalletProvider(wallet);
    this.setPackerProvider(packer);
    this.setGlobalConstantsProvider(globalConstantsProvider);

    this._context.proto = protocol;
    if(config) {
      this._context.setPartialConfig(config);
    }
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
   * @example Tezos.setRpcProvider('https://mainnet.api.tez.ie/')
   *
   */
  setRpcProvider(rpc?: SetProviderOptions['rpc']) {
    if (typeof rpc === 'string') {
      this._rpcClient = new RpcClient(rpc);
    } else if (rpc === undefined) {
      // do nothing, RPC is required in the constructor, do not override it
    }
    else {
      this._rpcClient = rpc;
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
    const f = typeof forger === 'undefined' ? this.getFactory(RpcForger)() : forger;
    this._options.forger = f;
    this._context.forger = f;
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
   * @description Sets wallet provider on the Tezos Taquito instance
   *
   * @param options wallet to use to interact with the Tezos network
   *
   * @example Tezos.setWalletProvider(...)
   *
   */
  setWalletProvider(wallet?: SetProviderOptions['wallet']) {
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
   * @description Sets Packer provider on the Tezos Taquito instance
   *
   * @param options packer to use to interact with the Tezos network
   *
   * @example Tezos.setPackerProvider(new MichelCodecPacker())
   *
   */
  setPackerProvider(packer?: SetProviderOptions['packer']) {
    const p = typeof packer === 'undefined' ? this.getFactory(RpcPacker)() : packer;
    this._options.packer = p;
    this._context.packer = p;
  }

  /**
   * @description Sets global constants provider on the Tezos Taquito instance
   *
   * @param options globalConstantsProvider to use to interact with the Tezos network
   *
   * @example 
   * ```
   * const globalConst = new DefaultGlobalConstantsProvider();
   * globalConst.loadGlobalConstant({
   *  "expruu5BTdW7ajqJ9XPTF3kgcV78pRiaBW3Gq31mgp3WSYjjUBYxre": { prim: "int" },
   *  // ...
   * })
   * Tezos.setGlobalConstantsProvider(globalConst);
   * ```
   *
   */
   setGlobalConstantsProvider(globalConstantsProvider?: SetProviderOptions['globalConstantsProvider']) {
    const g = typeof globalConstantsProvider === 'undefined' ? new NoopGlobalConstantsProvider() : globalConstantsProvider;
    this._options.globalConstantsProvider = g;
    this._context.globalConstantsProvider = g;
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
  get rpc(): RpcClientInterface {
    return this._context.rpc;
  }

  /**
   * @description Provide access to the currently used signer
   */
  get signer() {
    return this._context.signer;
  }

  /**
   * @description Provide access to the currently used globalConstantsProvider
   */
   get globalConstants() {
    return this._context.globalConstantsProvider;
  }

  /**
   * @description Allow to add a module to the TezosToolkit instance. This method adds the appropriate Providers(s) required by the module to the internal context.
   *
   * @param module extension to add to the TezosToolkit instance
   *
   * @example Tezos.addExtension(new Tzip16Module());
   */
  addExtension(module: Extension | Extension[]) {
    if(Array.isArray(module)){
      module.forEach(extension => extension.configureContext(this._context));
    } else {
      module.configureContext(this._context);
    }
  }

  getFactory<T, K extends Array<any>>(ctor: TaquitoProvider<T, K>) {
    return (...args: K) => {
      return new ctor(this._context, ...args);
    };
  }

  /**
   * @description Gets an object containing the version of Taquito library and git sha of the commit this library is compiled from
   */
  getVersionInfo(): VersionInfo {
    return VERSION;
  }
}

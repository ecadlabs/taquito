/**
 * @packageDocumentation
 * @module @taquito/taquito
 */

import { RpcClient, RpcClientInterface } from '@taquito/rpc';
import { Forger } from '@taquito/local-forging';
import { RPCBatchProvider } from './batch/rpc-batch-provider';
import { Protocols } from './constants';
import { ConfigConfirmation, Context, TaquitoProvider } from './context';
import { ContractProvider } from './contract/interface';
import { Extension } from './extension/extension';
import { format } from '@taquito/utils';
import { GlobalConstantsProvider } from './global-constants/interface-global-constants-provider';
import { NoopGlobalConstantsProvider } from './global-constants/noop-global-constants-provider';
import { Packer } from './packer/interface';
import { RpcPacker } from './packer/rpc-packer';
import { TzReadProvider } from './read-provider/interface';
import { RpcReadAdapter } from './read-provider/rpc-read-adapter';
import { PreparationProvider } from './prepare/interface';
import { Signer } from '@taquito/core';
import { NoopSigner } from './signer/noop';
import { SubscribeProvider } from './subscribe/interface';
import { PollingSubscribeProvider } from './subscribe/polling-subcribe-provider';
import { TzProvider } from './tz/interface';
import { VERSION } from './version';
import { LegacyWalletProvider, Wallet, WalletProvider } from './wallet';
import { OperationFactory } from './wallet/operation-factory';
import { TaquitoLocalForger } from './forger/taquito-local-forger';
import { EstimationProvider } from './estimate/estimate-provider-interface';
import { ParserProvider } from './parser/interface';
import { MichelCodecParser } from './parser/michel-codec-parser';
import { Injector } from './injector/interface';
import { RpcInjector } from './injector/rpc-injector';
import { FieldNumberingStrategy, Token } from '@taquito/michelson-encoder';

export { FieldNumberingStrategy, Token, MichelsonMap, UnitValue } from '@taquito/michelson-encoder';
export { Forger, ForgeParams, ForgeResponse } from '@taquito/local-forging';
export * from './constants';
export * from './context';
export { TaquitoProvider } from './context';
export * from './contract';
export * from './contract/big-map';
export { CompositeForger } from './forger/composite-forger';
export { RpcForger } from './forger/rpc-forger';
export * from './operations';
export { OperationBatch } from './batch/rpc-batch-provider';
export { Signer } from '@taquito/core';
export * from './subscribe/interface';
export { SubscribeProvider } from './subscribe/interface';
export { PollingSubscribeProvider } from './subscribe/polling-subcribe-provider';
export { ObservableSubscription } from './subscribe/observable-subscription';
export * from './tz/interface';
export * from './wallet';
export { Extension } from './extension/extension';
export * from './injector/interface';
export * from './injector/rpc-injector';
export * from './parser/interface';
export * from './parser/michel-codec-parser';
export * from './parser/noop-parser';
export * from './packer/interface';
export * from './packer/michel-codec-packer';
export * from './packer/rpc-packer';
export * from './global-constants/default-global-constants-provider';
export * from './global-constants/errors';
export * from './global-constants/interface-global-constants-provider';
export {
  BigMapQuery,
  SaplingStateQuery,
  BlockIdentifier,
  TzReadProvider,
} from './read-provider/interface';
export { RpcReadAdapter } from './read-provider/rpc-read-adapter';
export * from './estimate';
export { TaquitoLocalForger } from './forger/taquito-local-forger';
export * from './prepare';

export interface SetProviderOptions {
  forger?: Forger;
  wallet?: WalletProvider;
  rpc?: string | RpcClientInterface;
  readProvider?: TzReadProvider;
  stream?: string | SubscribeProvider;
  signer?: Signer;
  protocol?: Protocols;
  config?: Partial<ConfigConfirmation>;
  packer?: Packer;
  globalConstantsProvider?: GlobalConstantsProvider;
  parserProvider?: ParserProvider;
  injectorProvider?: Injector;
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
  private _options: SetProviderOptions = {};
  private _rpcClient: RpcClientInterface;
  private _wallet: Wallet;
  private _context: Context;

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
  }

  /**
   * @description Sets configuration on the Tezos Taquito instance. Allows user to choose which signer, rpc client, rpc url, forger and so forth
   *
   * @param options rpc url or rpcClient to use to interact with the Tezos network
   *
   * @example Tezos.setProvider({rpc: 'https://mainnet.tezos.ecadinfra.com/', signer: new InMemorySigner.fromSecretKey(“edsk...”)})
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
    globalConstantsProvider,
    readProvider,
    parserProvider,
    injectorProvider,
  }: SetProviderOptions) {
    this.setRpcProvider(rpc);
    this.setStreamProvider(stream);
    this.setSignerProvider(signer);
    this.setForgerProvider(forger);
    this.setWalletProvider(wallet);
    this.setPackerProvider(packer);
    this.setGlobalConstantsProvider(globalConstantsProvider);
    this.setReadProvider(readProvider);
    this.setParserProvider(parserProvider);
    this.setInjectorProvider(injectorProvider);

    this._context.proto = protocol;
    if (config) {
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
   * @example Tezos.setRpcProvider('https://mainnet.tezos.ecadinfra.com/')
   *
   */
  setRpcProvider(rpc?: SetProviderOptions['rpc']) {
    if (typeof rpc === 'string') {
      this._rpcClient = new RpcClient(rpc);
    } else if (rpc === undefined) {
      // do nothing, RPC is required in the constructor, do not override it
    } else {
      this._rpcClient = rpc;
    }
    this._options.rpc = this._rpcClient;
    this._context.rpc = this._rpcClient;
  }

  /**
   * @description Sets forger provider on the Tezos Taquito instance
   * The `LocalForger` from `@taquito/local-forging` is set by default.
   *
   * @param options forger to use to interact with the Tezos network
   *
   * @example Tezos.setForgerProvider(this.getFactory(RpcForger)())
   *
   */
  setForgerProvider(forger?: SetProviderOptions['forger']) {
    if (typeof forger !== 'undefined') {
      this._options.forger = forger;
      this._context.forger = forger;
    } else if (this._options.forger === undefined) {
      const f = this.getFactory(TaquitoLocalForger)();
      this._options.forger = f;
      this._context.forger = f;
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
      const s = new PollingSubscribeProvider(new Context(new RpcClient(stream)));
      this._options.stream = s;
      this._context.stream = s;
    } else if (typeof stream !== 'undefined') {
      this._options.stream = stream;
      this._context.stream = stream;
    } else if (this._options.stream === undefined) {
      const s = this.getFactory(PollingSubscribeProvider)();
      this._options.stream = s;
      this._context.stream = s;
    }
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
    if (!this._options.packer && typeof packer === 'undefined') {
      const p = this.getFactory(RpcPacker)();
      this._context.packer = p;
      this._options.packer = p;
    } else if (typeof packer !== 'undefined') {
      this._context.packer = packer;
      this._options.packer = packer;
    }
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
  setGlobalConstantsProvider(
    globalConstantsProvider?: SetProviderOptions['globalConstantsProvider']
  ) {
    if (!this._options.globalConstantsProvider && typeof globalConstantsProvider === 'undefined') {
      const g = new NoopGlobalConstantsProvider();
      this._context.globalConstantsProvider = g;
      this._options.globalConstantsProvider = g;
    } else if (typeof globalConstantsProvider !== 'undefined') {
      this._context.globalConstantsProvider = globalConstantsProvider;
      this._options.globalConstantsProvider = globalConstantsProvider;
    }
  }

  /**
   * @description Sets read provider on the Tezos Taquito instance
   * By default reads are done from the RPC usign the RpcReadAdapter class, this can be overridden to read from an indexer that implements the TzReadProvider interface
   *
   * @param options TzReadProvider to use to interact with the Tezos network
   *
   */
  setReadProvider(readProvider?: SetProviderOptions['readProvider']) {
    const readP = readProvider ? readProvider : new RpcReadAdapter(this._context.rpc);
    this._options.readProvider = readP;
    this._context.readProvider = readP;
  }

  /**
   * @description Sets parser provider on the Tezos Taquito instance
   *
   * @param options parserProvider to use to interact with the Tezos network
   *
   */
  setParserProvider(parserProvider?: SetProviderOptions['parserProvider']) {
    if (!this._options.parserProvider && typeof parserProvider === 'undefined') {
      const p = new MichelCodecParser(this._context);
      this._context.parser = p;
      this._options.parserProvider = p;
    } else if (typeof parserProvider !== 'undefined') {
      this._context.parser = parserProvider;
      this._options.parserProvider = parserProvider;
    }
  }

  /**
   * @description Sets injector provider on the Tezos Taquito instance
   *
   * @param options Injector to use to interact with the Tezos network by default RpcInjector
   *
   */
  setInjectorProvider(injectorProvider?: SetProviderOptions['injectorProvider']) {
    if (!this._options.injectorProvider && typeof injectorProvider === 'undefined') {
      const i = new RpcInjector(this._context);
      this._context.injector = i;
      this._options.injectorProvider = i;
    } else if (typeof injectorProvider !== 'undefined') {
      this._context.injector = injectorProvider;
      this._options.injectorProvider = injectorProvider;
    }
  }

  /**
   * @description Sets the strategy used for field numbering in Token execute/encode/decode to convert Michelson values to/from javascript objects
   * @param strategy a value of type FieldNumberingStrategy that controls how field numbers are calculated
   */
  setFieldNumberingStrategy(strategy: FieldNumberingStrategy) {
    Token.fieldNumberingStrategy = strategy;
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

  /**
   * @description Provide access to tezos operation preparation utilities
   */
  get prepare(): PreparationProvider {
    return this._context.prepare;
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
    return this._context.stream;
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
    if (Array.isArray(module)) {
      module.forEach((extension) => extension.configureContext(this._context));
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

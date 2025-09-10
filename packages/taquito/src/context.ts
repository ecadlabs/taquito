import { RpcClient, RpcClientInterface } from '@taquito/rpc';
import { Protocols } from './constants';
import { Forger } from '@taquito/local-forging';
import { Injector } from './injector/interface';
import { RpcInjector } from './injector/rpc-injector';
import { Signer } from '@taquito/core';
import { NoopSigner } from './signer/noop';
import { OperationFactory } from './wallet/operation-factory';
import { RpcTzProvider } from './tz/rpc-tz-provider';
import { RPCEstimateProvider } from './estimate/rpc-estimate-provider';
import { RpcContractProvider } from './contract/rpc-contract-provider';
import { RPCBatchProvider } from './batch/rpc-batch-provider';

import { Wallet, LegacyWalletProvider, WalletProvider } from './wallet';
import { ParserProvider } from './parser/interface';
import { MichelCodecParser } from './parser/michel-codec-parser';
import { Packer } from './packer/interface';
import { RpcPacker } from './packer/rpc-packer';
import { BehaviorSubject } from 'rxjs';
import { GlobalConstantsProvider } from './global-constants/interface-global-constants-provider';
import { NoopGlobalConstantsProvider } from './global-constants/noop-global-constants-provider';
import { TzReadProvider } from './read-provider/interface';
import { RpcReadAdapter } from './read-provider/rpc-read-adapter';
import { SubscribeProvider } from './subscribe/interface';
import { PollingSubscribeProvider } from './subscribe/polling-subcribe-provider';
import { TaquitoLocalForger } from './forger/taquito-local-forger';
import { PrepareProvider } from './prepare/prepare-provider';

export interface TaquitoProvider<T, K extends Array<any>> {
  new (context: Context, ...rest: K): T;
}

export interface ConfigConfirmation {
  confirmationPollingTimeoutSecond: number;
  defaultConfirmationCount: number;
}

export const defaultConfigConfirmation: ConfigConfirmation = {
  defaultConfirmationCount: 1,
  confirmationPollingTimeoutSecond: 180,
};

/**
 * @description Encapsulate common service used throughout different part of the library
 */
export class Context {
  private _rpcClient: RpcClientInterface;
  private _forger: Forger;
  private _parser: ParserProvider;
  private _injector: Injector;
  private _walletProvider: WalletProvider;
  public readonly operationFactory: OperationFactory;
  private _packer: Packer;
  private providerDecorator: Array<(context: Context) => Context> = [];
  private _globalConstantsProvider: GlobalConstantsProvider;
  private _readProvider: TzReadProvider;
  private _stream: SubscribeProvider;
  public readonly tz = new RpcTzProvider(this);
  public readonly estimate = new RPCEstimateProvider(this);
  public readonly contract = new RpcContractProvider(this, this.estimate);
  public readonly prepare = new PrepareProvider(this);
  public readonly batch = new RPCBatchProvider(this, this.estimate);
  public readonly wallet = new Wallet(this);

  constructor(
    private _rpc: RpcClientInterface | string,
    private _signer: Signer = new NoopSigner(),
    private _proto?: Protocols,
    public readonly _config = new BehaviorSubject({
      ...defaultConfigConfirmation,
    }),
    forger?: Forger,
    injector?: Injector,
    packer?: Packer,
    wallet?: WalletProvider,
    parser?: ParserProvider,
    globalConstantsProvider?: GlobalConstantsProvider,
    readProvider?: TzReadProvider,
    stream?: SubscribeProvider
  ) {
    if (typeof this._rpc === 'string') {
      this._rpcClient = new RpcClient(this._rpc);
    } else {
      this._rpcClient = this._rpc;
    }
    this._forger = forger ? forger : new TaquitoLocalForger(this);
    this._injector = injector ? injector : new RpcInjector(this);
    this.operationFactory = new OperationFactory(this);
    this._walletProvider = wallet ? wallet : new LegacyWalletProvider(this);
    this._parser = parser ? parser : new MichelCodecParser(this);
    this._packer = packer ? packer : new RpcPacker(this);
    this._globalConstantsProvider = globalConstantsProvider
      ? globalConstantsProvider
      : new NoopGlobalConstantsProvider();
    this._readProvider = readProvider ? readProvider : new RpcReadAdapter(this._rpcClient);
    this._stream = stream ? stream : new PollingSubscribeProvider(this);
  }

  get config(): ConfigConfirmation {
    return this._config.getValue();
  }

  set config(value: ConfigConfirmation) {
    this._config.next({
      ...value,
    });
  }

  setPartialConfig(value: Partial<ConfigConfirmation>) {
    this._config.next({
      ...this._config.getValue(),
      ...value,
    });
  }

  get rpc(): RpcClientInterface {
    return this._rpcClient;
  }

  set rpc(value: RpcClientInterface) {
    this._rpcClient = value;
  }

  get injector() {
    return this._injector;
  }

  set injector(value: Injector) {
    this._injector = value;
  }

  get forger() {
    return this._forger;
  }

  set forger(value: Forger) {
    this._forger = value;
  }

  get signer() {
    return this._signer;
  }

  set signer(value: Signer) {
    this._signer = value;
  }

  get walletProvider() {
    return this._walletProvider;
  }

  set walletProvider(value: WalletProvider) {
    this._walletProvider = value;
  }

  set proto(value: Protocols | undefined) {
    this._proto = value;
  }

  get proto() {
    return this._proto;
  }

  get parser() {
    return this._parser;
  }

  set parser(value: ParserProvider) {
    this._parser = value;
  }

  get packer() {
    return this._packer;
  }

  set packer(value: Packer) {
    this._packer = value;
  }

  get globalConstantsProvider() {
    return this._globalConstantsProvider;
  }

  set globalConstantsProvider(value: GlobalConstantsProvider) {
    this._globalConstantsProvider = value;
  }

  get readProvider() {
    return this._readProvider;
  }

  set readProvider(value: TzReadProvider) {
    this._readProvider = value;
  }

  get stream() {
    return this._stream;
  }

  set stream(value: SubscribeProvider) {
    this._stream = value;
  }

  async isAnyProtocolActive(protocol: string[] = []) {
    if (this._proto) {
      return protocol.includes(this._proto);
    } else {
      const next_protocol = await this.readProvider.getNextProtocol('head');
      return protocol.includes(next_protocol);
    }
  }

  isAnySignerConfigured() {
    return !(this.signer instanceof NoopSigner);
  }

  /**
   * @description Create a copy of the current context. Useful when you have long running operation and you do not want a context change to affect the operation
   */
  clone(): Context {
    return new Context(
      this.rpc,
      this.signer,
      this.proto,
      this._config,
      this.forger,
      this._injector,
      this.packer,
      this._walletProvider,
      this._parser,
      this._globalConstantsProvider,
      this._readProvider,
      this._stream
    );
  }

  /**
   * @description Allows extensions set on the TezosToolkit to inject logic into the context
   */
  registerProviderDecorator(fx: (context: Context) => Context) {
    this.providerDecorator.push(fx);
  }

  /**
   * @description Applies the decorators on a cloned instance of the context and returned this cloned instance.
   * The decorators are functions that inject logic into the context.
   * They are provided by the extensions set on the TezosToolkit by calling the registerProviderDecorator method.
   */
  withExtensions = (): Context => {
    let clonedContext = this.clone();
    this.providerDecorator.forEach((decorator) => {
      clonedContext = decorator(clonedContext);
    });

    return clonedContext;
  };
}

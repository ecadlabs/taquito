import { RpcClient } from '@taquito/rpc';
import { Protocols } from './constants';
import { Forger } from './forger/interface';
import { RpcForger } from './forger/rpc-forger';
import { Injector } from './injector/interface';
import { RpcInjector } from './injector/rpc-injector';
import { Signer } from './signer/interface';
import { NoopSigner } from './signer/noop';
import { OperationFactory } from './wallet/opreation-factory';
import { RpcTzProvider } from './tz/rpc-tz-provider';
import { RPCEstimateProvider } from './contract/rpc-estimate-provider';
import { RpcContractProvider } from './contract/rpc-contract-provider';
import { RPCBatchProvider } from './batch/rpc-batch-provider';

import { Wallet, LegacyWalletProvider, WalletProvider } from './wallet';

export interface TaquitoProvider<T, K extends Array<any>> {
  new (context: Context, ...rest: K): T;
}

export interface Config {
  confirmationPollingIntervalSecond?: number;
  confirmationPollingTimeoutSecond?: number;
  defaultConfirmationCount?: number;
}

export const defaultConfig: Required<Config> = {
  confirmationPollingIntervalSecond: 10,
  defaultConfirmationCount: 1,
  confirmationPollingTimeoutSecond: 180,
};

/**
 * @description Encapsulate common service used throughout different part of the library
 */
export class Context {
  private _forger: Forger;
  private _injector: Injector;
  private _walletProvider: WalletProvider;
  public readonly operationFactory: OperationFactory;

  public readonly tz = new RpcTzProvider(this);
  public readonly estimate = new RPCEstimateProvider(this);
  public readonly contract = new RpcContractProvider(this, this.estimate);
  public readonly batch = new RPCBatchProvider(this, this.estimate);
  public readonly wallet = new Wallet(this);

  constructor(
    private _rpcClient: RpcClient = new RpcClient(),
    private _signer: Signer = new NoopSigner(),
    private _proto?: Protocols,
    private _config?: Partial<Config>,
    forger?: Forger,
    injector?: Injector,
    wallet?: WalletProvider
  ) {
    this.config = _config as any;
    this._forger = forger ? forger : new RpcForger(this);
    this._injector = injector ? injector : new RpcInjector(this);
    this.operationFactory = new OperationFactory(this);
    this._walletProvider = wallet ? wallet : new LegacyWalletProvider(this);
  }

  get config(): Required<Config> {
    return this._config as any;
  }

  set config(value: Required<Config>) {
    this._config = {
      ...defaultConfig,
      ...value,
    };
  }

  get rpc(): RpcClient {
    return this._rpcClient;
  }

  set rpc(value: RpcClient) {
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

  get walletProvider() {
    return this._walletProvider;
  }

  set walletProvider(value: WalletProvider) {
    this._walletProvider = value;
  }

  set signer(value: Signer) {
    this._signer = value;
  }

  set proto(value: Protocols | undefined) {
    this._proto = value;
  }

  get proto() {
    return this._proto;
  }

  async isAnyProtocolActive(protocol: string[] = []) {
    if (this._proto) {
      return protocol.includes(this._proto);
    } else {
      const { next_protocol } = await this.rpc.getBlockMetadata();
      return protocol.includes(next_protocol);
    }
  }

  /**
   * @description Create a copy of the current context. Useful when you have long running operation and you do not want a context change to affect the operation
   */
  clone(): Context {
    return new Context(this.rpc, this.signer, this.proto, this.config, this.forger, this._injector);
  }
}

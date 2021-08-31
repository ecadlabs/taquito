import { RpcClient } from '@taquito/rpc';
import { Protocols } from './constants';
import { Forger } from './forger/interface';
import { RpcForger } from './forger/rpc-forger';
import { Injector } from './injector/interface';
import { RpcInjector } from './injector/rpc-injector';
import { Signer } from './signer/interface';
import { NoopSigner } from './signer/noop';
import { OperationFactory } from './wallet/operation-factory';
import { RpcTzProvider } from './tz/rpc-tz-provider';
import { RPCEstimateProvider } from './contract/rpc-estimate-provider';
import { RpcContractProvider } from './contract/rpc-contract-provider';
import { RPCBatchProvider } from './batch/rpc-batch-provider';

import { Wallet, LegacyWalletProvider, WalletProvider } from './wallet';
import { ParserProvider } from './parser/interface';
import { MichelCodecParser } from './parser/michel-codec-parser';
import { Packer } from './packer/interface';
import { RpcPacker } from './packer/rpc-packer';
import BigNumber from 'bignumber.js';
import { retry } from 'rxjs/operators';
import { BehaviorSubject, OperatorFunction } from 'rxjs';

export interface TaquitoProvider<T, K extends Array<any>> {
  new (context: Context, ...rest: K): T;
}

export interface ConfigConfirmation {
  confirmationPollingIntervalSecond?: number;
  confirmationPollingTimeoutSecond?: number;
  defaultConfirmationCount?: number;
}

export const defaultConfigConfirmation: Partial<ConfigConfirmation> = {
  defaultConfirmationCount: 1,
  confirmationPollingTimeoutSecond: 180
};

// The shouldObservableSubscriptionRetry parameter is related to the observable in ObservableSubsription class.
// When set to true, the observable won't die when getBlock rpc call fails; the error will be reported via the error callback,
// and it will continue to poll for new blocks.
export interface ConfigStreamer {
  streamerPollingIntervalMilliseconds?: number;
  shouldObservableSubscriptionRetry?: boolean;
  observableSubscriptionRetryFunction?: OperatorFunction<any,any>;
}

export const defaultConfigStreamer: Required<ConfigStreamer> = {
  streamerPollingIntervalMilliseconds: 20000,
  shouldObservableSubscriptionRetry: false,
  observableSubscriptionRetryFunction: retry()
};

/**
 * @description Encapsulate common service used throughout different part of the library
 */
export class Context {
  private _rpcClient: RpcClient;
  private _forger: Forger;
  private _parser: ParserProvider;
  private _injector: Injector;
  private _walletProvider: WalletProvider;
  public readonly operationFactory: OperationFactory;
  private _packer: Packer;

  public readonly tz = new RpcTzProvider(this);
  public readonly estimate = new RPCEstimateProvider(this);
  public readonly contract = new RpcContractProvider(this, this.estimate);
  public readonly batch = new RPCBatchProvider(this, this.estimate);
  public readonly wallet = new Wallet(this);

  constructor(
    private _rpc: RpcClient | string,
    private _signer: Signer = new NoopSigner(),
    private _proto?: Protocols,
    public readonly _config = new BehaviorSubject({...defaultConfigStreamer, ...defaultConfigConfirmation}),
    forger?: Forger,
    injector?: Injector,
    packer?: Packer,
    wallet?: WalletProvider,
    parser?: ParserProvider,
  ) {
    if (typeof this._rpc === 'string') {
      this._rpcClient = new RpcClient(this._rpc);
    } else {
      this._rpcClient = this._rpc;
    }
    this._forger = forger ? forger : new RpcForger(this);
    this._injector = injector ? injector : new RpcInjector(this);
    this.operationFactory = new OperationFactory(this);
    this._walletProvider = wallet ? wallet : new LegacyWalletProvider(this);
    this._parser = parser? parser: new MichelCodecParser(this);
    this._packer = packer? packer: new RpcPacker(this);
  }

  get config(): Partial<ConfigConfirmation> & Required<ConfigStreamer> {
    return this._config.getValue();
  }

  set config(value: Partial<ConfigConfirmation> & Required<ConfigStreamer>) {
    this._config.next({
      ...defaultConfigConfirmation,
      ...defaultConfigStreamer,
      ...this._config,
      ...value,
    });
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

  async isAnyProtocolActive(protocol: string[] = []) {
    if (this._proto) {
      return protocol.includes(this._proto);
    } else {
      const { next_protocol } = await this.rpc.getBlockMetadata();
      return protocol.includes(next_protocol);
    }
  }

  async getConfirmationPollingInterval() {
    // Granada will generally halve the time between blocks, from 60 seconds to 30 seconds (mainnet).
    // We reduce the default value in the same proportion, from 10 to 5.
    const defaultInterval = 5;
    try {
      const constants = await this.rpc.getConstants();
      let blockTime = constants.time_between_blocks[0];
      if (constants.minimal_block_delay !== undefined) {
        blockTime = constants.minimal_block_delay;
      }
      let confirmationPollingInterval = BigNumber.sum(blockTime, 
        new BigNumber(constants.delay_per_missing_endorsement!)
        .multipliedBy(Math.max(0, constants.initial_endorsers! - constants.endorsers_per_block))
      );
      
      // Divide the polling interval by a constant 3
      // to improvise for polling time to work in prod,
      // testnet and sandbox enviornment.   
      confirmationPollingInterval = confirmationPollingInterval.dividedBy(3);  

      this.config.confirmationPollingIntervalSecond = confirmationPollingInterval.toNumber() === 0 ?
        0.1 :
        confirmationPollingInterval.toNumber();
      return this.config.confirmationPollingIntervalSecond;
    } catch (exception) {
      // Return default value if there is
      // an issue returning from constants
      // file.
      return defaultInterval;
    }
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
      this.packer
    );
  }
}

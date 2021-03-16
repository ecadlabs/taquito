/**
 * @packageDocumentation
 * @module @taquito/taquito
 */

import { RpcClient } from '@taquito/rpc';
import { RPCBatchProvider } from './batch/rpc-batch-provider';
import { Protocols } from './constants';
import { Config, Context, TaquitoProvider } from './context';
import { ContractProvider, EstimationProvider } from './contract/interface';
import { Extension } from './extension/extension';
import { Forger } from './forger/interface';
import { RpcForger } from './forger/rpc-forger';
import { format } from './format';
import { Packer } from './packer/interface';
import { RpcPacker } from './packer/rpc-packer';
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
export { Extension } from './extension/extension';
export * from './parser/interface';
export * from './parser/michel-codec-parser';
export * from './parser/noop-parser'

export interface SetProviderOptions {
  forger?: Forger;
  wallet?: WalletProvider;
  rpc?: string | RpcClient;
  stream?: string | SubscribeProvider;
  signer?: Signer;
  protocol?: Protocols;
  config?: Config;
  packer?: Packer;
}

/**
 * @description Facade class that surfaces all of the libraries capability and allow it's configuration
 * 
 * @param _rpc The RPC server to use
 */
export class TezosToolkit {
  private _stream!: SubscribeProvider;
  private _options: SetProviderOptions = {};
  private _rpcClient: RpcClient
  private _wallet: Wallet;
  private _context: Context;
  /**
   * @deprecated TezosToolkit.batch has been deprecated in favor of TezosToolkit.contract.batch
   *
   */
  public batch: RPCBatchProvider['batch'];

  public readonly format = format;

  constructor(
    private _rpc: RpcClient | string
  ) {
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
   * @example Tezos.setProvider({rpc: 'https://api.tez.ie/rpc/mainnet', signer: new InMemorySigner.fromSecretKey(“edsk...”)})
   * @example Tezos.setProvider({ config: { confirmationPollingTimeoutSecond: 300 }})
   *
   */

  setProvider({ rpc, stream, signer, protocol, config, forger, wallet, packer }: SetProviderOptions) {
    this.setRpcProvider(rpc);
    this.setStreamProvider(stream);
    this.setSignerProvider(signer);
    this.setForgerProvider(forger);
    this.setWalletProvider(wallet);
    this.setPackerProvider(packer);

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
    } 
/*     else if (this._options.rpc === undefined) {
      this._rpcClient = new RpcClient();
    } */
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
  setPackerProvider(packer?: SetProviderOptions['packer']){
    const p = typeof packer === 'undefined' ? this.getFactory(RpcPacker)() : packer;
    this._options.packer = p;
    this._context.packer = p;
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
   * @description Allow to add a module to the TezosToolkit instance. This method adds the appropriate Providers(s) required by the module to the internal context.
   * 
   * @param module extension to add to the TezosToolkit instance
   *
   * @example Tezos.addExtension(new Tzip16Module());
   */
  addExtension(module: Extension) {
    module.configureContext(this._context);
  }

  getFactory<T, K extends Array<any>>(ctor: TaquitoProvider<T, K>) {
    return (...args: K) => {
      return new ctor(this._context, ...args);
    };
  }
}

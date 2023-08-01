import { Context } from '../context';
import {
  ContractAbstraction,
  ContractStorageType,
  DefaultWalletType,
  SendParams,
} from '../contract';
import { ContractMethod } from '../contract/contract-methods/contract-method-flat-param';
import { ContractMethodObject } from '../contract/contract-methods/contract-method-object-param';
import { OpKind, withKind } from '../operations/types';
import { OriginationWalletOperation } from './origination-operation';
import {
  WalletDelegateParams,
  WalletFailingNoopParams,
  WalletIncreasePaidStorageParams,
  WalletOriginateParams,
  WalletProvider,
  WalletTransferParams,
} from './interface';
import {
  InvalidAddressError,
  InvalidContractAddressError,
  InvalidOperationKindError,
} from '@taquito/core';
import {
  validateAddress,
  validateContractAddress,
  ValidationResult,
  invalidDetail,
} from '@taquito/utils';
import { LocalForger, ProtocolsHash } from '@taquito/local-forging';

export interface PKHOption {
  forceRefetch?: boolean;
}

export type WalletParamsWithKind =
  | withKind<WalletTransferParams, OpKind.TRANSACTION>
  | withKind<WalletOriginateParams, OpKind.ORIGINATION>
  | withKind<WalletDelegateParams, OpKind.DELEGATION>
  | withKind<WalletIncreasePaidStorageParams, OpKind.INCREASE_PAID_STORAGE>;

export class WalletOperationBatch {
  private operations: WalletParamsWithKind[] = [];

  constructor(private walletProvider: WalletProvider, private context: Context) {}

  /**
   *
   * @description Add a transaction operation to the batch
   *
   * @param params Transfer operation parameter
   */
  withTransfer(params: WalletTransferParams) {
    const toValidation = validateAddress(params.to);
    if (toValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(params.to, invalidDetail(toValidation));
    }
    this.operations.push({ kind: OpKind.TRANSACTION, ...params });
    return this;
  }

  /**
   *
   * @description Add a contract call to the batch
   *
   * @param params Call a contract method
   * @param options Generic operation parameters
   */
  withContractCall(
    params: ContractMethod<Wallet> | ContractMethodObject<Wallet>,
    options: Partial<SendParams> = {}
  ) {
    return this.withTransfer(params.toTransferParams(options));
  }

  /**
   *
   * @description Add a delegation operation to the batch
   *
   * @param params Delegation operation parameter
   */
  withDelegation(params: WalletDelegateParams) {
    const delegateValidation = validateAddress(params.delegate ?? '');
    if (params.delegate && delegateValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(params.delegate, invalidDetail(delegateValidation));
    }
    this.operations.push({ kind: OpKind.DELEGATION, ...params });
    return this;
  }

  /**
   *
   * @description Add an origination operation to the batch
   *
   * @param params Origination operation parameter
   */
  withOrigination<TWallet extends DefaultWalletType = DefaultWalletType>(
    params: WalletOriginateParams<ContractStorageType<TWallet>>
  ) {
    this.operations.push({ kind: OpKind.ORIGINATION, ...params });
    return this;
  }

  /**
   *
   * @description Add an IncreasePaidStorage operation to the batch
   *
   * @param param IncreasePaidStorage operation parameter
   */
  withIncreasePaidStorage(params: WalletIncreasePaidStorageParams) {
    const destinationValidation = validateAddress(params.destination);
    if (destinationValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(params.destination, invalidDetail(destinationValidation));
    }
    this.operations.push({ kind: OpKind.INCREASE_PAID_STORAGE, ...params });
    return this;
  }

  private async mapOperation(param: WalletParamsWithKind) {
    switch (param.kind) {
      case OpKind.TRANSACTION:
        return this.walletProvider.mapTransferParamsToWalletParams(async () => param);
      case OpKind.ORIGINATION:
        return this.walletProvider.mapOriginateParamsToWalletParams(async () =>
          this.context.parser.prepareCodeOrigination({
            ...param,
          })
        );
      case OpKind.DELEGATION:
        return this.walletProvider.mapDelegateParamsToWalletParams(async () => param);
      case OpKind.INCREASE_PAID_STORAGE:
        return this.walletProvider.mapIncreasePaidStorageWalletParams(async () => param);
      default:
        throw new InvalidOperationKindError(JSON.stringify((param as any).kind));
    }
  }

  /**
   *
   * @description Add a group operation to the batch. Operation will be applied in the order they are in the params array
   *
   * @param params Operations parameter
   * @throws {@link InvalidOperationKindError}
   */
  with(params: WalletParamsWithKind[]) {
    for (const param of params) {
      switch (param.kind) {
        case OpKind.TRANSACTION:
          this.withTransfer(param);
          break;
        case OpKind.ORIGINATION:
          this.withOrigination(param);
          break;
        case OpKind.DELEGATION:
          this.withDelegation(param);
          break;
        case OpKind.INCREASE_PAID_STORAGE:
          this.withIncreasePaidStorage(param);
          break;
        default:
          throw new InvalidOperationKindError(JSON.stringify((param as any).kind));
      }
    }

    return this;
  }

  /**
   *
   * @description Submit batch operation to wallet
   *
   */
  async send() {
    const ops: WalletParamsWithKind[] = [];

    for (const op of this.operations) {
      ops.push(await this.mapOperation(op));
    }

    const opHash = await this.walletProvider.sendOperations(ops);

    return this.context.operationFactory.createBatchOperation(opHash);
  }
}

export class Wallet {
  constructor(private context: Context) {}

  private get walletProvider() {
    return this.context.walletProvider;
  }

  private _pkh?: string;

  /**
   * @description Retrieve the PKH of the account that is currently in use by the wallet
   *
   * @param option Option to use while fetching the PKH.
   * If forceRefetch is specified the wallet provider implementation will refetch the PKH from the wallet
   */
  async pkh({ forceRefetch }: PKHOption = {}) {
    if (!this._pkh || forceRefetch) {
      this._pkh = await this.walletProvider.getPKH();
    }

    return this._pkh;
  }

  private walletCommand = <T>(send: () => Promise<T>) => {
    return {
      send,
    };
  };

  /**
   *
   * @description Originate a new contract according to the script in parameters.
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param originateParams Originate operation parameter
   */
  originate<TWallet extends DefaultWalletType = DefaultWalletType>(
    params: WalletOriginateParams<ContractStorageType<TWallet>>
  ): { send: () => Promise<OriginationWalletOperation<TWallet>> } {
    return this.walletCommand(async () => {
      const mappedParams = await this.walletProvider.mapOriginateParamsToWalletParams(() =>
        this.context.parser.prepareCodeOrigination({
          ...(params as WalletOriginateParams),
        })
      );
      const opHash = await this.walletProvider.sendOperations([mappedParams]);
      return this.context.operationFactory.createOriginationOperation(opHash) as Promise<
        OriginationWalletOperation<TWallet>
      >;
    });
  }

  /**
   *
   * @description Set the delegate for a contract.
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param delegateParams operation parameter
   */
  setDelegate(params: WalletDelegateParams) {
    const delegateValidation = validateAddress(params.delegate ?? '');
    if (params.delegate && delegateValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(params.delegate, invalidDetail(delegateValidation));
    }
    return this.walletCommand(async () => {
      const mappedParams = await this.walletProvider.mapDelegateParamsToWalletParams(
        async () => params
      );
      const opHash = await this.walletProvider.sendOperations([mappedParams]);
      return this.context.operationFactory.createDelegationOperation(opHash);
    });
  }

  /**
   *
   * @description failing_noop operation that is guaranteed to fail.
   *
   * @returns Signature for a failing_noop
   *
   * @param params operation parameter
   */
  async signFailingNoop(params: WalletFailingNoopParams) {
    const failingOperation = await this.context.prepare.failingNoop(params);
    const forgeable = this.context.prepare.toForge(failingOperation);
    const protocolHash =
      (this.context.proto as unknown as ProtocolsHash) ??
      (await this.context.readProvider.getNextProtocol('head'));
    const forger = new LocalForger(protocolHash);
    const forgedBytes = await forger.forge(forgeable);
    const signature = await this.walletProvider.sign({ payload: forgedBytes });
    return {
      bytes: forgedBytes,
      sbytes: signature,
    };
  }

  /**
   *
   * @description Register the current address as delegate.
   *
   * @returns An operation handle with the result from the rpc node
   *
   */
  registerDelegate() {
    return this.walletCommand(async () => {
      const mappedParams = await this.walletProvider.mapDelegateParamsToWalletParams(async () => {
        const delegate = await this.pkh();
        return { delegate };
      });
      const opHash = await this.walletProvider.sendOperations([mappedParams]);
      return this.context.operationFactory.createDelegationOperation(opHash);
    });
  }

  /**
   *
   * @description Transfer tezos tokens from current address to a specific address or call a smart contract.
   *
   * @returns A wallet command from which we can send the operation to the wallet
   *
   * @param params operation parameter
   */
  transfer(params: WalletTransferParams) {
    const toValidation = validateAddress(params.to);
    if (toValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(params.to, invalidDetail(toValidation));
    }
    return this.walletCommand(async () => {
      const mappedParams = await this.walletProvider.mapTransferParamsToWalletParams(
        async () => params
      );
      const opHash = await this.walletProvider.sendOperations([mappedParams]);
      return this.context.operationFactory.createTransactionOperation(opHash);
    });
  }

  /**
   *
   * @description
   *
   * @returns
   *
   * @param params
   */
  increasePaidStorage(params: WalletIncreasePaidStorageParams) {
    const destinationValidation = validateAddress(params.destination);
    if (destinationValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(params.destination, invalidDetail(destinationValidation));
    }
    return this.walletCommand(async () => {
      const mappedParams = await this.walletProvider.mapIncreasePaidStorageWalletParams(
        async () => params
      );
      const opHash = await this.walletProvider.sendOperations([mappedParams]);
      return this.context.operationFactory.createIncreasePaidStorageOperation(opHash);
    });
  }

  /**
   *
   * @description Create a batch of operation
   *
   * @returns A batch object from which we can add more operation or send a command to the wallet to execute the batch
   *
   * @param params List of operation to initialize the batch with
   */
  batch(params?: Parameters<WalletOperationBatch['with']>[0]) {
    const batch = new WalletOperationBatch(this.walletProvider, this.context);

    if (Array.isArray(params)) {
      batch.with(params);
    }

    return batch;
  }

  /**
   *
   * @description Create an smart contract abstraction for the address specified. Calling entrypoints with the returned
   * smart contract abstraction will leverage the wallet provider to make smart contract calls
   *
   * @param address Smart contract address
   * @throws {@link InvalidContractAddressError} If the contract address is not valid
   */
  async at<T extends ContractAbstraction<Wallet>>(
    address: string,
    contractAbstractionComposer: (abs: ContractAbstraction<Wallet>, context: Context) => T = (x) =>
      x as any
  ): Promise<T> {
    const addressValidation = validateContractAddress(address);
    if (addressValidation !== ValidationResult.VALID) {
      throw new InvalidContractAddressError(address, invalidDetail(addressValidation));
    }
    const rpc = this.context.withExtensions().rpc;
    const readProvider = this.context.withExtensions().readProvider;
    const script = await readProvider.getScript(address, 'head');
    const entrypoints = await readProvider.getEntrypoints(address);
    const abs = new ContractAbstraction(
      address,
      script,
      this,
      this.context.contract,
      entrypoints,
      rpc,
      readProvider
    );
    return contractAbstractionComposer(abs, this.context);
  }

  getPublicKey() {
    return this.walletProvider.getPublicKey();
  }
}

import { Protocols } from '../constants';
import { Context } from '../context';
import { ContractAbstraction, ContractMethod } from '../contract';
import { OpKind, withKind } from '../operations/types';
import {
  WalletDelegateParams,
  WalletOriginateParams,
  WalletProvider,
  WalletTransferParams,
} from './interface';

export interface PKHOption {
  forceRefetch?: boolean;
}

export type WalletParamsWithKind =
  | withKind<WalletTransferParams, OpKind.TRANSACTION>
  | withKind<WalletOriginateParams, OpKind.ORIGINATION>
  | withKind<WalletDelegateParams, OpKind.DELEGATION>;

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
    this.operations.push({ kind: OpKind.TRANSACTION, ...params });
    return this;
  }

  /**
   *
   * @description Add a transaction operation to the batch
   *
   * @param params Transfer operation parameter
   */
  withContractCall(params: ContractMethod<Wallet>) {
    return this.withTransfer(params.toTransferParams());
  }

  /**
   *
   * @description Add a delegation operation to the batch
   *
   * @param params Delegation operation parameter
   */
  withDelegation(params: WalletDelegateParams) {
    this.operations.push({ kind: OpKind.DELEGATION, ...params });
    return this;
  }

  /**
   *
   * @description Add an origination operation to the batch
   *
   * @param params Origination operation parameter
   */
  withOrigination(params: WalletOriginateParams) {
    this.operations.push({ kind: OpKind.ORIGINATION, ...params });
    return this;
  }

  private async mapOperation(param: WalletParamsWithKind) {
		switch (param.kind) {
			case OpKind.TRANSACTION:
				return this.walletProvider.mapTransferParamsToWalletParams({
					...param
				});
			case OpKind.ORIGINATION:
				return this.walletProvider.mapOriginateParamsToWalletParams(
					await this.context.parser.prepareCodeOrigination({
						...param
					})
				);
			case OpKind.DELEGATION:
				return this.walletProvider.mapDelegateParamsToWalletParams({
					...param
				});
			default:
				throw new Error(`Unsupported operation kind: ${(param as any).kind}`);
		}
	}

  /**
   *
   * @description Add a group operation to the batch. Operation will be applied in the order they are in the params array
   *
   * @param params Operations parameter
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
        default:
          throw new Error(`Unsupported operation kind: ${(param as any).kind}`);
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

    return this.context.operationFactory.createOperation(opHash);
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
  originate(params: WalletOriginateParams) {
		return this.walletCommand(async () => {
			const mappedParams = await this.walletProvider.mapOriginateParamsToWalletParams(
				await this.context.parser.prepareCodeOrigination({
					...params
				})
			);
			const opHash = await this.walletProvider.sendOperations([ mappedParams ]);
			if (!this.context.proto) {
				this.context.proto = (await this.context.rpc.getBlock()).protocol as Protocols;
			}
			return this.context.operationFactory.createOriginationOperation(opHash);
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
    return this.walletCommand(async () => {
      const mappedParams = await this.walletProvider.mapDelegateParamsToWalletParams({ ...params });
      const opHash = await this.walletProvider.sendOperations([mappedParams]);
      return this.context.operationFactory.createDelegationOperation(opHash);
    });
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
      const mappedParams = await this.walletProvider.mapDelegateParamsToWalletParams({
        delegate: await this.pkh(),
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
    return this.walletCommand(async () => {
      const mappedParams = await this.walletProvider.mapTransferParamsToWalletParams(params);
      const opHash = await this.walletProvider.sendOperations([mappedParams]);
      return this.context.operationFactory.createTransactionOperation(opHash);
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
   */
  async at<T extends ContractAbstraction<Wallet>>(address: string, contractAbstractionComposer: (abs: ContractAbstraction<Wallet>, context: Context) => T = x => x as any): Promise<T> {
    const script = await this.context.rpc.getScript(address);
    const entrypoints = await this.context.rpc.getEntrypoints(address);
    const blockHeader = await this.context.rpc.getBlockHeader();
    const chainId = blockHeader.chain_id;
    const abs = new ContractAbstraction(address, script, this, this.context.contract, entrypoints, chainId);
    return contractAbstractionComposer(abs, this.context);
  }
}
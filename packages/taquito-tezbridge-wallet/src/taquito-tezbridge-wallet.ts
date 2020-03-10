import { Context, ContractAbstraction, createOriginationOperation, createTransferOperation, DelegationWalletOperation, OpKind, OriginationWalletOperation, PKHOption, TransactionWalletOperation, WalletContract, WalletDelegateParams, WalletOriginateParams, WalletProvider, WalletTransferParams } from "@taquito/taquito";

declare var tezbridge: any;

export class TezBridgeWallet implements WalletProvider {
  constructor(private context: Context) {
    if (typeof tezbridge === 'undefined') {
      throw new Error('tezbridge plugin could not be detected in your browser');
    }
  }

  private removeFeeAndLimit<T extends { gas_limit: any, storage_limit: any, fee: any }>(op: T) {
    const { fee, gas_limit, storage_limit, ...rest } = op;
    return rest;
  }

  private _pkh?: string;

  async pkh({ forceRefetch }: PKHOption) {
    if (!this._pkh || forceRefetch) {
      this._pkh = await tezbridge.request({
        method: 'get_source',
      })
    }

    return this._pkh!;
  }

  async originate(contract: WalletOriginateParams): Promise<OriginationWalletOperation> {
    const op = await createOriginationOperation(contract as any)
    const { operation_id } = await tezbridge.request({
      method: 'inject_operations',
      operations: [
        {
          kind: OpKind.ORIGINATION,
          ...this.removeFeeAndLimit(op),
        }
      ]
    })
    return this.context.operationFactory.createOriginationOperation(operation_id)
  }

  async setDelegate(params: WalletDelegateParams): Promise<DelegationWalletOperation> {
    const { operation_id } = await tezbridge.request({
      method: 'set_delegate',
      delegate: params.delegate
    })
    return this.context.operationFactory.createDelegationOperation(operation_id)
  }

  async registerDelegate(): Promise<DelegationWalletOperation> {
    const { operation_id } = await tezbridge.request({
      method: 'set_delegate',
    })
    return this.context.operationFactory.createDelegationOperation(operation_id)
  }

  async transfer(params: WalletTransferParams): Promise<TransactionWalletOperation> {
    const op = await createTransferOperation(params)
    const { operation_id } = await tezbridge.request({
      method: 'inject_operations',
      operations: [
        {
          kind: OpKind.TRANSACTION,
          ...this.removeFeeAndLimit(op),
        }
      ]
    })
    return this.context.operationFactory.createTransactionOperation(operation_id)
  }

  async at(address: string): Promise<WalletContract> {
    const script = await this.context.rpc.getScript(address);
    const entrypoints = await this.context.rpc.getEntrypoints(address);
    return new ContractAbstraction(address, script, this, this.context.contract, entrypoints);
  }
}

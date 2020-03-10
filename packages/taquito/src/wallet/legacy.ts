import { Context } from "../context";
import { ContractAbstraction, WalletContract } from "../contract/contract";
import { DelegationWalletOperation } from "./delegation-operation";
import { PKHOption, WalletDelegateParams, WalletOriginateParams, WalletProvider, WalletTransferParams } from "./interface";
import { OriginationWalletOperation } from "./origination-operation";
import { TransactionWalletOperation } from "./transaction-operation";

export class LegacyWallet implements WalletProvider {
  constructor(
    private context: Context,
  ) { }

  private _pkh?: string;

  async pkh({ forceRefetch }: PKHOption = {}) {
    if (!this._pkh || forceRefetch) {
      this._pkh = await this.context.signer.publicKeyHash()
    }

    return this._pkh;
  }

  async originate(contract: WalletOriginateParams): Promise<OriginationWalletOperation> {
    const op = await this.context.contract.originate(contract as any);
    return this.context.operationFactory.createOriginationOperation(op.hash)
  }

  async setDelegate(params: WalletDelegateParams): Promise<DelegationWalletOperation> {
    const op = await this.context.contract.setDelegate({ ...params, source: await this.pkh() });
    return this.context.operationFactory.createDelegationOperation(op.hash)
  }

  async registerDelegate(): Promise<DelegationWalletOperation> {
    const op = await this.context.contract.registerDelegate({});
    return this.context.operationFactory.createDelegationOperation(op.hash)
  }

  async transfer(params: WalletTransferParams): Promise<TransactionWalletOperation> {
    const op = await this.context.contract.transfer(params);
    return this.context.operationFactory.createTransactionOperation(op.hash)
  }

  async at(address: string): Promise<WalletContract> {
    const script = await this.context.rpc.getScript(address);
    const entrypoints = await this.context.rpc.getEntrypoints(address);
    return new ContractAbstraction(address, script, this, this.context.contract, entrypoints);
  }
}

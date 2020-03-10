import { DAppClient } from '@airgap/beacon-sdk/dist/clients/DappClient';
import { PermissionResponse } from "@airgap/beacon-sdk/dist/messages/Messages";
import { TezosOperationType } from "@airgap/beacon-sdk/dist/operations/OperationTypes";
import { encodeKeyHash } from "@taquito/utils";
import { Context, WalletProvider, WalletOriginateParams, OriginationWalletOperation, WalletDelegateParams, DelegationWalletOperation, TransactionWalletOperation, WalletTransferParams, WalletContract, ContractAbstraction, createOriginationOperation, createSetDelegateOperation, createRegisterDelegateOperation, createTransferOperation } from '@taquito/taquito'

export class BeaconWalletNotInitialized implements Error {
  name = 'BeaconWalletNotInitialized'
  message = 'You need to initialize BeaconWallet by calling beaconWallet.requestPermissions first';
}

export class BeaconWallet implements WalletProvider {

  public client: DAppClient;

  private permissions?: PermissionResponse;

  constructor(private context: Context, name: string) {
    this.client = new DAppClient(name)
  }

  private getPermissionOrFail() {
    if (!this.permissions) {
      throw new BeaconWalletNotInitialized();
    }

    return this.permissions;
  }

  async requestPermissions() {
    const result = await this.client.requestPermissions()
    this.permissions = result;
  }

  async pkh() {
    const { permissions } = this.getPermissionOrFail();

    return encodeKeyHash(permissions.pubkey);
  }

  private removeFeeAndLimit<T extends { gas_limit: any, storage_limit: any, fee: any }>(op: T) {
    const { fee, gas_limit, storage_limit, ...rest } = op;
    return rest;
  }

  async originate(contract: WalletOriginateParams): Promise<OriginationWalletOperation> {
    const op = await createOriginationOperation(contract as any)
    const network = this.permissions!.permissions.networks;
    const { transactionHashes } = await this.client.requestOperation({
      network: network[0],
      operationDetails: [{
        ...this.removeFeeAndLimit(op),
        kind: TezosOperationType.ORIGINATION,
      }]
    })

    return this.context.operationFactory.createOriginationOperation(transactionHashes[0])
  }

  async setDelegate(params: WalletDelegateParams): Promise<DelegationWalletOperation> {
    const network = this.permissions!.permissions.networks;
    const op = await createSetDelegateOperation({ ...params, source: await this.pkh() })
    const { transactionHashes } = await this.client.requestOperation({
      network: network[0],
      operationDetails: [{
        ...this.removeFeeAndLimit(op),
        kind: TezosOperationType.DELEGATION,
      }]
    })
    return this.context.operationFactory.createDelegationOperation(transactionHashes[0])
  }

  async registerDelegate(): Promise<DelegationWalletOperation> {
    const network = this.permissions!.permissions.networks;
    const op = await createRegisterDelegateOperation({}, await this.pkh());
    const { transactionHashes } = await this.client.requestOperation({
      network: network[0],
      operationDetails: [{
        ...this.removeFeeAndLimit(op),
        kind: TezosOperationType.DELEGATION,
      }]
    })
    return this.context.operationFactory.createDelegationOperation(transactionHashes[0])
  }

  async transfer(params: WalletTransferParams): Promise<TransactionWalletOperation> {
    const network = this.permissions!.permissions.networks;
    const op = await createTransferOperation(params);
    const { transactionHashes } = await this.client.requestOperation({
      network: network[0],
      operationDetails: [{
        ...this.removeFeeAndLimit(op),
        kind: TezosOperationType.TRANSACTION,
      }]
    })
    return this.context.operationFactory.createTransactionOperation(transactionHashes[0])
  }

  async at(address: string): Promise<WalletContract> {
    const script = await this.context.rpc.getScript(address);
    const entrypoints = await this.context.rpc.getEntrypoints(address);
    return new ContractAbstraction(address, script, this, this.context.contract, entrypoints);
  }

}

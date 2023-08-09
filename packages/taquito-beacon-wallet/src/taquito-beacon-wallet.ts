/**
 * @packageDocumentation
 * @module @taquito/beacon-wallet
 */

import {
  DAppClient,
  DAppClientOptions,
  RequestPermissionInput,
  PermissionScope,
  getDAppClientInstance,
  SigningType,
} from '@airgap/beacon-dapp';
import { BeaconWalletNotInitialized, MissingRequiredScopes } from './errors';
import toBuffer from 'typedarray-to-buffer';
import {
  createIncreasePaidStorageOperation,
  createOriginationOperation,
  createSetDelegateOperation,
  createTransferOperation,
  WalletDelegateParams,
  WalletIncreasePaidStorageParams,
  WalletOriginateParams,
  WalletProvider,
  WalletTransferParams,
} from '@taquito/taquito';
import { buf2hex, hex2buf, mergebuf } from '@taquito/utils';

export { VERSION } from './version';
export { BeaconWalletNotInitialized, MissingRequiredScopes } from './errors';

export class BeaconWallet implements WalletProvider {
  public client: DAppClient;

  constructor(options: DAppClientOptions) {
    this.client = getDAppClientInstance(options);
  }

  private validateRequiredScopesOrFail(
    permissionScopes: PermissionScope[],
    requiredScopes: PermissionScope[]
  ) {
    const mandatoryScope = new Set(requiredScopes);

    for (const scope of permissionScopes) {
      if (mandatoryScope.has(scope)) {
        mandatoryScope.delete(scope);
      }
    }

    if (mandatoryScope.size > 0) {
      throw new MissingRequiredScopes(Array.from(mandatoryScope));
    }
  }

  async requestPermissions(request?: RequestPermissionInput) {
    await this.client.requestPermissions(request);
  }

  async getPKH() {
    const account = await this.client.getActiveAccount();
    if (!account) {
      throw new BeaconWalletNotInitialized();
    }
    return account.address;
  }

  async mapTransferParamsToWalletParams(params: () => Promise<WalletTransferParams>) {
    let walletParams: WalletTransferParams;
    await this.client.showPrepare();
    try {
      walletParams = await params();
    } catch (err) {
      await this.client.hideUI();
      throw err;
    }
    return this.removeDefaultParams(
      walletParams,
      await createTransferOperation(this.formatParameters(walletParams))
    );
  }

  async mapIncreasePaidStorageWalletParams(params: () => Promise<WalletIncreasePaidStorageParams>) {
    let walletParams: WalletIncreasePaidStorageParams;
    await this.client.showPrepare();
    try {
      walletParams = await params();
    } catch (err) {
      await this.client.hideUI();
      throw err;
    }
    return this.removeDefaultParams(
      walletParams,
      await createIncreasePaidStorageOperation(this.formatParameters(walletParams))
    );
  }

  async mapOriginateParamsToWalletParams(params: () => Promise<WalletOriginateParams>) {
    let walletParams: WalletOriginateParams;
    await this.client.showPrepare();
    try {
      walletParams = await params();
    } catch (err) {
      await this.client.hideUI();
      throw err;
    }
    return this.removeDefaultParams(
      walletParams,
      await createOriginationOperation(this.formatParameters(walletParams))
    );
  }

  async mapDelegateParamsToWalletParams(params: () => Promise<WalletDelegateParams>) {
    let walletParams: WalletDelegateParams;
    await this.client.showPrepare();
    try {
      walletParams = await params();
    } catch (err) {
      await this.client.hideUI();
      throw err;
    }
    return this.removeDefaultParams(
      walletParams,
      await createSetDelegateOperation(this.formatParameters(walletParams))
    );
  }

  formatParameters(params: any) {
    if (params.fee) {
      params.fee = params.fee.toString();
    }
    if (params.storageLimit) {
      params.storageLimit = params.storageLimit.toString();
    }
    if (params.gasLimit) {
      params.gasLimit = params.gasLimit.toString();
    }
    return params;
  }

  removeDefaultParams(
    params: WalletTransferParams | WalletOriginateParams | WalletDelegateParams,
    operatedParams: any
  ) {
    // If fee, storageLimit or gasLimit is undefined by user
    // in case of beacon wallet, dont override it by
    // defaults.
    if (!params.fee) {
      delete operatedParams.fee;
    }
    if (!params.storageLimit) {
      delete operatedParams.storage_limit;
    }
    if (!params.gasLimit) {
      delete operatedParams.gas_limit;
    }
    return operatedParams;
  }

  async sendOperations(params: any[]) {
    const account = await this.client.getActiveAccount();
    if (!account) {
      throw new BeaconWalletNotInitialized();
    }
    const permissions = account.scopes;
    this.validateRequiredScopesOrFail(permissions, [PermissionScope.OPERATION_REQUEST]);

    const { transactionHash } = await this.client.requestOperation({ operationDetails: params });
    return transactionHash;
  }

  /**
   *
   * @description Removes all beacon values from the storage. After using this method, this instance is no longer usable.
   * You will have to instantiate a new BeaconWallet.
   */
  async disconnect() {
    await this.client.destroy();
  }

  /**
   *
   * @description This method removes the active account from local storage by setting it to undefined.
   */
  async clearActiveAccount() {
    await this.client.setActiveAccount();
  }

  async sign(signingRequest: { payload: string; watermark?: Uint8Array }) {
    let bb = hex2buf(signingRequest.payload);
    if (typeof signingRequest.watermark !== 'undefined') {
      bb = mergebuf(signingRequest.watermark, bb);
    }
    const watermarkedBytes = buf2hex(toBuffer(bb));

    let signingType: SigningType;
    switch (signingRequest.watermark) {
      case new Uint8Array([5]):
        signingType = SigningType.MICHELINE;
        break;
      case new Uint8Array([3]):
        signingType = SigningType.OPERATION;
        break;
      case undefined:
        signingType = SigningType.RAW;
        break;
      default:
        throw new Error(`Invalid watermark ${JSON.stringify(signingRequest.watermark)}`);
    }
    const { signature } = await this.client.requestSignPayload({
      payload: watermarkedBytes,
      signingType,
    });
    return signature;
  }

  async getPublicKey() {
    const account = await this.client.getActiveAccount();
    if (!account) {
      throw new BeaconWalletNotInitialized();
    }
    return account?.publicKey;
  }
}

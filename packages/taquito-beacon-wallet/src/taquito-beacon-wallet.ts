/**
 * @packageDocumentation
 * @module @taquito/beacon-wallet
 */

import {
  AccountInfo,
  DAppClient,
  DAppClientOptions,
  Network,
  NetworkType,
  RequestPermissionInput,
  PermissionScope,
  getDAppClientInstance,
  isValidTezosCaip2,
  normalizeTezosCaip2,
  tezosCaip2FromNetworkType,
  SigningType,
  NodeDistributions,
  Regions,
} from '@tezos-x/octez.connect-dapp';
import {
  BeaconWalletNotInitialized,
  MissingRequiredScopes,
  NetworkNotGrantedError,
  UnmappedNetworkError,
} from './errors';
import toBuffer from 'typedarray-to-buffer';
import {
  createIncreasePaidStorageOperation,
  createOriginationOperation,
  createSetDelegateOperation,
  createTransferOperation,
  createRegisterGlobalConstantOperation,
  WalletDelegateParams,
  WalletIncreasePaidStorageParams,
  WalletOriginateParams,
  WalletProvider,
  WalletTransferParams,
  WalletStakeParams,
  WalletUnstakeParams,
  WalletFinalizeUnstakeParams,
  WalletTransferTicketParams,
  WalletRegisterGlobalConstantParams,
  createTransferTicketOperation,
  ParamsWithOptionalFees,
} from '@taquito/taquito';
import { buf2hex, hex2buf, mergebuf } from '@taquito/utils';
import { UnsupportedActionError } from '@taquito/core';

export { VERSION } from './version';
export {
  BeaconWalletNotInitialized,
  MissingRequiredScopes,
  NetworkNotGrantedError,
  UnmappedNetworkError,
} from './errors';

// Re-exported from @tezos-x/octez.connect-dapp for consumers who need these
// without a direct octez.connect-dapp dependency. These types live only in
// octez.connect-dapp (not in octez.connect-types), so they come with its side
// effects. For side-effect-free beacon types (NetworkType, SigningType, etc.),
// use '@taquito/beacon-wallet/types'.
export { BeaconEvent } from '@tezos-x/octez.connect-dapp';
export type { DAppClientOptions } from '@tezos-x/octez.connect-dapp';

// Multi-network helpers, re-exported so dApps can translate between Taquito's
// named-network vocabulary (NetworkType) and the CAIP-2 chain ids the
// multi-network protocol routes on, without a direct octez.connect dependency.
export {
  TEZOS_NETWORK_GENESIS_IDS,
  isValidTezosCaip2,
  networkTypeFromTezosCaip2,
  normalizeTezosCaip2,
  tezosCaip2FromNetworkType,
} from '@tezos-x/octez.connect-dapp';
export type { AccountInfo, Network } from '@tezos-x/octez.connect-dapp';

/**
 * Default matrix relay nodes curated by Taquito.
 *
 * Includes only Trilitech-operated `octez.io` nodes. These replace the Beacon
 * SDK built-in defaults so that Taquito controls which relay infrastructure
 * its users hit.
 *
 * Non-European regions are intentionally empty because Taquito no longer
 * curates Papers-operated relay nodes for those regions.
 *
 * Users can still override specific regions (or the entire list) by passing
 * their own `matrixNodes` in the BeaconWallet constructor options.
 */
const TAQUITO_CURATED_MATRIX_NODES: NodeDistributions = {
  [Regions.EUROPE_WEST]: [
    'beacon-node-1.octez.io',
    'beacon-node-2.octez.io',
    'beacon-node-3.octez.io',
    'beacon-node-4.octez.io',
    'beacon-node-5.octez.io',
    'beacon-node-6.octez.io',
    'beacon-node-7.octez.io',
    'beacon-node-8.octez.io',
  ],
  // Left empty so Taquito does not point users at soon-to-be-retired Papers relays
  [Regions.NORTH_AMERICA_EAST]: [],
  [Regions.NORTH_AMERICA_WEST]: [],
  [Regions.ASIA_EAST]: [],
  [Regions.AUSTRALIA]: [],
};

type RPCOperationWithLimits = {
  fee?: number | string;
  gas_limit?: number | string;
  storage_limit?: number | string;
};

export class BeaconWallet implements WalletProvider {
  /**
   * The underlying Beacon `DAppClient` instance.
   *
   * Exposed for advanced use cases such as subscribing to Beacon events.
   * Calling methods directly on the client (e.g., `client.clearActiveAccount()`)
   * bypasses Taquito's wallet lifecycle. For disconnecting, prefer
   * {@link BeaconWallet.disconnect} instead.
   */
  public client: DAppClient;

  constructor(options: DAppClientOptions) {
    const matrixNodes: NodeDistributions = {
      ...TAQUITO_CURATED_MATRIX_NODES,
      ...(options.matrixNodes ?? {}),
    };
    this.client = getDAppClientInstance({ ...options, matrixNodes });
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

  /**
   * Request permissions from the wallet.
   *
   * Pass `networks` to request accounts on several chains in a single pairing
   * (multi-network). Each entry is addressed by its CAIP-2 chain id, which
   * {@link tezosCaip2FromNetworkType} derives from a `NetworkType`:
   *
   * ```ts
   * await wallet.requestPermissions({
   *   networks: [
   *     { chainId: tezosCaip2FromNetworkType(NetworkType.MAINNET)! },
   *     { chainId: tezosCaip2FromNetworkType(NetworkType.GHOSTNET)! },
   *   ],
   * });
   * ```
   *
   * The wallet then grants one account per network, and {@link setActiveNetwork}
   * selects which one subsequent operations and signatures go to.
   *
   * Wallets that predate multi-network ignore `networks` and grant a single
   * account on their own configured network. Pass
   * `requiredMinimumVersion: '4'` to the `BeaconWallet` constructor to reject
   * such wallets instead of silently degrading.
   */
  async requestPermissions(request?: RequestPermissionInput) {
    await this.client.requestPermissions(request);
  }

  /**
   * All accounts the wallet granted in the current session.
   *
   * A multi-network session holds one account per granted network, each carrying
   * its own `network.chainId`. A single-network session holds one account.
   */
  async getAccounts(): Promise<AccountInfo[]> {
    return this.client.getAccounts();
  }

  /**
   * CAIP-2 chain ids the wallet granted an account for in the current session.
   *
   * Empty when connected to a wallet that predates multi-network — those
   * sessions carry no chain id, and the network is the one the `BeaconWallet`
   * was constructed with.
   */
  async getGrantedNetworks(): Promise<string[]> {
    return this.chainIdsOf(await this.getAccounts());
  }

  /**
   * The network of the active account, or `undefined` when no account is active.
   *
   * On a multi-network session `chainId` is set and identifies the chain that
   * {@link sendOperations} targets; `rpcUrl` is populated only when the wallet
   * supplied one.
   */
  async getActiveNetwork(): Promise<Network | undefined> {
    const account = await this.client.getActiveAccount();

    return account?.network;
  }

  /**
   * Select which granted network subsequent operations and signatures target.
   *
   * Accepts a CAIP-2 chain id (`'tezos:NetXdQprcVkpaWU'`), a bare chain id
   * (`'NetXdQprcVkpaWU'`), or a `NetworkType` for networks with a statically
   * known genesis block. Switching networks does **not** re-pair the wallet.
   *
   * The `TezosToolkit` RPC is not part of the Beacon session, so point it at the
   * new network yourself:
   *
   * ```ts
   * await wallet.setActiveNetwork(NetworkType.GHOSTNET);
   * Tezos.setRpcProvider('https://rpc.ghostnet.teztnets.com');
   * ```
   *
   * @throws {NetworkNotGrantedError} if the wallet granted no account on that network
   * @throws {UnmappedNetworkError} if the network cannot be resolved to a CAIP-2 chain id
   */
  async setActiveNetwork(network: string | NetworkType): Promise<AccountInfo> {
    const chainId = this.toChainId(network);
    const accounts = await this.getAccounts();
    const account = accounts.find(
      (candidate) =>
        candidate.network?.chainId && normalizeTezosCaip2(candidate.network.chainId) === chainId
    );

    if (!account) {
      throw new NetworkNotGrantedError(chainId, this.chainIdsOf(accounts));
    }

    await this.client.setActiveAccount(account);
    return account;
  }

  /**
   * Distinct CAIP-2 chain ids carried by the given accounts. Accounts of a
   * session with a wallet that predates multi-network carry none.
   */
  private chainIdsOf(accounts: AccountInfo[]): string[] {
    const chainIds = accounts
      .map((account) => account.network?.chainId)
      .filter((chainId): chainId is string => typeof chainId === 'string' && chainId.length > 0)
      .map(normalizeTezosCaip2);

    return Array.from(new Set(chainIds));
  }

  /**
   * Resolve a network reference to a CAIP-2 chain id. `NetworkType` values are
   * looked up in the SDK genesis table; strings are taken as chain ids and only
   * normalized (a dApp can address a network the table does not cover).
   */
  private toChainId(network: string | NetworkType): string {
    if ((Object.values(NetworkType) as string[]).includes(network)) {
      const mapped = tezosCaip2FromNetworkType(network as NetworkType);
      if (!mapped) {
        throw new UnmappedNetworkError(network);
      }
      return mapped;
    }

    const chainId = normalizeTezosCaip2(network);
    if (!isValidTezosCaip2(chainId)) {
      throw new UnmappedNetworkError(network);
    }

    return chainId;
  }

  async getPKH() {
    const account = await this.client.getActiveAccount();
    if (!account) {
      throw new BeaconWalletNotInitialized();
    }
    return account.address;
  }

  async getPK() {
    const account = await this.client.getActiveAccount();
    if (!account) {
      throw new BeaconWalletNotInitialized();
    }
    return account.publicKey ?? '';
  }

  async mapTransferParamsToWalletParams(params: () => Promise<WalletTransferParams>) {
    let walletParams: WalletTransferParams;
    await this.client.showPrepare();
    try {
      walletParams = await params();
    } catch (err) {
      await this.client.hideUI(['alert']);
      throw err;
    }
    return this.removeDefaultParams(
      walletParams,
      await createTransferOperation(this.formatParameters(walletParams))
    );
  }

  async mapTransferTicketParamsToWalletParams(params: () => Promise<WalletTransferTicketParams>) {
    let walletParams: WalletTransferTicketParams;
    await this.client.showPrepare();
    try {
      walletParams = await params();
    } catch (err) {
      await this.client.hideUI(['alert']);
      throw err;
    }

    return this.removeDefaultParams(
      walletParams,
      await createTransferTicketOperation(this.formatParameters(walletParams))
    );
  }

  async mapStakeParamsToWalletParams(params: () => Promise<WalletStakeParams>) {
    let walletParams: WalletStakeParams;
    await this.client.showPrepare();
    try {
      walletParams = await params();
    } catch (err) {
      await this.client.hideUI(['alert']);
      throw err;
    }
    return this.removeDefaultParams(
      walletParams,
      await createTransferOperation(this.formatParameters(walletParams) as WalletTransferParams)
    );
  }

  async mapUnstakeParamsToWalletParams(params: () => Promise<WalletUnstakeParams>) {
    let walletParams: WalletUnstakeParams;
    await this.client.showPrepare();
    try {
      walletParams = await params();
    } catch (err) {
      await this.client.hideUI(['alert']);
      throw err;
    }
    return this.removeDefaultParams(
      walletParams,
      await createTransferOperation(this.formatParameters(walletParams) as WalletTransferParams)
    );
  }

  async mapFinalizeUnstakeParamsToWalletParams(params: () => Promise<WalletFinalizeUnstakeParams>) {
    let walletParams: WalletFinalizeUnstakeParams;
    await this.client.showPrepare();
    try {
      walletParams = await params();
    } catch (err) {
      await this.client.hideUI(['alert']);
      throw err;
    }
    return this.removeDefaultParams(
      walletParams,
      await createTransferOperation(this.formatParameters(walletParams) as WalletTransferParams)
    );
  }

  async mapIncreasePaidStorageWalletParams(params: () => Promise<WalletIncreasePaidStorageParams>) {
    let walletParams: WalletIncreasePaidStorageParams;
    await this.client.showPrepare();
    try {
      walletParams = await params();
    } catch (err) {
      await this.client.hideUI(['alert']);
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
      await this.client.hideUI(['alert']);
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
      await this.client.hideUI(['alert']);
      throw err;
    }

    return this.removeDefaultParams(
      walletParams,
      await createSetDelegateOperation(this.formatParameters(walletParams))
    );
  }

  async mapRegisterGlobalConstantParamsToWalletParams(
    params: () => Promise<WalletRegisterGlobalConstantParams>
  ) {
    let walletParams: WalletRegisterGlobalConstantParams;
    await this.client.showPrepare();
    try {
      walletParams = await params();
    } catch (err) {
      await this.client.hideUI(['alert']);
      throw err;
    }

    return this.removeDefaultParams(
      walletParams,
      await createRegisterGlobalConstantOperation(this.formatParameters(walletParams))
    );
  }

  formatParameters<T extends ParamsWithOptionalFees>(params: T): T {
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
    params:
      | WalletTransferParams
      | WalletStakeParams
      | WalletUnstakeParams
      | WalletFinalizeUnstakeParams
      | WalletOriginateParams
      | WalletDelegateParams
      | WalletRegisterGlobalConstantParams
      | WalletTransferTicketParams
      | WalletIncreasePaidStorageParams,
    operatedParams: RPCOperationWithLimits
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

    // On a multi-network session the wallet cannot infer which chain an operation
    // targets, so route it to the active account's network. Sessions with a
    // wallet that predates multi-network carry no chain id; there the network is
    // left out and the wallet uses the single network of the session, as before.
    const chainId = account.network?.chainId;

    const { transactionHash } = await this.client.requestOperation({
      operationDetails: params,
      ...(chainId ? { network: normalizeTezosCaip2(chainId) } : {}),
    });
    return transactionHash;
  }

  /**
   * Disconnect the wallet and clear the active Beacon session.
   *
   * This is the recommended way to end a user session (logout). It calls
   * `client.disconnect()` under the hood, which notifies wallet peers, clears
   * the active account, and tears down the active Beacon transports.
   *
   * After calling this method, the BeaconWallet instance can be used to
   * reconnect through a new permission request.
   *
   * For switching accounts without a full logout, use {@link clearActiveAccount} instead.
   */
  async disconnect() {
    await this.client.disconnect();
  }

  /**
   * Clear the active account without destroying the Beacon session.
   *
   * This removes the active account reference from local storage but does
   * **not** clear other Beacon state such as the cached relay node
   * (`beacon:matrix-selected-node`) or peer data.
   *
   * Use this for switching between accounts within an active session.
   * For a full logout that clears all Beacon storage, use {@link disconnect} instead.
   *
   * @see {@link disconnect}
   */
  async clearActiveAccount() {
    await this.client.setActiveAccount();
  }

  async sign(bytes: string, watermark?: Uint8Array) {
    let bb = hex2buf(bytes);
    if (typeof watermark !== 'undefined') {
      bb = mergebuf(watermark, bb);
    }
    const watermarkedBytes = buf2hex(toBuffer(bb));
    const signingType = this.getSigningType(watermark);
    if (signingType !== SigningType.OPERATION) {
      throw new UnsupportedActionError(
        `Taquito Beacon Wallet currently only supports signing operations, not ${signingType}`
      );
    }
    const { signature } = await this.client.requestSignPayload({
      payload: watermarkedBytes,
      signingType,
    });
    return signature;
  }

  private getSigningType(watermark?: Uint8Array) {
    if (!watermark || watermark.length === 0) {
      return SigningType.RAW;
    }
    if (watermark.length === 1) {
      if (watermark[0] === 5) {
        return SigningType.MICHELINE;
      }
      if (watermark[0] === 3) {
        return SigningType.OPERATION;
      }
    }
    throw new Error(`Invalid watermark ${JSON.stringify(watermark)}`);
  }
}

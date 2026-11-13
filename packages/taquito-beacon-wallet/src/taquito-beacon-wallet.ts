/// <reference types="chrome" preserve="true" />
/**
 * @packageDocumentation
 * @module @taquito/beacon-wallet
 */

import {
  type AlertButton,
  BeaconEvent,
  type BeaconEventType,
  type BeaconMessageRecord,
  type ConnectionInfo,
  DAppClient,
  type DAppClientDisconnectOptions,
  DAppClientOptions,
  type ExtendedPeerInfo,
  type PendingRequestInfo,
  type PermissionResponseOutput,
  RequestPermissionInput,
  PermissionScope,
  getDAppClientInstance,
  SigningType,
  NodeDistributions,
  Regions,
  type RequestResponseInfo,
  type RequestSentInfo,
  type StoredAccountInfo,
  type WalletInfo,
} from '@ecadlabs/beacon-dapp';
import { BeaconWalletNotInitialized, MissingRequiredScopes } from './errors';
import {
  createIncreasePaidStorageOperation,
  createOriginationOperation,
  createSmartRollupAddMessagesOperation,
  WalletSmartRollupAddMessagesParams,
  createSmartRollupOriginateOperation,
  WalletSmartRollupOriginateParams,
  createSmartRollupExecuteOutboxMessageOperation,
  WalletSmartRollupExecuteOutboxMessageParams,
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
export { BeaconWalletNotInitialized, MissingRequiredScopes } from './errors';

// Re-exported from @ecadlabs/beacon-dapp for consumers who need these without
// a direct beacon-dapp dependency. These types live only in beacon-dapp (not in
// beacon-types), so they come with beacon-dapp's side effects. For side-effect-free
// beacon types (NetworkType, SigningType, etc.), use '@taquito/beacon-wallet/types'.
export {
  AbortedBeaconError,
  BeaconError,
  BeaconEvent,
  BroadcastBeaconError,
  defaultEventCallbacks,
  getDebugEnabled,
  getError,
  getLogger,
  InternalLogger,
  isBeaconError,
  isErrorOrigin,
  isErrorResponse,
  isRequestErrorResponse,
  isTezosRpcError,
  LocalStorage,
  Logger,
  NetworkNotSupportedBeaconError,
  NoAddressBeaconError,
  NoPrivateKeyBeaconError,
  NotGrantedBeaconError,
  ParametersInvalidBeaconError,
  PeerUnreachableBeaconError,
  reportDiagnostic,
  setDebugEnabled,
  setLogger,
  SignatureTypeNotSupportedBeaconError,
  toBeaconError,
  TooManyOperationsBeaconError,
  TransactionInvalidBeaconError,
  UnknownBeaconError,
} from '@ecadlabs/beacon-dapp';
export type {
  AcknowledgeInfo,
  ActiveTransportInfo,
  BeaconErrorOptions,
  BeaconEventHandler,
  BeaconEventType,
  BeaconMessageDisposition,
  BeaconMessageRecord,
  ConnectionInfo,
  DAppClient,
  DAppClientDisconnectOptions,
  DAppClientOptions,
  DAppClientRemoveAllPeersOptions,
  ErrorOrigin,
  InvalidAccountDeactivatedEvent,
  InvalidAccountDeactivatedReason,
  LateErrorResponseInfo,
  LateResponseInfo,
  LateSuccessResponseInfo,
  LoggerDiagnostic,
  LoggerInterface,
  PendingRequestInfo,
  RequestErrorResponse,
  RequestResponseInfo,
  RequestSentInfo,
  ResponseMessage,
  ResponseOutput,
  TezosRpcError,
  TransportHealth,
  TransportStatusChangedInfo,
  TransportStatusChangeReason,
  V3ResponsePayload,
  WaitingForWalletAckInfo,
  WalletInfo,
  WireErrorMessage,
  WireErrorPayload,
} from '@ecadlabs/beacon-dapp';

/**
 * UI customization options for `DAppClientOptions.uiOptions`.
 */
export type DAppUiOptions = NonNullable<DAppClientOptions['uiOptions']>;

/**
 * Extra callback context passed to Beacon event handlers (such as `resetCallback`).
 */
export type ExtraInfo = RequestSentInfo['extraInfo'];

/**
 * Event handler callback signature accepted by {@link BeaconWallet.subscribeToEvent}
 * and `DAppClient.subscribeToEvent`.
 */
export type BeaconEventHandlerFunction<T = unknown> = (
  data: T,
  eventCallback?: AlertButton[]
) => void | Promise<void>;

/**
 * Payload metadata emitted with {@link BeaconEvent.PERMISSION_REQUEST_SUCCESS}.
 */
export type PermissionResponseInfo = Omit<
  BeaconEventType[BeaconEvent.PERMISSION_REQUEST_SUCCESS],
  keyof RequestResponseInfo
>;

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

type WalletOperationParams =
  | WalletTransferParams
  | WalletStakeParams
  | WalletUnstakeParams
  | WalletFinalizeUnstakeParams
  | WalletOriginateParams
  | WalletDelegateParams
  | WalletRegisterGlobalConstantParams
  | WalletTransferTicketParams
  | WalletIncreasePaidStorageParams;

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

  /**
   * Creates a `BeaconWallet` wrapping the singleton Beacon `DAppClient`.
   *
   * Under the covers, Beacon chooses a transport per wallet: browser extensions
   * (such as Temple) use local `postMessage`, TZIP-10 P2P wallets (such as Kukai
   * web) use Matrix relay nodes (curated by Taquito via `matrixNodes`), and
   * WalletConnect-enabled wallets (such as Kukai iOS) use WalletConnect v2.
   *
   * For WalletConnect support, register your own `projectId` at
   * https://dashboard.reown.com/ (with your dApp's allowed origins configured)
   * and pass it via `options.walletConnectOptions.projectId` (typically
   * injected from a frontend build-time environment variable).
   *
   * Relying on Beacon's built-in default `projectId` in production may put
   * your project in breach of the WalletConnect/Reown Terms of Service; that
   * demo-only fallback is deprecated and will be removed in the next minor
   * release of `@ecadlabs/beacon-dapp` (after which omitting `projectId` will
   * only disable WalletConnect pairings; extension and Matrix wallets will
   * continue to work).
   *
   * Note: `BeaconWallet` uses `getDAppClientInstance(options)` under the hood,
   * so all `BeaconWallet` instances in a page share a single `DAppClient`
   * singleton (Beacon logs a diagnostic warning if a second instance is
   * constructed with a different `name` or `network`).
   */
  constructor(options: DAppClientOptions) {
    const matrixNodes: NodeDistributions = {
      ...TAQUITO_CURATED_MATRIX_NODES,
      ...(options.matrixNodes ?? {}),
    };
    this.client = getDAppClientInstance({ ...options, matrixNodes });
  }

  private validateRequiredScopesOrFail(
    permissionScopes: ReadonlyArray<PermissionScope | string>,
    requiredScopes: PermissionScope[]
  ) {
    const mandatoryScope = new Set<PermissionScope | string>(requiredScopes);

    for (const scope of permissionScopes) {
      if (mandatoryScope.has(scope)) {
        mandatoryScope.delete(scope);
      }
    }

    if (mandatoryScope.size > 0) {
      throw new MissingRequiredScopes(
        Array.from(mandatoryScope).filter((scope): scope is PermissionScope =>
          requiredScopes.includes(scope as PermissionScope)
        )
      );
    }
  }

  async requestPermissions(request?: RequestPermissionInput): Promise<PermissionResponseOutput> {
    return this.client.requestPermissions(request);
  }

  /**
   * Returns the currently active account from the underlying `DAppClient`,
   * or `undefined` when disconnected. Does not throw when uninitialized.
   */
  async getActiveAccount(): Promise<StoredAccountInfo | undefined> {
    return this.client.getActiveAccount();
  }

  /**
   * Sets (or clears, when omitted) the active account on the underlying `DAppClient`.
   */
  async setActiveAccount(account?: StoredAccountInfo): Promise<void> {
    await this.client.setActiveAccount(account);
  }

  /**
   * Returns all persisted accounts known to the underlying `DAppClient`.
   */
  async getAccounts(): Promise<StoredAccountInfo[]> {
    return this.client.getAccounts();
  }

  /**
   * Returns all known peers across transports without blocking when no transport is active.
   */
  async getPeers(): Promise<ExtendedPeerInfo[]> {
    return this.client.getPeers();
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

  private async prepareParams<Params>(params: () => Promise<Params>): Promise<Params> {
    await this.client.showPrepare();
    try {
      return await params();
    } catch (error) {
      await this.client.hideUI(['alert', 'toast']);
      throw error;
    }
  }

  private async mapSmartRollupOperation<
    Params extends object,
    Operation extends RPCOperationWithLimits,
  >(params: () => Promise<Params>, createOperation: (input: Params) => Promise<Operation>) {
    const input = await this.prepareParams(params);
    const { fee, gas_limit, storage_limit, ...operation } = await createOperation({ ...input });
    return {
      ...operation,
      ...(fee === undefined ? {} : { fee: String(fee) }),
      ...(gas_limit === undefined ? {} : { gas_limit: String(gas_limit) }),
      ...(storage_limit === undefined ? {} : { storage_limit: String(storage_limit) }),
    };
  }

  private async mapWalletOperation<
    Params extends WalletOperationParams,
    Operation extends RPCOperationWithLimits,
  >(params: () => Promise<Params>, createOperation: (input: Params) => Promise<Operation>) {
    const walletParams = await this.prepareParams(params);
    return this.removeDefaultParams(
      walletParams,
      await createOperation(this.formatParameters(walletParams))
    );
  }

  /** Map SmartRollupAddMessages parameters for the wallet request. */
  async mapSmartRollupAddMessagesParamsToWalletParams(
    params: () => Promise<WalletSmartRollupAddMessagesParams>
  ) {
    return this.mapSmartRollupOperation(params, createSmartRollupAddMessagesOperation);
  }

  /** Map SmartRollupOriginate parameters for the wallet request. */
  async mapSmartRollupOriginateParamsToWalletParams(
    params: () => Promise<WalletSmartRollupOriginateParams>
  ) {
    return this.mapSmartRollupOperation(params, createSmartRollupOriginateOperation);
  }

  /** Map SmartRollupExecuteOutboxMessage parameters for the wallet request. */
  async mapSmartRollupExecuteOutboxMessageParamsToWalletParams(
    params: () => Promise<WalletSmartRollupExecuteOutboxMessageParams>
  ) {
    return this.mapSmartRollupOperation(params, createSmartRollupExecuteOutboxMessageOperation);
  }

  async mapTransferParamsToWalletParams(params: () => Promise<WalletTransferParams>) {
    return this.mapWalletOperation(params, createTransferOperation);
  }

  async mapTransferTicketParamsToWalletParams(params: () => Promise<WalletTransferTicketParams>) {
    return this.mapWalletOperation(params, createTransferTicketOperation);
  }

  async mapStakeParamsToWalletParams(params: () => Promise<WalletStakeParams>) {
    return this.mapWalletOperation(params, (walletParams) =>
      createTransferOperation(walletParams as WalletTransferParams)
    );
  }

  async mapUnstakeParamsToWalletParams(params: () => Promise<WalletUnstakeParams>) {
    return this.mapWalletOperation(params, (walletParams) =>
      createTransferOperation(walletParams as WalletTransferParams)
    );
  }

  async mapFinalizeUnstakeParamsToWalletParams(params: () => Promise<WalletFinalizeUnstakeParams>) {
    return this.mapWalletOperation(params, (walletParams) =>
      createTransferOperation(walletParams as WalletTransferParams)
    );
  }

  async mapIncreasePaidStorageWalletParams(params: () => Promise<WalletIncreasePaidStorageParams>) {
    return this.mapWalletOperation(params, createIncreasePaidStorageOperation);
  }

  async mapOriginateParamsToWalletParams(params: () => Promise<WalletOriginateParams>) {
    return this.mapWalletOperation(params, createOriginationOperation);
  }

  async mapDelegateParamsToWalletParams(params: () => Promise<WalletDelegateParams>) {
    return this.mapWalletOperation(params, createSetDelegateOperation);
  }

  async mapRegisterGlobalConstantParamsToWalletParams(
    params: () => Promise<WalletRegisterGlobalConstantParams>
  ) {
    return this.mapWalletOperation(params, createRegisterGlobalConstantOperation);
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

  removeDefaultParams(params: WalletOperationParams, operatedParams: RPCOperationWithLimits) {
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
  async disconnect(options?: DAppClientDisconnectOptions) {
    await this.client.disconnect(options);
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

  /**
   * Returns resolved metadata (`name`, optional `icon`, `deeplink`, and `type`)
   * for the active wallet account without initializing a transport or prompting
   * the user, or `undefined` when disconnected.
   */
  async getWalletInfo(): Promise<WalletInfo | undefined> {
    return this.client.getActiveWalletInfo();
  }

  /**
   * Returns a non-blocking snapshot of the current transport connection status,
   * health (`'ok' | 'degraded'`), active relay server, and peer sender ID.
   */
  async getConnectionInfo(): Promise<ConnectionInfo> {
    return this.client.getConnectionInfo();
  }

  /**
   * Synchronously returns a read-only snapshot of currently open requests
   * awaiting a wallet response.
   */
  getPendingRequests(): readonly PendingRequestInfo[] {
    return this.client.getPendingRequests();
  }

  /**
   * Subscribes to a {@link BeaconEvent} on the underlying `DAppClient` and
   * returns an idempotent unsubscribe function.
   */
  async subscribeToEvent<K extends BeaconEvent>(
    internalEvent: K,
    eventCallback: BeaconEventHandlerFunction<BeaconEventType[K]>
  ): Promise<() => void> {
    return this.client.subscribeToEvent(internalEvent, eventCallback);
  }

  /**
   * Subscribes to immutable plaintext Beacon protocol message snapshots
   * (`direction: 'incoming' | 'outgoing'`, `transport`, `senderId`, `ts`,
   * `message`, and optional incoming routing `disposition`) and returns an
   * idempotent unsubscribe function.
   */
  subscribeToMessages(listener: (record: BeaconMessageRecord) => void): () => void {
    return this.client.subscribeToMessages(listener);
  }

  async sign(bytes: string, watermark?: Uint8Array) {
    let bb = hex2buf(bytes);
    if (typeof watermark !== 'undefined') {
      bb = mergebuf(watermark, bb);
    }
    const watermarkedBytes = buf2hex(bb);
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

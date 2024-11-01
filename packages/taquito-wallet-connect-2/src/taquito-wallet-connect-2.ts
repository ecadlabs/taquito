/**
 * @packageDocumentation
 * @module @taquito/wallet-connect-2
 */

import Client from '@walletconnect/sign-client';
import { SignClientTypes, SessionTypes, PairingTypes } from '@walletconnect/types';
import QRCodeModal from '@walletconnect/legacy-modal';
// import { WalletConnectModal } from '@walletconnect/modal';

import {
  createOriginationOperation,
  createSetDelegateOperation,
  createTransferOperation,
  createTransferTicketOperation,
  createIncreasePaidStorageOperation,
  RPCDelegateOperation,
  RPCOriginationOperation,
  RPCTransferOperation,
  RPCTransferTicketOperation,
  RPCIncreasePaidStorageOperation,
  WalletDelegateParams,
  WalletOriginateParams,
  WalletProvider,
  WalletTransferParams,
  WalletTransferTicketParams,
  WalletStakeParams,
  WalletUnstakeParams,
  WalletFinalizeUnstakeParams,
  WalletIncreasePaidStorageParams,
} from '@taquito/taquito';
import { getSdkError } from '@walletconnect/utils';
import {
  NetworkType,
  OperationParams,
  PermissionScopeMethods,
  PermissionScopeParam,
  TezosAccount,
} from './types';
import {
  ActiveAccountUnspecified,
  ActiveNetworkUnspecified,
  ConnectionFailed,
  InvalidAccount,
  InvalidNetwork,
  InvalidNetworkOrAccount,
  InvalidReceivedSessionNamespace,
  InvalidSession,
  InvalidSessionKey,
  MissingRequiredScope,
  NotConnected,
  PublicKeyRetrievalError,
} from './errors';

export { SignClientTypes, PairingTypes };
export * from './errors';
export * from './types';

const TEZOS_PLACEHOLDER = 'tezos';

export class WalletConnect2 implements WalletProvider {
  public signClient: Client;
  private session: SessionTypes.Struct | undefined;
  private activeAccount: string | undefined;
  private activeNetwork: string | undefined;
  // private WalletConnectModal: WalletConnectModal;

  constructor(signClient: Client) {
    // constructor(signClient: Client, WalletConnectModal: WalletConnectModal) {

    this.signClient = signClient;
    // this.WalletConnectModal = WalletConnectModal;

    this.signClient.on('session_delete', ({ topic }) => {
      if (this.session?.topic === topic) {
        this.session = undefined;
      }
    });

    this.signClient.on('session_expire', ({ topic }) => {
      if (this.session?.topic === topic) {
        this.session = undefined;
      }
    });

    this.signClient.on('session_update', ({ params, topic }) => {
      if (this.session?.topic === topic) {
        this.session.namespaces = params.namespaces;
        // TODO determine if we need validation on the namespace here
      }
    });

    this.signClient.on('session_event', () => {
      // TODO Do we need to handle other session events, such as "chainChanged", "accountsChanged", etc.
    });
  }

  /**
   * @description Initialize a WalletConnect2 provider
   * (Initialize a wallect connect 2 client with persisted storage and a network connection)
   *
   * @example
   * ```
   * await WalletConnect2.init({
   *  projectId: "YOUR_PROJECT_ID",
   *  metadata: {
   *    name: "YOUR_DAPP_NAME",
   *    description: "YOUR_DAPP_DESCRIPTION",
   *    icons: ["ICON_URL"],
   *    url: "DAPP_URL",
   *  },
   * });
   * ```
   */
  static async init(initParams: SignClientTypes.Options) {
    // if (!initParams.projectId) {
    //   throw new Error('projectId is required');
    // }
    const client = await Client.init(initParams);
    // const walletConnectModal = new WalletConnectModal({ projectId: initParams.projectId });
    return new WalletConnect2(client);
    // return new WalletConnect2(client, walletConnectModal);
  }

  /**
   * @description Request permission for a new session and establish a connection.
   *
   * @param connectParams.permissionScope The networks, methods, and events that will be granted permission
   * @param connectParams.pairingTopic Option to connect to an existing active pairing. If pairingTopic is defined, a prompt will appear in the corresponding wallet to accept or decline the session proposal. If no pairingTopic, a QR code modal will open in the dapp, allowing to connect to a wallet.
   * @param connectParams.registryUrl Optional registry of wallet deep links to show in the Modal
   * @error ConnectionFailed is thrown if no connection can be established with a wallet
   */
  async requestPermissions(connectParams: {
    permissionScope: PermissionScopeParam;
    pairingTopic?: string;
    registryUrl?: string;
  }) {
    // TODO when Tezos wallets will officially support wallet connect 2, we need to provide a default value for registryUrl
    try {
      const { uri, approval } = await this.signClient.connect({
        requiredNamespaces: {
          [TEZOS_PLACEHOLDER]: {
            chains: connectParams.permissionScope.networks.map(
              (network) => `${TEZOS_PLACEHOLDER}:${network}`
            ),
            methods: connectParams.permissionScope.methods,
            events: connectParams.permissionScope.events ?? [],
          },
        },
        pairingTopic: connectParams.pairingTopic,
      });

      if (uri) {
        QRCodeModal.open(uri, () => {}, { registryUrl: connectParams.registryUrl });
        // this.WalletConnectModal.openModal({ uri, chains: [TEZOS_PLACEHOLDER] });
        // this.session = await approval();
      }
      this.session = await approval();
    } catch (error) {
      throw new ConnectionFailed(error);
    } finally {
      QRCodeModal.close();
    }
    this.validateReceivedNamespace(connectParams.permissionScope, this.session.namespaces);
    this.setDefaultAccountAndNetwork();
  }

  /**
   * @description Access all existing active pairings
   */
  getAvailablePairing() {
    return this.signClient.pairing.getAll({ active: true });
  }

  /**
   * @description Access all existing sessions
   * @return an array of strings which represent the session keys
   */
  getAllExistingSessionKeys() {
    return this.signClient.session.keys;
  }

  /**
   * @description Configure the Client with an existing session.
   * The session is immediately restored without a prompt on the wallet to accept/decline it.
   * @error InvalidSessionKey is thrown if the provided session key doesn't exist
   */
  configureWithExistingSessionKey(key: string) {
    const sessions = this.getAllExistingSessionKeys();
    if (!sessions.includes(key)) {
      throw new InvalidSessionKey(key);
    }
    this.session = this.signClient.session.get(key);
    this.setDefaultAccountAndNetwork();
  }

  async disconnect() {
    if (this.session) {
      await this.signClient.disconnect({
        topic: this.session.topic,
        reason: getSdkError('USER_DISCONNECTED'),
      });
      this.clearState();
    }
  }

  getPeerMetadata() {
    return this.getSession().peer.metadata;
  }

  /**
   * @description Once the session is establish, send Tezos operations to be approved, signed and inject by the wallet.
   * @error MissingRequiredScope is thrown if permission to send operation was not granted
   */
  async sendOperations(params: OperationParams[]) {
    const session = this.getSession();
    if (!this.getPermittedMethods().includes(PermissionScopeMethods.TEZOS_SEND)) {
      throw new MissingRequiredScope(PermissionScopeMethods.TEZOS_SEND);
    }
    const network = this.getActiveNetwork();
    const account = await this.getPKH();
    this.validateNetworkAndAccount(network, account);
    const { operationHash } = await this.signClient.request<{ operationHash: string }>({
      topic: session.topic,
      chainId: `${TEZOS_PLACEHOLDER}:${network}`,
      request: {
        method: PermissionScopeMethods.TEZOS_SEND,
        params: {
          account,
          operations: params,
        },
      },
    });
    return operationHash;
  }

  /**
   * @description Once the session is establish, send payload to be signed by the wallet.
   * @error MissingRequiredScope is thrown if permission to sign payload was not granted
   */
  async sign(bytes: string, watermark?: Uint8Array): Promise<string> {
    const session = this.getSession();
    if (!this.getPermittedMethods().includes(PermissionScopeMethods.TEZOS_SIGN)) {
      throw new MissingRequiredScope(PermissionScopeMethods.TEZOS_SIGN);
    }
    const network = this.getActiveNetwork();
    const account = await this.getPKH();
    this.validateNetworkAndAccount(network, account);
    let expression = bytes;
    if (watermark) {
      expression =
        Array.from(watermark, (byte) => byte.toString(16).padStart(2, '0')).join('') + expression;
    }
    const { signature } = await this.signClient.request<{ signature: string }>({
      topic: session.topic,
      chainId: `${TEZOS_PLACEHOLDER}:${network}`,
      request: {
        method: PermissionScopeMethods.TEZOS_SIGN,
        params: {
          account: await this.getPKH(),
          payload: expression,
        },
      },
    });
    return signature;
  }

  /**
   * @description Return all connected accounts from the active session
   * @error NotConnected if no active session
   */
  getAccounts() {
    return this.getTezosNamespace().accounts.map((account) => account.split(':')[2]);
  }

  /**
   * @description Set the active account.
   * Must be called if there are multiple accounts in the session and every time the active account is switched
   * @param pkh public key hash of the selected account
   * @error InvalidAccount thrown if the pkh is not part of the active accounts in the session
   */
  setActiveAccount(pkh: string) {
    if (!this.getAccounts().includes(pkh)) {
      throw new InvalidAccount(pkh);
    }
    this.activeAccount = pkh;
  }

  /**
   * @description Access the public key hash of the active account
   * @error ActiveAccountUnspecified thrown when there are multiple Tezos account in the session and none is set as the active one
   */
  async getPKH() {
    if (!this.activeAccount) {
      this.getSession();
      throw new ActiveAccountUnspecified();
    }
    return this.activeAccount;
  }

  // TODO need test-dapp test
  /**
   * @description Access the public key of the active account
   * @error ActiveAccountUnspecified thrown when there are multiple Tezos account in the session and none is set as the active one
   * @error MissingRequiredScope is thrown if permission to get accounts was not granted
   * @error PublicKeyRetrievalError is thrown if the public key is not found
   */
  async getPK() {
    const session = this.getSession();
    if (!this.getPermittedMethods().includes(PermissionScopeMethods.TEZOS_GET_ACCOUNTS)) {
      throw new MissingRequiredScope(PermissionScopeMethods.TEZOS_GET_ACCOUNTS);
    }
    const network = this.getActiveNetwork();
    const account = await this.getPKH();
    const accounts = await this.signClient.request<TezosAccount[]>({
      topic: session.topic,
      chainId: `${TEZOS_PLACEHOLDER}:${network}`,
      request: {
        method: PermissionScopeMethods.TEZOS_GET_ACCOUNTS,
        params: {},
      },
    });

    const selectedAccount = accounts.find((acc) => acc.address === account);
    if (!selectedAccount) {
      throw new PublicKeyRetrievalError();
    }
    return selectedAccount.pubkey;
  }

  /**
   * @description Return all networks from the namespace of the active session
   * @error NotConnected if no active session
   */
  getNetworks() {
    return this.getPermittedNetwork();
  }

  /**
   * @description Set the active network.
   * Must be called if there are multiple network in the session and every time the active network is switched
   * @param network selected network
   * @error InvalidNetwork thrown if the network is not part of the active networks in the session
   */
  setActiveNetwork(network: NetworkType) {
    if (!this.getNetworks().includes(network)) {
      throw new InvalidNetwork(network);
    }
    this.activeNetwork = network;
  }

  /**
   * @description Access the active network
   * @error ActiveNetworkUnspecified thorwn when there are multiple Tezos netwroks in the session and none is set as the active one
   */
  getActiveNetwork() {
    if (!this.activeNetwork) {
      this.getSession();
      throw new ActiveNetworkUnspecified();
    }
    return this.activeNetwork;
  }

  private setDefaultAccountAndNetwork() {
    const activeAccount = this.getAccounts();
    if (activeAccount.length === 1) {
      this.activeAccount = activeAccount[0];
    }
    const activeNetwork = this.getNetworks();
    if (activeNetwork.length === 1) {
      this.activeNetwork = activeNetwork[0];
    }
  }

  private clearState() {
    this.session = undefined;
    this.activeAccount = undefined;
    this.activeNetwork = undefined;
  }

  getSession() {
    if (!this.session) {
      throw new NotConnected();
    }
    return this.session;
  }

  isActiveSession() {
    return this.session ? true : false;
  }

  ping() {
    this.signClient.ping({ topic: this.getSession().topic });
  }

  // https://docs.walletconnect.com/2.0/specs/clients/sign/session-namespaces#non-controller-side-validation-of-incoming-proposal-namespaces-dapp
  // TODO: add validations related to Namespaces extensions and related unit tests:
  // https://docs.walletconnect.com/2.0/specs/clients/sign/session-namespaces#210-extensions-may-be-merged-into-namespace
  // https://docs.walletconnect.com/2.0/specs/clients/sign/session-namespaces#212-session-namespaces-extensions-may-extend-methods-and-events-of-proposal-namespaces-extensions
  // https://docs.walletconnect.com/2.0/specs/clients/sign/session-namespaces#213-session-namespaces-extensions-may-contain-accounts-from-chains-not-defined-in-proposal-namespaces-extensions
  // https://docs.walletconnect.com/2.0/specs/clients/sign/session-namespaces#214-session-namespaces-may-add-extensions-not-defined-in-proposal-namespaces-extensions
  private validateReceivedNamespace(
    scope: PermissionScopeParam,
    receivedNamespaces: Record<string, SessionTypes.Namespace>
  ) {
    if (receivedNamespaces[TEZOS_PLACEHOLDER]) {
      this.validateMethods(scope.methods, receivedNamespaces[TEZOS_PLACEHOLDER].methods);
      if (scope.events) {
        this.validateEvents(scope.events, receivedNamespaces['tezos'].events);
      }
      this.validateAccounts(scope.networks, receivedNamespaces[TEZOS_PLACEHOLDER].accounts);
    } else {
      this.clearState();
      throw new InvalidReceivedSessionNamespace(
        'All namespaces must be approved',
        getSdkError('USER_REJECTED').code,
        'incomplete',
        'tezos'
      );
    }
  }

  private validateMethods(requiredMethods: string[], receivedMethods: string[]) {
    const missingMethods: string[] = [];
    requiredMethods.forEach((method) => {
      if (!receivedMethods.includes(method)) {
        missingMethods.push(method);
      }
    });
    if (missingMethods.length > 0) {
      this.clearState();
      throw new InvalidReceivedSessionNamespace(
        'All methods must be approved',
        getSdkError('USER_REJECTED_METHODS').code,
        'incomplete',
        missingMethods
      );
    }
  }

  private validateEvents(requiredEvents: string[], receivedEvents: string[]) {
    const missingEvents: string[] = [];
    requiredEvents.forEach((method) => {
      if (!receivedEvents.includes(method)) {
        missingEvents.push(method);
      }
    });
    if (missingEvents.length > 0) {
      this.clearState();
      throw new InvalidReceivedSessionNamespace(
        'All events must be approved',
        getSdkError('USER_REJECTED_EVENTS').code,
        'incomplete',
        missingEvents
      );
    }
  }

  private validateAccounts(requiredNetwork: string[], receivedAccounts: string[]) {
    if (receivedAccounts.length === 0) {
      this.clearState();
      throw new InvalidReceivedSessionNamespace(
        'Accounts must not be empty',
        getSdkError('USER_REJECTED_CHAINS').code,
        'incomplete'
      );
    }
    const receivedChains: string[] = [];
    const invalidChains: string[] = [];
    const missingChains: string[] = [];
    const invalidChainsNamespace: string[] = [];

    receivedAccounts.forEach((chain) => {
      const accountId = chain.split(':');
      if (accountId.length !== 3) {
        invalidChains.push(chain);
      }
      if (accountId[0] !== TEZOS_PLACEHOLDER) {
        invalidChainsNamespace.push(chain);
      }
      const network = accountId[1];
      if (!receivedChains.includes(network)) {
        receivedChains.push(network);
      }
    });

    if (invalidChains.length > 0) {
      this.clearState();
      throw new InvalidReceivedSessionNamespace(
        'Accounts must be CAIP-10 compliant',
        getSdkError('USER_REJECTED_CHAINS').code,
        'invalid',
        invalidChains
      );
    }

    if (invalidChainsNamespace.length > 0) {
      this.clearState();
      throw new InvalidReceivedSessionNamespace(
        'Accounts must be defined in matching namespace',
        getSdkError('UNSUPPORTED_ACCOUNTS').code,
        'invalid',
        invalidChainsNamespace
      );
    }
    requiredNetwork.forEach((network) => {
      if (!receivedChains.includes(network)) {
        missingChains.push(network);
      }
    });
    if (missingChains.length > 0) {
      this.clearState();
      throw new InvalidReceivedSessionNamespace(
        'All chains must have at least one account',
        getSdkError('USER_REJECTED_CHAINS').code,
        'incomplete',
        missingChains
      );
    }
  }

  private getTezosNamespace(): {
    accounts: string[];
    methods: string[];
    events: string[];
  } {
    if (TEZOS_PLACEHOLDER in this.getSession().namespaces) {
      return this.getSession().namespaces[TEZOS_PLACEHOLDER];
    } else {
      throw new InvalidSession('Tezos not found in namespaces');
    }
  }

  private getTezosRequiredNamespace(): {
    chains?: string[];
    methods: string[];
    events: string[];
  } {
    if (TEZOS_PLACEHOLDER in this.getSession().requiredNamespaces) {
      return this.getSession().requiredNamespaces[TEZOS_PLACEHOLDER];
    } else {
      throw new InvalidSession('Tezos not found in requiredNamespaces');
    }
  }

  private validateNetworkAndAccount(network: string, account: string) {
    if (!this.getTezosNamespace().accounts.includes(`${TEZOS_PLACEHOLDER}:${network}:${account}`)) {
      throw new InvalidNetworkOrAccount(network, account);
    }
  }

  private getPermittedMethods() {
    return this.getTezosRequiredNamespace().methods;
  }

  private getPermittedNetwork() {
    return this.getTezosRequiredNamespace().chains!.map((chain) => chain.split(':')[1]);
  }

  private formatParameters(
    params:
      | WalletTransferParams
      | WalletTransferTicketParams
      | WalletOriginateParams
      | WalletDelegateParams
      | WalletIncreasePaidStorageParams
  ) {
    const formatedParams: any = params;
    if (typeof params.fee !== 'undefined') {
      formatedParams.fee = params.fee.toString();
    }
    if (typeof params.storageLimit !== 'undefined') {
      formatedParams.storageLimit = params.storageLimit.toString();
    }
    if (typeof params.gasLimit !== 'undefined') {
      formatedParams.gasLimit = params.gasLimit.toString();
    }
    return formatedParams;
  }

  private removeDefaultLimits(
    params:
      | WalletTransferParams
      | WalletTransferTicketParams
      | WalletOriginateParams
      | WalletDelegateParams
      | WalletIncreasePaidStorageParams,
    operatedParams:
      | Partial<RPCTransferOperation>
      | Partial<RPCTransferTicketOperation>
      | Partial<RPCOriginationOperation>
      | Partial<RPCDelegateOperation>
      | Partial<RPCIncreasePaidStorageOperation>
  ) {
    if (typeof params.fee === 'undefined') {
      delete operatedParams.fee;
    }
    if (typeof params.storageLimit === 'undefined') {
      delete operatedParams.storage_limit;
    }
    if (typeof params.gasLimit === 'undefined') {
      delete operatedParams.gas_limit;
    }
    return operatedParams;
  }

  async mapTransferParamsToWalletParams(params: () => Promise<WalletTransferParams>) {
    const walletParams: WalletTransferParams = await params();

    return this.removeDefaultLimits(
      walletParams,
      await createTransferOperation(this.formatParameters(walletParams))
    );
  }

  async mapTransferTicketParamsToWalletParams(params: () => Promise<WalletTransferTicketParams>) {
    const walletParams: WalletTransferTicketParams = await params();

    return this.removeDefaultLimits(
      walletParams,
      await createTransferTicketOperation(this.formatParameters(walletParams))
    );
  }

  async mapStakeParamsToWalletParams(params: () => Promise<WalletStakeParams>) {
    const walletParams: WalletStakeParams = await params();

    return this.removeDefaultLimits(
      walletParams,
      await createTransferOperation(this.formatParameters(walletParams))
    );
  }

  async mapUnstakeParamsToWalletParams(params: () => Promise<WalletUnstakeParams>) {
    const walletParams: WalletUnstakeParams = await params();

    return this.removeDefaultLimits(
      walletParams,
      await createTransferOperation(this.formatParameters(walletParams))
    );
  }

  async mapFinalizeUnstakeParamsToWalletParams(params: () => Promise<WalletFinalizeUnstakeParams>) {
    const walletParams: WalletFinalizeUnstakeParams = await params();

    return this.removeDefaultLimits(
      walletParams,
      await createTransferOperation(this.formatParameters(walletParams))
    );
  }

  async mapOriginateParamsToWalletParams(params: () => Promise<WalletOriginateParams>) {
    const walletParams: WalletOriginateParams = await params();

    return this.removeDefaultLimits(
      walletParams,
      await createOriginationOperation(this.formatParameters(walletParams))
    );
  }

  async mapDelegateParamsToWalletParams(params: () => Promise<WalletDelegateParams>) {
    const walletParams: WalletDelegateParams = await params();

    return this.removeDefaultLimits(
      walletParams,
      await createSetDelegateOperation(this.formatParameters(walletParams))
    );
  }

  async mapIncreasePaidStorageWalletParams(params: () => Promise<WalletIncreasePaidStorageParams>) {
    const walletParams: WalletIncreasePaidStorageParams = await params();

    return this.removeDefaultLimits(
      walletParams,
      await createIncreasePaidStorageOperation(this.formatParameters(walletParams))
    );
  }
}

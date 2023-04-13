/**
 * @packageDocumentation
 * @module @taquito/wallet-connect-2
 */

import SignClient from '@walletconnect/sign-client';
import { SignClientTypes, SessionTypes, PairingTypes } from '@walletconnect/types';
import { Web3Modal } from '@web3modal/standalone';
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
import { getSdkError } from '@walletconnect/utils';
import {
  NetworkType,
  OperationParams,
  PermissionScopeMethods,
  PermissionScopeParam,
  SigningType,
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
} from './errors';

export { SignClientTypes, PairingTypes };
export * from './errors';
export * from './types';

const TEZOS_PLACEHOLDER = 'tezos';

export class WalletConnect2 implements WalletProvider {
  public signClient: SignClient;
  private session: SessionTypes.Struct | undefined;
  private activeAccount: string | undefined;
  private activeNetwork: string | undefined;
  private web3Modal: Web3Modal;

  constructor(signClient: SignClient, web3Modal: Web3Modal) {
    this.signClient = signClient;
    this.web3Modal = web3Modal;

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
    if (!initParams.projectId) {
      throw new Error('ProjectId needs to be set in `initParams: SignClientTypes.Options` sent to `WalletConnect2.init`')
    }
    const client = await SignClient.init(initParams);
    const web3Modal = new Web3Modal({
      walletConnectVersion: 2,
      projectId: initParams.projectId,
      standaloneChains: ['eip155:1']
    })
    return new WalletConnect2(client, web3Modal);
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
        this.web3Modal.openModal({
          uri,
          // TODO: registryUrl: connectParams.registryUrl
        });
      }
      const session = await approval();
      this.session = session;
    } catch (error) {
      throw new ConnectionFailed(error);
    } finally {
      this.web3Modal.closeModal();
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
    // Todo: Question: Should we validate the namespace here?
    // Answer: Yes. Consider this scenario: The Dapp is updated with new requirements. 
    //    The old sessions might lack required namespaces.
    //    OR: The wallet has dropped support for some of the methods/events in a namespace.
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
   * @description Once the session is establish, send Tezos operations to be approved, signed and injected by the wallet.
   * @error MissingRequiredScope is thrown if permission to send operation was not granted
   */
  async sendOperations(params: OperationParams[]) {
    const session = this.getSession();
    if (!this.getPermittedMethods().includes(PermissionScopeMethods.OPERATION_REQUEST)) {
      throw new MissingRequiredScope(PermissionScopeMethods.OPERATION_REQUEST);
    }
    const network = this.getActiveNetwork();
    const account = await this.getPKH();
    this.validateNetworkAndAccount(network, account);
    const hash = await this.signClient.request<string>({
      topic: session.topic,
      chainId: `${TEZOS_PLACEHOLDER}:${network}`,
      request: {
        method: PermissionScopeMethods.OPERATION_REQUEST,
        params: {
          account,
          operations: params,
        },
      },
    });
    return hash;
  }

  /**
   * @description Once the session is establish, send payload to be approved and signed by the wallet.
   * @error MissingRequiredScope is thrown if permission to sign payload was not granted
   */
  async signPayload(params: {
    signingType?: SigningType;
    payload: string;
    sourceAddress?: string;
  }) {
    const session = this.getSession();
    if (!this.getPermittedMethods().includes(PermissionScopeMethods.SIGN)) {
      throw new MissingRequiredScope(PermissionScopeMethods.SIGN);
    }
    const network = this.getActiveNetwork();
    const account = await this.getPKH();
    this.validateNetworkAndAccount(network, account);
    const signature = await this.signClient.request<string>({
      topic: session.topic,
      chainId: `${TEZOS_PLACEHOLDER}:${network}`,
      request: {
        method: PermissionScopeMethods.SIGN,
        params: {
          account: params.sourceAddress ?? account,
          expression: params.payload,
          signingType: params.signingType,
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
    // Todo: Question: What if some of accounts are not in the right format? 
    //    Should all fail? Should that one be returned with a special value?
    // Answer: Not important for the moment. The accounts are expected to be in
    //    the right format.
    return this.getTezosNamespace().accounts.map((account) => account.split(':')[2]);
  }

  /**
   * @description Set the active account.
   * Must be called if there are multiple accounts in the session and every time the active account is switched
   * @param pkh public key hash of the selected account
   * @error InvalidAccount thrown if the pkh is not part of the active accounts in the session
   */
  setActiveAccount(pkh: string) {
    // Todo: Question: Should we allow clearing the active account?
    // Todo: Question: What if the wallet has added an account later (after connection)?
    // Answer: Actually, the problem will happen if the wallet has removed an account after
    //    the session is established, as the user will not be able to sign using that account
    // Question: Is the only solution to disconnect and reconnect?
    if (!this.getAccounts().includes(pkh)) {
      throw new InvalidAccount(pkh);
    }
    this.activeAccount = pkh;
  }

  /**
   * @description Access the public key hash of the active account
   * @error ActiveAccountUnspecified thorwn when there are multiple Tezos account in the session and none is set as the active one
   */
  async getPKH() {
    if (!this.activeAccount) {
      this.getSession();
      const accounts = this.getAccounts();
      if (accounts.length === 1) {
        return accounts[0];
      }
      throw new ActiveAccountUnspecified();
    }
    return this.activeAccount;
  }

  /**
   * @description Return all networks from the namespace of the active session
   * @error NotConnected if no active session
   */
  getNetworks() {
    return this.getPermittedNetworks();
  }

  /**
   * @description Set the active network.
   * Must be called if there are multiple network in the session and every time the active network is switched
   * @param network selected network
   * @error InvalidNetwork thrown if the network is not part of the active networks in the session
   */
  setActiveNetwork(network: NetworkType) {
    // Todo: Question: Should we allow clearing the active network?
    const networks = this.getNetworks();
    if (networks && networks.length && !networks.includes(network)) {
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
      const networks = this.getNetworks();
      if (networks?.length === 1) {
        return networks[0];
      }
      throw new ActiveNetworkUnspecified();
    }
    return this.activeNetwork;
  }

  private setDefaultAccountAndNetwork() {
    const activeAccount = this.getAccounts();
    if (activeAccount.length === 1) {
      this.activeAccount = activeAccount[0];
      // Todo: Question: Isn't it better to call the setActiveAccount method instead?
    }
    const activeNetwork = this.getNetworks();
    if (activeNetwork && activeNetwork.length === 1) {
      this.activeNetwork = activeNetwork[0];
      // Todo: Question: Same, Isn't it better to call the setActiveNetwork method instead?
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

  isSessionActive() {
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
    const tezosNamespaces = receivedNamespaces[TEZOS_PLACEHOLDER];
    if (tezosNamespaces) {
      this.validateMethods(scope.methods, tezosNamespaces.methods);
      if (scope.events) {
        this.validateEvents(scope.events, tezosNamespaces.events);
      }
      this.validateAccounts(scope.networks, tezosNamespaces.accounts);
    } else {
      this.clearState();
      throw new InvalidReceivedSessionNamespace(
        'The wallet does not support tezos',
        getSdkError('USER_REJECTED').code,
        'incomplete',
        'tezos'
      );
    }
  }

  private validateMethods(requiredMethods: string[], receivedMethods: string[]) {
    const missingMethods: string[] = [];
    requiredMethods.forEach((method) => {
      // Todo: Question: Are methods case sensitive? Is this the right way to lookup?
      if (!receivedMethods.includes(method)) {
        missingMethods.push(method);
      }
    });
    if (missingMethods.length > 0) {
      this.clearState();
      throw new InvalidReceivedSessionNamespace(
        `The wallet does not support some of the required methods`,
        getSdkError('USER_REJECTED_METHODS').code,
        'incomplete',
        missingMethods
      );
    }
  }

  private validateEvents(requiredEvents: string[], receivedEvents: string[]) {
    const missingEvents: string[] = [];
    requiredEvents.forEach((method) => {
      // Todo: Question: Are events case sensitive? Is this the right way to lookup?
      if (!receivedEvents.includes(method)) {
        missingEvents.push(method);
      }
    });
    if (missingEvents.length > 0) {
      this.clearState();
      throw new InvalidReceivedSessionNamespace(
        `The wallet does not support some of the required events`,
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
    const invalidAccounts: string[] = [];
    const missingChains: string[] = [];
    const invalidChainsNamespace: string[] = [];

    receivedAccounts.forEach((account) => {
      const accountParts = account.split(':');
      if (accountParts.length !== 3) {
        invalidAccounts.push(account);
      }
      if (accountParts[0] !== TEZOS_PLACEHOLDER) {
        invalidChainsNamespace.push(account);
        return;
      }
      const network = accountParts[1];
      if (!receivedChains.includes(network)) {
        receivedChains.push(network);
      }
    });

    if (invalidAccounts.length > 0) {
      this.clearState();
      throw new InvalidReceivedSessionNamespace(
        `Accounts must be CAIP-10 compliant`,
        getSdkError('USER_REJECTED_CHAINS').code,
        'invalid',
        invalidAccounts
      );
    }

    if (invalidChainsNamespace.length > 0) {
      this.clearState();
      throw new InvalidReceivedSessionNamespace(
        `Tezos accounts should be prefixed with "tezos:", but we got some invalid accounts`,
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
        `All networks must have at least one account`,
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
      throw new InvalidSession('Namespaces does not have a field named "tezos"');
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

  private getPermittedNetworks() {
    const networks = this.getTezosRequiredNamespace().chains?.map((chain) => chain.split(':')[1]);
    const uniqueNetworks = [...new Set(networks)];
    return uniqueNetworks;
  }

  private formatAndRemoveDefaultLimits<ParamType extends WalletTransferParams | WalletOriginateParams | WalletDelegateParams | WalletIncreasePaidStorageParams>(
    params: ParamType,
    operatedParams: Omit<Partial<ParamType>, 'fee' | 'storageLimit' | 'gasLimit' | 'amount'> & {fee: number | undefined; storage_limit: number | undefined; gas_limit: number | undefined; amount?: number | string | undefined; }
  ) {
    type ReturnedType = Omit<Partial<ParamType>, 'fee' | 'storageLimit' | 'gasLimit' | 'amount'> & {
      fee: string | undefined;
      storage_limit: string | undefined;
      gas_limit: string | undefined;
      amount: string | undefined;
    };

    const formatedParams: ReturnedType = {
      ...operatedParams,
      fee: operatedParams.fee?.toString(),
      storage_limit: operatedParams.storage_limit?.toString(),
      gas_limit: operatedParams.gas_limit?.toString(),
      amount: operatedParams.amount?.toString(),
    };

    if (typeof params.fee === 'undefined') {
      delete formatedParams.fee;
    }
    if (typeof params.storageLimit === 'undefined') {
      delete formatedParams.storage_limit;
    }
    if (typeof params.gasLimit === 'undefined') {
      delete formatedParams.gas_limit;
    }
    return formatedParams;
  }

  async mapTransferParamsToWalletParams(params: () => Promise<WalletTransferParams>) {
    const walletParams: WalletTransferParams = await params();
    return this.formatAndRemoveDefaultLimits(
      walletParams,
      await createTransferOperation(walletParams)
    );
  }

  async mapIncreasePaidStorageWalletParams(params: () => Promise<WalletIncreasePaidStorageParams>) {
    const walletParams: WalletIncreasePaidStorageParams = await params();

    return this.formatAndRemoveDefaultLimits(
      walletParams,
      await createIncreasePaidStorageOperation(walletParams)
    );
  }

  async mapOriginateParamsToWalletParams(params: () => Promise<WalletOriginateParams>) {
    const walletParams: WalletOriginateParams = await params();

    return this.formatAndRemoveDefaultLimits(
      walletParams,
      await createOriginationOperation(walletParams)
    );
  }

  async mapDelegateParamsToWalletParams(params: () => Promise<WalletDelegateParams>) {
    const walletParams: WalletDelegateParams = await params();

    return this.formatAndRemoveDefaultLimits(
      walletParams,
      await createSetDelegateOperation(walletParams)
    );
  }
}

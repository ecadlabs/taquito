/**
 * @packageDocumentation
 * @module @taquito/wallet-connect-2
 */

import Client from '@walletconnect/sign-client';
import { SignClientTypes, SessionTypes, PairingTypes } from '@walletconnect/types';
import QRCodeModal from '@walletconnect/qrcode-modal';
import {
    createOriginationOperation,
    createSetDelegateOperation,
    createTransferOperation,
    WalletDelegateParams,
    WalletOriginateParams,
    WalletProvider,
    WalletTransferParams,
} from '@taquito/taquito';
import { getSdkError } from '@walletconnect/utils';
import { PermissionScopeEvents, PermissionScopeMethods, PermissionScopeParam, SigningType } from './types';
import {
    ActiveAccountUnspecified,
  ConnectionFailed,
    //ConnectionFailed,
    InvalidAccount,
    InvalidSessionKey,
    MissingRequiredScope,
    NotConnected,
} from './errors';

export { SignClientTypes, PairingTypes };
export * from './errors';
export * from './types';

export class WalletConnect2 implements WalletProvider {
    public signClient: Client;
    private session: SessionTypes.Struct | undefined;
    private activeAccount: string | undefined;

    constructor(signClient: Client) {
        this.signClient = signClient;
        this.signClient.on("session_delete", ({ id, topic }) => {
            console.log("session_delete in taquito", id, topic);
            console.log('this.session', this.session)
            if (this.session?.topic === topic) {

                this.session = undefined;
            }
        });

        this.signClient.on("proposal_expire", ({ id }) => {
            console.log("Proposal expired in taquito", id);
        });
        this.signClient.on("session_update", ({ id, params, topic }) => {
            console.log("session_update in taquito", id, params, topic);
        });
        this.signClient.on("session_proposal", ({ id, params }) => {
            console.log("session_proposal in taquito", id, params);
        });
        this.signClient.on("session_extend", ({ id, topic }) => {
            console.log("session_extend in taquito", id, topic);
        });
        this.signClient.on("session_ping", ({ id, topic }) => {
            console.log("session_ping in taquito", id, topic);
        });
        this.signClient.on("session_expire", ({ topic }) => {
            console.log("session_expire in taquito", topic);
        });
        this.signClient.on("session_request", ({ id, params, topic }) => {
            console.log("session_request in taquito", id, params, topic);
        });
        this.signClient.on("session_event", ({ id, params, topic }) => {
            console.log("session_event in taquito", id, params, topic);
        });
    }

    /**
     * @description Initialise a WalletConnect2 provider
     * @example
     * ```
     * WalletConnect2.init({
     *  relayUrl: "wss://relay.walletconnect.com",
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
    static async init(options: SignClientTypes.Options) {
        const client = await Client.init(options);
        return new WalletConnect2(client);
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
        const activeAccount = this.getAccounts();
        if (activeAccount.length === 1) {
            this.activeAccount = activeAccount[0];
        }
    }

    /**
     * @description Request permission for a new session.
     * If no pairingTopic, a QR code modal will open, allowing to connect to a wallet.
     * If pairingTopic is defined, a prompt will appear in the corresponding to accept or decline the session proposal.
     * @param scope The networks, methods, and events that will be granted permission
     * @param pairingTopic Option to connect to an existing active pairing
     * @error ConnectionFailed is thrown if no connection can be established
     */
    async requestPermissions(scope: PermissionScopeParam, pairingTopic?: string) {
        try {
            const { uri, approval } = await this.signClient.connect({
                requiredNamespaces: {
                    tezos: {
                        chains: scope.networks.map((network) => `tezos:${network}`),
                        methods: scope.methods as unknown as string[],
                        events: [PermissionScopeEvents.ACCOUNTS_CHANGED, PermissionScopeEvents.CHAIN_CHANGED]
                    },
                },
                pairingTopic,
            });

            if (uri) {
                QRCodeModal.open(uri, () => {
                    // noop
                });
            }
            this.session = await approval();
            const activeAccount = this.getAccounts();
            if (activeAccount.length === 1) {
                this.activeAccount = activeAccount[0];
            }
        } catch (error) {
            throw new ConnectionFailed(error);
        } finally {
            QRCodeModal.close();
        }
    }

    async disconnect() {
        if (this.session) {
            await this.signClient.disconnect({
                topic: this.session.topic,
                reason: getSdkError('USER_DISCONNECTED'),
            });
            this.deleteAll();
        }
    }

    getPeerMetadata() {
        return this.getSession().peer.metadata;
    }

    /**
     * @description Once the session is establish, send Tezos operations to be approved, signed and inject by the wallet.
     * @error MissingRequiredScope is thrown if permission to send operation was not granted
     */
    async sendOperations(params: any[]) {
        const session = this.getSession();
        if (!this.getPermittedMethods().includes(PermissionScopeMethods.OPERATION_REQUEST)) {
            throw new MissingRequiredScope(PermissionScopeMethods.OPERATION_REQUEST);
        }
        const hash = await this.signClient.request<string>({
            topic: session.topic,
            chainId: this.getTezosRequiredNamespace().chains[0], //TODO
            request: {
                method: PermissionScopeMethods.OPERATION_REQUEST,
                params: {
                    account: await this.getPKH(),
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
        const signature = await this.signClient.request<string>({
            topic: session.topic,
            chainId: this.getTezosRequiredNamespace().chains[0], //TODO
            request: {
                method: PermissionScopeMethods.SIGN,
                params: {
                    account: params.sourceAddress ?? (await this.getPKH()),
                    expression: params.payload,
                    signingType: params.signingType,
                },
            },
        });
        return signature;
    }

    /**
     * @description Access the public key hash of the active account
     * @error ActiveAccountUnspecified thorwn when there are multiple Tezos account in the session and none is set as the active one
     */
    async getPKH() {
        if (!this.activeAccount) {
            throw new ActiveAccountUnspecified();
        }
        return this.activeAccount;
    }

    /**
     * @description Set the active account.
     * Must be called by if there are multiple accounts in the session and every time the active account is switched
     * @param pkh public key hash of the selected account
     * @error InvalidAccount thrown if the pkh is not part of the active account in the session
     */
    setActiveAccount(pkh: string) {
        if (!this.getAccounts().includes(pkh)) {
            throw new InvalidAccount('Invalid account');
        }
        this.activeAccount = pkh;
    }

    /**
     * @description Return all connected accounts from the active session
     * @error NotConnected if no active session
     */
    getAccounts() {
        return this.getTezosNamespace().accounts.map((account) => account.split(':')[2]);
    }

    private deleteAll() {
        this.session = undefined;
        this.activeAccount = undefined;
    }

    private getSession() {
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

    private getTezosNamespace(): {
        accounts: string[];
        methods: string[];
        events: string[];
    } {
        if (Object.prototype.hasOwnProperty.call(this.getSession().namespaces, 'tezos')) {
            return this.getSession().namespaces['tezos'];
        } else {
            throw new Error('invalid session, tezos namespace not found');
        }
    }

    private getTezosRequiredNamespace(): {
        chains: string[];
        methods: string[];
        events: string[];
    } {
        if (Object.prototype.hasOwnProperty.call(this.getSession().requiredNamespaces, 'tezos')) {
            return this.getSession().requiredNamespaces['tezos'];
        } else {
            throw new Error('invalid session, tezos requiredNamespaces not found');
        }
    }

    private getPermittedMethods() {
        return this.getTezosRequiredNamespace().methods;
    }

    private getPermittedEvents() {
        return this.getTezosRequiredNamespace().events;
    }

    private getPermittedNetwork() {
        return this.getTezosRequiredNamespace().chains.map((chain) => chain.split(':')[1]);
    }

    private formatParameters(params: any) {
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

    private removeDefaultParams(
        params: WalletTransferParams | WalletOriginateParams | WalletDelegateParams,
        operatedParams: any
    ) {
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

    async mapTransferParamsToWalletParams(params: () => Promise<WalletTransferParams>) {
        const walletParams: WalletTransferParams = await params();

        return this.removeDefaultParams(
            walletParams,
            await createTransferOperation(this.formatParameters(walletParams))
        );
    }

    async mapOriginateParamsToWalletParams(params: () => Promise<WalletOriginateParams>) {
        const walletParams: WalletOriginateParams = await params();
        return this.removeDefaultParams(
            walletParams,
            await createOriginationOperation(this.formatParameters(walletParams))
        );
    }

    async mapDelegateParamsToWalletParams(params: () => Promise<WalletDelegateParams>) {
        const walletParams: WalletDelegateParams = await params();

        return this.removeDefaultParams(
            walletParams,
            await createSetDelegateOperation(this.formatParameters(walletParams))
        );
    }
}

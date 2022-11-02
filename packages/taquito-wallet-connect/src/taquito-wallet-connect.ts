/**
 * @packageDocumentation
 * @module @taquito/wallet-connect
 */

import Client from '@walletconnect/sign-client';
import { SignClientTypes, ProposalTypes, SessionTypes, RelayerTypes } from '@walletconnect/types';
import QRCodeModal from '@walletconnect/qrcode-modal';
import { createOriginationOperation, createSetDelegateOperation, createTransferOperation, WalletDelegateParams, WalletOriginateParams, WalletProvider, WalletTransferParams } from '@taquito/taquito';
import { getSdkError } from "@walletconnect/utils";

export declare enum SigningType {
    RAW = "raw",
    OPERATION = "operation",
    MICHELINE = "micheline"
}
export class WalletConnect2 implements WalletProvider {
    public client: Client;
    private session: SessionTypes.Struct | undefined;
    private activeAccount: string | undefined;

    constructor(client: Client) {
        this.client = client;
    }

    static async init(options: SignClientTypes.Options) {
        const client = await Client.init(options);
        return new WalletConnect2(client);
    }

    getAvailablePairing() {
        return this.client.pairing.getAll({ active: true });
    }

    getAllExistingSessionKeys() {
        return this.client.session.keys;
    }

    /**
     * @description Configure the Client with an existing session
     */
    configureWithExistingSessionKey(key: string) {
        const sessions = this.getAllExistingSessionKeys();
        if (!sessions.includes(key)) {
            throw new Error(`Invalid session key ${key}`)
        }
        this.session = this.client.session.get(key);
        const activeAccount = this.getAccounts();
            if(activeAccount.length === 1){
                this.activeAccount = activeAccount[0];
            }
    }

    /**
     * @description Configure the Client with a new session
     */
    async requestPermissions(scope: {
        requiredNamespaces: ProposalTypes.RequiredNamespaces;
        pairingTopic?: string;
        relays?: RelayerTypes.ProtocolOptions[];
    }) {
        try {
            const { uri, approval } = await this.client.connect(scope);

            if (uri) {
                // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
                QRCodeModal.open(uri, () => {
                    console.log('EVENT', 'QR Code Modal closed');
                });
            }
            this.session = await approval();
            console.log('Established session:', this.session);
            const activeAccount = this.getAccounts();
            if(activeAccount.length === 1){
                this.activeAccount = activeAccount[0];
            }
        } catch (e) {
            console.log(e);
        } finally {
            QRCodeModal.close();
        }
    }

    async disconnect() {
        if (this.session) {
            await this.client.disconnect({
                topic: this.session.topic,
                reason: getSdkError("USER_DISCONNECTED"),
            });
            this.deleteAll();
        }
    }

    private deleteAll(){
        this.session = undefined;
        this.activeAccount = undefined;
    }

    getPeerMetadata() {
        return this.getSession().peer.metadata;
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
        const session = this.getSession()
        const hash = await this.client.request<string>({
            topic: session.topic,
            chainId: session.requiredNamespaces['tezos'].chains[0],
            request: {
                method: 'tezos_sendOperations',
                params: {
                    account: await this.getPKH(),
                    operations: params,
                },
            },
        });
        return hash;
    }

    async signPayload(params: {
        signingType?: SigningType;
        payload: string;
        sourceAddress?: string;
    }) {
        const session = this.getSession()
        const signature = await this.client.request<string>({
            topic: session.topic,
            chainId: session.requiredNamespaces['tezos'].chains[0],
            request: {
                method: 'tezos_signExpression',
                params: {
                    account: params.sourceAddress ?? await this.getPKH(),
                    expression: params.payload,
                    signingType: params.signingType
                },
            },
        });
        return signature;
    }

    async getPKH() {
        if(!this.activeAccount){
            throw new Error('Please specify the active account using the "setActiveAccount" method.')
        }
        return this.activeAccount;
    }

    /**
     * @description Must be called by the dapp every time the user select or switch account
     * @param pkh public key hash of the selected account
     * @error if the pkh is not part of the active account in the session
     */
    setActiveAccount(pkh: string) {
        if(!this.getAccounts().includes(pkh)){
            throw new Error('Invalid account');
        }
        this.activeAccount = pkh;
    }

    /**
     * @description Return all connected accounts from the active session
     * @error if no active session
     */
    getAccounts(){
        return this.getSession().namespaces['tezos'].accounts.map(account => account.split(':')[2]);
    }

    private getSession(){
        if (!this.session) {
            throw new Error('Not connected')
        }
        return this.session;
    }
}

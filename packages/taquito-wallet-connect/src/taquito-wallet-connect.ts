/**
 * @packageDocumentation
 * @module @taquito/wallet-connect
 */

import Client from '@walletconnect/sign-client';
import { SignClientTypes, ProposalTypes, SessionTypes } from '@walletconnect/types';
import QRCodeModal from '@walletconnect/qrcode-modal';
import { createOriginationOperation, createSetDelegateOperation, createTransferOperation, WalletDelegateParams, WalletOriginateParams, WalletProvider, WalletTransferParams } from '@taquito/taquito';

export class WalletConnect2 implements WalletProvider {
    public client: Client;
    private session: SessionTypes.Struct | undefined;

    constructor(client: Client) {
        this.client = client;
    }

    static async init(options: SignClientTypes.Options) {
        const client = await Client.init(options);
        return new WalletConnect2(client);
    }

    async requestPermissions(scope: {
        pairingTopic?: string;
        requiredNamespaces: ProposalTypes.RequiredNamespaces;
    }) {
        try {
            console.log('Requesting permission...');
            const { uri, approval } = await this.client.connect(scope);

            if (uri) {
                QRCodeModal.open(uri, () => {
                    console.log('EVENT', 'QR Code Modal closed');
                });
            }
            this.session = await approval();
            console.log('Established session:', this.session);
        } catch (e) {
            console.log(e);
        } finally {
            QRCodeModal.close();
        }
    }

    async signPayload(payload: string) {
        const topic = this.session?.topic ?? '';
        const response = await this.client.request<string>({
            topic,
            chainId: this.session?.requiredNamespaces['tezos'].chains[0] ?? '',
            request: {
                method: 'tezos_signMessage',
                params: {
                    address: await this.getPKH(),
                    expression: payload,
                },
            },
        });
        return response;
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
        const topic = this.session?.topic ?? '';
        const response = await this.client.request<string>({
            topic,
            chainId: this.session?.requiredNamespaces['tezos'].chains[0] ?? '',
            request: {
                method: 'tezos_sendOperations',
                params: {
                    account: await this.getPKH(),
                    operations: params,
                },
            },
        });
        return response;
    }

    async getPKH() {
        return this.session?.namespaces['tezos'].accounts[0].split(':')[2] ?? '';
    }
}

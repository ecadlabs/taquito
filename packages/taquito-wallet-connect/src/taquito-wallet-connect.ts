/**
 * @packageDocumentation
 * @module @taquito/wallet-connect
 */

import Client from '@walletconnect/sign-client';
import { SignClientTypes, ProposalTypes, SessionTypes } from '@walletconnect/types';
import QRCodeModal from '@walletconnect/qrcode-modal';

export class WalletConnect2 {
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
/* import { WalletDelegateParams, WalletOriginateParams, WalletProvider, WalletTransferParams } from '@taquito/taquito';
import Client from "@walletconnect/sign-client";
import { SignClientTypes, ProposalTypes, SessionTypes } from "@walletconnect/types";

export class WalletConnect2 implements WalletProvider {
    public client: Client;
    private session: SessionTypes.Struct | undefined;

    constructor(client: Client) {
        this.client = client;
    }

    static async init(options: SignClientTypes.Options) {
        const client = await Client.init(options);
        return new WalletConnect2(client)
    }

    async requestPermissions(scope: {
        pairingTopic?: string,
        requiredNamespaces: ProposalTypes.RequiredNamespaces,
    }) {
        const { approval } = await this.client.connect(scope);
        this.session = await approval();
    }

    async signPayload(payload: string) {
        const topic = this.session?.topic?? '';
        const response = await this.client.request<string>({
            topic,
            chainId: '',
            request: {
                method: 'tezos_operationRequest',
                params: {
                    address: await this.getPKH(),
                    message: payload
                },
            },
        })
        return response;
    }

    getActiveAccount() {
        return this.client.pairing.getAll({ active: true })
    }

    async sendOperations(params: any[]) {
        const response = await this.client.request<string>({
            topic: '',
            chainId: '',
            request: {
                method: 'tezos_operationRequest',
                params,
            },
        })
        return response;
    }

    async getPKH() {
        return ''
    }
    async mapTransferParamsToWalletParams(_params: () => Promise<WalletTransferParams>) {
        return {}
    }

    async mapOriginateParamsToWalletParams(_params: () => Promise<WalletOriginateParams>) {
        return {}
    }

    async mapDelegateParamsToWalletParams(_params: () => Promise<WalletDelegateParams>) {
        return {}
    }

} */

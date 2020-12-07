import { Context, ContractAbstraction, ContractProvider, Wallet } from '@taquito/taquito';
import { bytes2Char } from './tzip16-utils';
import { MetadataProviderInterface, MetadataEnvelope } from './interfaceMetadataProvider';
import { MetadataNotFound, UriNotFound } from './tzip16Errors';
import { HttpBackend } from '@taquito/http-utils';

export type MetadataContext = Context & { metadataProvider: MetadataProviderInterface, metadataHttpBackEnd: HttpBackend };
export class Tzip16ContractAbstraction {
    private _fetcher: MetadataProviderInterface;

    constructor(
        private constractAbstraction: ContractAbstraction<ContractProvider | Wallet>,
        private context: MetadataContext
    ) { 
        this._fetcher = context.metadataProvider;
    }

    private async getUriOrFail(): Promise<string> {
        const storage: Storage = await this.constractAbstraction.storage();
        let metadataField;
        let uri;
        if (storage.metadata) {
            metadataField = storage.metadata;
        } else {
            throw new MetadataNotFound();
        }
        try {
            uri = await metadataField.get('');
        } catch (err) {
            throw new UriNotFound();
        }
        return uri;
    }

    /**
     * @description Return an object containing the metadata, the uri, an optional integrity check result and an optional sha256 hash
     * 
     */
    async getMetadata(): Promise<MetadataEnvelope> {
        const uri = await this.getUriOrFail();
        const metadata = await this._fetcher.provideMetadata(this.constractAbstraction, bytes2Char(uri), this.context);
        return metadata;
    }
}

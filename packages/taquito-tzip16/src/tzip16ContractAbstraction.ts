import { ContractAbstraction, ContractProvider, Wallet } from '@taquito/taquito';
import { bytes2Char } from './tzip16-utils';
import { FetcherProvider } from './fetcherProvider';
import { MetadataEnvelope } from './interfaceFetcherProvider';
import { MetadataNotFound, UriNotFound } from './tzip16Errors';

// TODO
/* export class MetadataView {
    constructor() { }

    async execute() { }
} */

export class Tzip16ContractAbstraction {

    constructor(
        private constractAbstraction: ContractAbstraction<ContractProvider | Wallet>,
        private fetcher: FetcherProvider = new FetcherProvider()
    ) { }

    // TODO
    // public metadataViews: { [key: string]: (...args: any[]) => MetadataView } = {};

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
        const metadata = await this.fetcher.fetchMetadata(this.constractAbstraction, bytes2Char(uri));
        return metadata;
    }
}

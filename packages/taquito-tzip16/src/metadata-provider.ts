import { ContractAbstraction, ContractProvider, Wallet, Context } from '@taquito/taquito';
import { MetadataInterface } from './metadata-interface';
import { MetadataContext } from './tzip16-contract-abstraction';
import { InvalidMetadata, InvalidUri, ProtocolNotSupported } from './tzip16-errors';
import { calculateSHA256Hash } from './tzip16-utils';

export interface MetadataProviderInterface {
    provideMetadata(contractAbstraction: ContractAbstraction<ContractProvider | Wallet>, uri: string, context: MetadataContext): Promise<MetadataEnvelope>;
}

export interface MetadataEnvelope {
    uri: string;
    integrityCheckResult?: boolean;
    sha256Hash?: string;
    metadata: MetadataInterface;
}
export interface Handler {
    getMetadata(
        contractAbstraction: ContractAbstraction<ContractProvider | Wallet>,
        uri: Tzip16Uri,
        context: Context
    ): Promise<string>
}

export interface Tzip16Uri {
    sha256hash: string | undefined;
    protocol: string;
    location: string;
}

/**
 * @description: Metadata Provider
 */
export class MetadataProvider implements MetadataProviderInterface {
    private readonly PROTOCOL_REGEX = /(?:sha256\:\/\/0x(.*)\/)?(https?|ipfs|tezos-storage)\:(.*)/;

    constructor(private handlers: Map<string, Handler>) {}

    /**
     * @description Fetch the metadata by using the appropriate handler based on the protcol found in the URI
     * @returns an object which contains the uri, the metadata, an optional integrity check result and an optional SHA256 hash
     * @param _contractAbstraction the contract abstraction which contains the URI in its storage
     * @param _uri the decoded uri found in the storage
     * @param context the TezosToolkit Context
     */
    async provideMetadata(contractAbstraction: ContractAbstraction<ContractProvider | Wallet>, uri: string, context: Context): Promise<MetadataEnvelope> {

        const uriInfo = this.extractProtocolInfo(uri);
        if (!uriInfo || !uriInfo.location) {
            throw new InvalidUri(uri);
        }

        const handler = this.handlers.get(uriInfo.protocol);
        if (!handler) {
            throw new ProtocolNotSupported(uriInfo.protocol);
        }

        const metadata = await handler.getMetadata(contractAbstraction, uriInfo, context);
        const sha256Hash = calculateSHA256Hash(metadata);
        let metadataJSON;
        try {
            metadataJSON = JSON.parse(metadata);
        } catch (ex) {
            throw new InvalidMetadata(metadata);
        }

        return {
            uri,
            metadata: metadataJSON,
            integrityCheckResult: uriInfo.sha256hash ? uriInfo.sha256hash === sha256Hash : undefined,
            sha256Hash: uriInfo.sha256hash ? sha256Hash : undefined
        }
    }

    private extractProtocolInfo(_uri: string) {
        const extractor = this.PROTOCOL_REGEX.exec(_uri);
        if (!extractor) return;
        return {
            sha256hash: extractor[1],
            protocol: extractor[2],
            location: extractor[3]
        }
    }
}

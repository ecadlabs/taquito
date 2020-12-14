import { ContractAbstraction, ContractProvider, Wallet, TezosToolkit, Context } from "@taquito/taquito";
import { MetadataProviderInterface, MetadataEnvelope } from "./interfaceMetadataProvider";
import { HTTPFetcher } from "./URIHandlers/httpHandler";
import { StorageFetcher } from "./URIHandlers/storageHandler";
import { Validator } from "../src/URIHandlers/validator";

/**
 * @description: Metadata Provider
 */
export class MetadataProvider implements MetadataProviderInterface {
    httpHandler: HTTPFetcher;
    storageHandler: StorageFetcher;
    validator: Validator;

    constructor() {
        this.httpHandler = new HTTPFetcher();
        this.storageHandler = new StorageFetcher();
        this.validator = new Validator();
    }

    /**
     * Provides metadata at the specified uri as per TZIP16 specification.
     * @param _contractAbstraction A Tezos Contract Abstraction containing metadata in its storage
     * @param _uri A URI to fetch metadata from
     * @param context Tezos Toolkit User Context
     */
    async provideMetadata(_contractAbstraction: ContractAbstraction<ContractProvider | Wallet>, _uri: string, context: Context): Promise<MetadataEnvelope> {

        await this.validator.prevalidate(_contractAbstraction);

        let metadataEnvelope: MetadataEnvelope = {
            uri: _uri,
            metadata: JSON.parse("{}"),
            integrityCheckResult: false,
            sha256Hash: undefined
        };

        const _uriInfo = this.getProtocolInfo(_uri);

        switch (_uriInfo.protocol) {
            case 'http':
            case 'https':
                try {
                    if (this.validator.isValidUrl(_uriInfo.path)) {
                        metadataEnvelope.metadata = await this.httpHandler.getMetadataHTTP(_uri)
                    }
                } catch (err) {
                    throw new Error("Problem using HTTPHandler." + err);
                }
                break;
            case 'tezos-storage':
                if (_uriInfo.host) {
                    const _contract = await context.contract.at(_uriInfo.host);
                    metadataEnvelope.metadata = await this.storageHandler.getMetadataStorage(_contract, _uriInfo.path)
                } else {
                    metadataEnvelope.metadata = await this.storageHandler.getMetadataStorage(_contractAbstraction, _uriInfo.path);
                }
                break;
            case 'sha256':
                const _validation = await this.validator.validateSHA256(_uriInfo.path);
                metadataEnvelope.sha256Hash = _validation.metadataHash
                metadataEnvelope.metadata = _validation.metadata
                metadataEnvelope.integrityCheckResult = _validation.integrityResult;
                break;
        }

        await this.validator.postvalidate(metadataEnvelope.metadata);

        return metadataEnvelope;
    }

    /**
     * Returns protocol & resolved path for a uri, 
     * @param _uri a URI for locating metadata
     */
    private getProtocolInfo(_uri: string): {
        protocol: string,
        host: string | undefined,
        network: string | undefined,
        path: string
    } {
        let _path = _uri;
        let _host = undefined;
        let _network = undefined;

        const expectedProtocol = _uri.split(':')[0];
        switch (expectedProtocol) {
            case 'tezos-storage':
                const _info = this.validator.validateTezosStorage(_uri);
                _path = _info.path;
                _host = _info.host;
                _network = _info.network;
                break;
            // case 'sha256':
            // const _infoSHA = this.validator.validateSHA256(_uri);
        }
        return { protocol: expectedProtocol, host: _host, network: _network, path: _path }
    }

}
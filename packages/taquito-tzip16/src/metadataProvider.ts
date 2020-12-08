import { ContractAbstraction, ContractProvider, Wallet, TezosToolkit, Context } from "@taquito/taquito";
import { MetadataProviderInterface, MetadataEnvelope } from "./interfaceMetadataProvider";
import { HTTPFetcher } from "./URIHandlers/httpHandler";
import { StorageFetcher } from "./URIHandlers/storageHandler";
import { Validator } from "../src/URIHandlers/validator";

export class MetadataProvider implements MetadataProviderInterface {
    httpHandler: HTTPFetcher;
    storageHandler: StorageFetcher;
    validator: Validator;

    constructor() {
        this.httpHandler = new HTTPFetcher();
        this.storageHandler = new StorageFetcher();
        this.validator = new Validator();
    }
    async provideMetadata(_contractAbstraction: ContractAbstraction<ContractProvider | Wallet>, _uri: string, context: Context): Promise<MetadataEnvelope> {
        // tslint:disable-next-line: strict-type-predicates
        if (typeof _contractAbstraction !== 'undefined') {
            console.log(typeof (_contractAbstraction.address))
            const contractAddress: string = _contractAbstraction.address;
        }
        else throw new Error("No contract was passed to the fetcher.");


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
                    metadataEnvelope.metadata = await this.httpHandler.getMetadataHTTP(_uri)
                } catch (error) {
                    throw new Error("Problem using HTTPHandler." + error);
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
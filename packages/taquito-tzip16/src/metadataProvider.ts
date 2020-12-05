import { ContractAbstraction, ContractProvider, Wallet } from "@taquito/taquito";
import { MetadataProviderInterface, MetadataEnvelope, RequestOptions } from "./interfaceMetadataProvider";
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
    async provideMetadata(_contractAbstraction: ContractAbstraction<ContractProvider | Wallet>, _uri: string, options?: RequestOptions): Promise<MetadataEnvelope> {
        console.log(options);
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
            // sha256Hash: ""
        };

        const _uriInfo = this.extractProtocol(_uri);

        switch (_uriInfo.protocol) {
            case 'http':
            case 'https':
                try {
                    metadataEnvelope.metadata = await this.httpHandler.getMetadataHTTP(_uri, options)
                } catch (error) {
                    throw new Error("Problem using HTTPHandler." + error);
                }
                break;
            case 'tezos-storage':
                metadataEnvelope.metadata = await this.storageHandler.getMetadataStorage(_contractAbstraction, _uriInfo.path);
        }

        return metadataEnvelope;
    }

    /**
     * Returns protocol & resolved path for a uri, 
     * returns empty string("") if protocol is invalid
     * @param _uri a URI for locating metadata
     */
    private extractProtocol(_uri: string): { protocol: string, path: string } {
        const expectedProtocol = _uri.split(':')[0];
        switch (expectedProtocol) {
            case 'sha256':
                const validation = this.validator.validateTezosStorage(_uri)
                break;
            case 'tezos-storage':
                break;
        }
        return { protocol: expectedProtocol, path: _uri }
    }


}
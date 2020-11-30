import { ContractAbstraction, ContractProvider, MichelsonMap, Wallet } from "@taquito/taquito";
import { HttpBackend } from "@taquito/http-utils";

interface MetadataEnvelope {
    uri: string;
    integrityCheckResult?: boolean;
    sha256Hash?: string;
    metadata: JSON
}

export interface FetcherProviderInterface {
    /**
     *
     * @description Fetch the metadata. The uri parameter contains the required information to locate metadata contents (http/https, ipfs, tezos-storage).
     *
     * @returns An object representing the metadata
     *
     * @param contractAbstraction the contractAbstraction of the current contract (useful if metadata are located inside its own storage)
     * @param uri the decoded uri
     */
    fetchMetadata(contractAbstraction: ContractAbstraction<ContractProvider | Wallet>, uri: string): Promise<MetadataEnvelope>;
}



export class FetcherProvider implements FetcherProviderInterface {
    constructor(
        private httpBackend: HttpBackend = new HttpBackend()
    ) { }

    async fetchMetadata(contractAbstraction: ContractAbstraction<ContractProvider | Wallet>, uri: string): Promise<MetadataEnvelope> {
        // tslint:disable-next-line: one-variable-per-declaration
        let _storage: Storage, metadata, defaultURI;
        try { _storage = await contractAbstraction.storage(); } catch (err) { throw err; }
        try { metadata = await _storage['metadata']; } catch (err) { throw err; }
        try { defaultURI = await metadata.get(""); } catch (err) { throw err; }
        
        if (!(uri.localeCompare(defaultURI))) {
            return { uri: defaultURI, metadata }
        } else {
            throw new Error("uri does not match metadata URI in contractAbstraction.");
        }
    }

}
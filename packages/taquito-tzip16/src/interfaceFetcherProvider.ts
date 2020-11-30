import { ContractAbstraction, ContractProvider, Wallet } from "@taquito/taquito";
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
    fetchMetadata(contractAbstraction: ContractAbstraction<ContractProvider | Wallet>, uri: String): Promise<MetadataEnvelope>;
}



export class FetcherProvider implements FetcherProviderInterface {
    private httpBackend: HttpBackend = new HttpBackend();

    async fetchMetadata(contractAbstraction: ContractAbstraction<ContractProvider | Wallet>, uri: String): Promise<MetadataEnvelope> {
        const storage: Storage = await contractAbstraction.storage();
        const hash = await this.httpBackend.createRequest<string>({
            url: uri.toString()
          });
          return JSON.parse(hash);
        // throw new Error("Method not implemented.");
    }
    
}
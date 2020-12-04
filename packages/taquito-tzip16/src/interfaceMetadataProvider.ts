import { ContractAbstraction, ContractProvider, Wallet } from "@taquito/taquito";

export interface RequestOptions {
    headers?: { [key: string]: string };
    mimeType?: string;
  }

export interface MetadataEnvelope {
    uri: string;
    integrityCheckResult?: boolean;
    sha256Hash?: string;
    metadata: JSON
}

export interface MetadataProviderInterface {
    /**
     *
     * @description Fetch the metadata. The uri parameter contains the required information to locate metadata contents (http/https, ipfs, tezos-storage).
     *
     * @returns An object representing the metadata
     *
     * @param contractAbstraction the contractAbstraction of the current contract (useful if metadata are located inside its own storage)
     * @param uri the decoded uri
     * @param options optional parameter allowing to specify headers for Http request
     */
    provideMetadata(contractAbstraction: ContractAbstraction<ContractProvider | Wallet>, uri: string, options?: RequestOptions): Promise<MetadataEnvelope>;
}

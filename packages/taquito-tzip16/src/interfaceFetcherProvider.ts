import { ContractAbstraction, ContractProvider, MichelsonMap, Wallet } from "@taquito/taquito";

export interface MetadataEnvelope {
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

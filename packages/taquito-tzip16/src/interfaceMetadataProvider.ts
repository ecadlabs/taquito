import { ContractAbstraction, ContractProvider, Wallet } from "@taquito/taquito";
import { MetadataInterface } from "./metadataInterface";
import { MetadataContext } from "./tzip16ContractAbstraction";

export interface MetadataEnvelope {
    uri: string;
    integrityCheckResult?: boolean;
    sha256Hash?: string;
    metadata: MetadataInterface;
}

export interface MetadataProviderInterface {
    /**
     *
     * @description Call a metadataProvider to fetch the metadata. The uri parameter contains the required information to locate metadata contents (http/https, ipfs, tezos-storage).
     *
     * @returns An object representing the uri, the metadata and an optional integrity check result
     *
     * @param contractAbstraction the contractAbstraction of the current contract (which contains the uri as the value of the empty string in its bigmap metadata)
     * @param uri the decoded uri
     * 
     */
    provideMetadata(contractAbstraction: ContractAbstraction<ContractProvider | Wallet>, uri: string, context: MetadataContext): Promise<MetadataEnvelope>;
}

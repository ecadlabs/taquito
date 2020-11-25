import { ContractAbstraction, ContractProvider, Wallet } from "@taquito/taquito";

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
    fetchMetadata(contractAbstraction: ContractAbstraction<ContractProvider | Wallet>, uri: String): Promise<{}>;
}

export class FetcherProvider implements FetcherProviderInterface {

    async fetchMetadata(contractAbstraction: ContractAbstraction<ContractProvider | Wallet>, uri: String): Promise<{}>{
        // TODO
        const testToBeRemoved: Storage = await contractAbstraction.storage(); // Remove that
        console.log(uri)
        return testToBeRemoved;// Remove that
    };
}


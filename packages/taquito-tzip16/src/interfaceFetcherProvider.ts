import { ContractAbstraction, ContractProvider, MichelsonMap, Wallet } from "@taquito/taquito";
import { HttpBackend } from "@taquito/http-utils";

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
    private httpBackend: HttpBackend = new HttpBackend();

    async fetchMetadata(_contractAbstraction: ContractAbstraction<ContractProvider | Wallet>, decodedUri: String): Promise<JSON> {
        // TODO: Extend Storage class
        // const expectedUri: string = Storage.metadata

        // const storage: Storage = await contractAbstraction.storage();
        // console.log("Storage length is :" + storage.metadata);

        let _response:string;
        try {
            _response = await this.httpBackend.createRequest<string>({
                url: decodedUri.toString()
            });
            console.log("res:"+_response.toString());
        } catch (ex) {
            throw new Error("FetcherProvider failed: " + ex);
        }
        return JSON.parse(_response);
    }

}
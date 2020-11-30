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
<<<<<<< HEAD
    fetchMetadata(contractAbstraction: ContractAbstraction<ContractProvider | Wallet>, uri: String): Promise<{}>;
=======
    fetchMetadata(contractAbstraction: ContractAbstraction<ContractProvider | Wallet>, uri: String): Promise<MetadataEnvelope>;
>>>>>>> b7e55346b5775af6dcde505b28b0722187ff1a8f
}



export class FetcherProvider implements FetcherProviderInterface {
    private httpBackend: HttpBackend = new HttpBackend();

<<<<<<< HEAD
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
=======
    async fetchMetadata(contractAbstraction: ContractAbstraction<ContractProvider | Wallet>, uri: String): Promise<MetadataEnvelope> {
        const storage: Storage = await contractAbstraction.storage();
        const hash = await this.httpBackend.createRequest<string>({
            url: uri.toString()
          });
          return JSON.parse(hash);
        // throw new Error("Method not implemented.");
>>>>>>> b7e55346b5775af6dcde505b28b0722187ff1a8f
    }

}
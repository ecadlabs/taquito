import { ContractAbstraction, ContractProvider, Wallet } from "@taquito/taquito";
import { bytes2Char } from "./utils";
import { FetcherProvider } from "./interfaceFetcherProvider"

// TODO
export class MetadataView {
    constructor(
    ) { }

    async execute() {
    }
}

export class Tzip16ContractAbstraction {
    private _uri: string | undefined;
    //private _fetcher = new FetcherProvider();

    constructor(
        private abs: ContractAbstraction<ContractProvider>, 
        private fetcher: FetcherProvider = new FetcherProvider()
        ) {}

    // TODO
    // public metadataViews: { [key: string]: (...args: any[]) => MetadataView } = {};

    /**
      * @description Verify if there is a bigmap metadata in the storage and an empty string key
      */
    private async isTzip16Compliant(): Promise<boolean> {
        const storage: Storage = await this.abs.storage();
        let isCompliant: boolean = true;
        let bigMapMetadata;
        if (storage.metadata) {
            bigMapMetadata = storage.metadata;
        } else {
            return false;
        }
        const uri = await bigMapMetadata.get('');
        if (uri) {
            this._uri = uri;
        } else {
            isCompliant = false;
        }
        console.log('isCompliant', isCompliant)
        return isCompliant;
    }

    /**
   * @description Return the decoded uri
   */
    async getUri(): Promise<string> {
        const isCompliant = await this.isTzip16Compliant();
        if (!isCompliant) {
            throw new Error("The contract is not compliant with tzip16 standard.");
        }
        console.log('this._uri', this._uri)
        return bytes2Char(this._uri!);
    }

    /**
   * @description Fetch and return the metadata
   */
    async getMetadata(): Promise<{}> {
        return this.fetcher.fetchMetadata(this.abs, await this.getUri());
    }
}
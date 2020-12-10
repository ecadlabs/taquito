import validate, { result } from "validate.js";
import CryptoJS from "crypto-js";
import { HTTPFetcher } from "./httpHandler";
import { StorageFetcher } from "./storageHandler";
import { ContractAbstraction, ContractProvider, Wallet } from "@taquito/taquito";
import { getStorage } from "../tzip16-utils";


export class Validator {
    httpHandler: HTTPFetcher;
    storageFetcher: StorageFetcher;

    constructor() {
        this.httpHandler = new HTTPFetcher();
        this.storageFetcher = new StorageFetcher();

    }

    isValidUrl(unknownURI: string): boolean {
        const _result = validate({ website: unknownURI }, {
            website: {
                url: {
                    schemes: ["http", "https"]
                }
            }
        });
        if (_result === undefined) {
            return true;
        } else {
            // TODO : error handling
            // throw new Error(JSON.stringify(_result));
            return false;
        }
    }

    validateTezosStorage(tezosStorageURI: string) {
        let host = undefined;
        let network = undefined;
        // remove suffix 'tezos-storage:'
        let path = tezosStorageURI.slice(14);

        // check if uri contains host & network info, and extract it
        const hostMarker = '//';
        if (path.substr(0, hostMarker.length) === hostMarker) {

            const infoArray = path.slice(2).split('/')

            // there must not be any other forward slash in key
            if (infoArray.length > 2) throw new Error("invalid key, slashes must be percent-encoded");
            // extract host & network info
            const info = infoArray[0].split('.')
            host = info[0];
            network = info[1];
            path = infoArray[1];
        }

        // there must not be any other forward slash in key
        if (path.includes('/')) throw new Error("Invalid key, slashes must be percent-encoded");

        // decode percent encoding if any
        path = decodeURI(path);

        // TODO validate network is a legal value 
        return { host, network, path };

    }

    async prevalidate(_contract: ContractAbstraction<ContractProvider | Wallet>): Promise<void> {
        if (_contract === undefined) {
            throw new Error("Empty contract abstraction.")
        }
        try {
            const _storage: Storage = await getStorage(_contract);
            const _metadata = await this.validateMetadataLevel(_storage);
            await this.validateMetadataType(_metadata);
        } catch (err) {
            throw new Error("Validation promise did not return.");
        }
        return;
    }

    async validateMetadataLevel(storage: Storage): Promise<any> {
        let metadata;
        try {
            metadata = await storage['metadata'];
        } catch (err) {
            throw new Error("Metadata bigmap does not exist in the top level of the storage tree.")
        }
        return metadata;
    }

    async validateMetadataType(_metadata: any): Promise<void> {
        const info = await _metadata.schema.root.val;
        if (info.prim !== 'big_map') {
            throw new Error("Metadata exists but is not of type big_map.")
        }
        if (info.args[0].prim !== 'string') {
            throw new Error("Metadata exists but its key not of type string.")
        }
        if (info.args[1].prim !== 'bytes') {
            throw new Error("Metadata exists but its key not of type bytes.")
        }
        return;
    }


    async validateSHA256(sha256uri: string) {
        const infoArray = sha256uri.slice(11).split('/');
        const _expectedHash = infoArray[0];
        const _encodedUri = infoArray[1];

        const metadataForHashing = await this.httpHandler.getMetadataNonJSON(decodeURIComponent(_encodedUri));
        const metadata = await this.httpHandler.getMetadataHTTP(decodeURIComponent(_encodedUri))

        let metadataHash: string = CryptoJS.SHA256(metadataForHashing.toString()).toString(CryptoJS.enc.Hex);

        let integrityResult: boolean = false;
        if (metadataHash.match(_expectedHash)) {
            integrityResult = true;
        }

        return { integrityResult, metadata, metadataHash }
    }

}
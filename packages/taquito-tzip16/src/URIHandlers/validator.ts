import validate, { result } from "validate.js";
import SHA256 from "crypto-js/sha256";
import { HTTPFetcher } from "./httpHandler";

export class Validator {
    httpHandler: HTTPFetcher;
    constructor() {
        this.httpHandler = new HTTPFetcher();
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

    async validateSHA256(sha256uri: string) {
        const infoArray = sha256uri.slice(11).split('/');
        const _expectedHash = infoArray[0];
        const _encodedUri = infoArray[1];

        const metadata: string = (await this.httpHandler.getMetadataHTTP(decodeURIComponent(_encodedUri))).toString();
        const metadataHash = SHA256(metadata).toString();

        let integrityResult: boolean = false;
        if (metadataHash.match(_expectedHash)) {
            integrityResult = true;
        }

        return { integrityResult, metadata, metadataHash }
    }

}
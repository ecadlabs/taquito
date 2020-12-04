import validate, { result } from "validate.js";

export class Validator {
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
            // console.error(JSON.stringify(_result));
            return false;
        }
    }

    validateTezosStorage(tezosStorageURI: string) {
        let host = '';
        let network = '';
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

        // TODO validate host is bs-encoded and network is a legal value 
        return { host, network, path };

    }
}
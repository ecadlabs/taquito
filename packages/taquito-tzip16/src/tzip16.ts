//import Ajv, { JSONSchemaType, DefinedError } from "ajv"
//import validate, { result } from "validate.js";
//import isIPFS from 'is-ipfs';

//import tzip16spec from "../assets/proposals_tzip-16_metadata-schema.json";

/** Metadata related artifacts:
 * metadataMichelsonType, // this is a type
 * metadataJSON, 
 * metadataSchema, 
 * metadataURI, 
 * metadataProperties,
 * metadataHostStorageCode,
 * metadataHostContractAddress,
 * metadataAssertFunctions
 */


//export class MetaDataManager {

    // 1. INSERT METADATA
    /**
     * 
     * @param metadataHostStorageCode Michelson code of the storage where %metadata is to be searched in top-level tree
     */
    /* isValidMetadataType(metadataHostStorageCode: string) {
        // check if metadata in StorageCode has metadata of type (big_map %metadata string bytes) // TODO
        // Note: There are other checks in tzip16 related to metadata shape; review storage implementation
        return;
    } */

    /**
     * Checks if a metadata matches a known schema
     * @param metadataJSON metadata whose schema needs to be checked
     * @param metadataSchema (optional) schema to be matched against
     */
    /* isValidMetadata(metadataJSON: JSON, metadataSchema?: JSON): boolean {
        // return if all reserved fields are valid
        // wrap error // TODO
        if (metadataSchema) {
            return this.validateSchemaWithData(metadataJSON, metadataSchema);
        } else {
            const _schema = JSON.parse(JSON.stringify(tzip16spec));
            _schema["$id"] = "http://json-schema.org/draft-04/schema#";
            return this.validateSchemaWithData(metadataJSON, _schema);
        }
    }
 */
    /**
     * Validates if a uri is one of the schemes in tzip16
     * @param metadataURI URI to be validated
     */
    /* isValidMetadataURI(metadataURI: string): boolean {
        return this.isUrl(metadataURI) ||
            this.isIPFSURIScheme(metadataURI) || // TODO
            this.isTezosStorageTypeURI(metadataURI);
    }
 */
    // 2. READ METADATA
    // 2.1 Parse to metadataProvider
    // ---

    // 3. UPDATE METADATA
    // 4. DELETE METADATA


    // UTILS
    /* private validateSchemaWithData(metadataJSON: JSON, metadataSchema: JSON): boolean {
        // use a library // TODO
        const ajv = new Ajv({ allErrors: true });
        const validationFunction = ajv.compile(metadataSchema);
        const validationResult = validationFunction(metadataJSON);
        if (!validationResult) { console.error(validationFunction.errors); } // TODO

        return validationResult;
    }

    private isUrl(unknownURI: string): boolean {
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
    } */

    // private getURIProtocol(uri: string) {
    //     const protocol = uri.split(':')[0];
    //     // ipfs cases start with '/'
    //     switch (uri.substr(0, 1)) {
    //         case '/':
    //             return uri.replace(':', '').split('/')[1]
    //         default:
    //             return protocol
    //     }

    // }

    // private getHttpUri(uri: string) {
    //     const protocol = this.getURIProtocol(uri)
    //     switch (protocol) {
    //         case 'http':
    //             // TODO: handle false positives
    //             break
    //         case 'https':
    //             break
    //         case 'ipfs':
    //             break
    //         case 'tezos-storage':
    //             break
    //         default:
    //             throw new Error(`Unrecognized protocol ${protocol}`)
    //     }

    //     return {
    //         protocol
    //     }
    // }

    /* private isIPFSURIScheme(unknownURI: string): boolean {
        const _result = isIPFS.url(unknownURI);
        if (_result) {
            return true;
        } else {
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

    private isTezosStorageTypeURI(unknownURI: string): boolean {
        function beginsWithStorageString(_unknownURI: string) {
            if (_unknownURI.startsWith('tezos-storage:')) {
                return true;
            } else return false;
        }
        if (beginsWithStorageString(unknownURI)) {
            if (this.validateTezosStorage(unknownURI)) {
                return true;
            }
        } else return false;

    }
} */
import validate, { result } from "validate.js";
import { HTTPFetcher } from "./httpHandler";
import { StorageFetcher } from "./storageHandler";
import { ContractAbstraction, ContractProvider, Wallet } from "@taquito/taquito";
import { getStorage, sha256 } from "../tzip16-utils";
import { MetadataInterface } from "../metadataInterface";
import Ajv, { JSONSchemaType, DefinedError } from "ajv";
import { tzip16spec } from "../../assets/proposals_tzip-16_metadata-schema";


export class Validator {
    httpHandler: HTTPFetcher;
    storageFetcher: StorageFetcher;

    constructor() {
        this.httpHandler = new HTTPFetcher();
        this.storageFetcher = new StorageFetcher();

    }

    /**
     * Returns, if uri is a valid http, https uri
     * @param unknownURI a uri string for protocol verification
     */
    async isValidUrl(unknownURI: string): Promise<void> {
        const _result = validate({ website: unknownURI }, {
            website: {
                url: {
                    schemes: ["http", "https"]
                }
            }
        });

        if (_result === undefined) {
            return;
        } else {
            throw new Error(JSON.stringify(_result));
        }
    }

    /**
     * Returns, if JSON complies to the schema
     */
    private isJsonValidWithSchema(metadataJSON: JSON, metadataSchema: JSON): boolean {
        const ajv = new Ajv({ allErrors: true });
        const validationFunction = ajv.compile(metadataSchema);
        const validationResult = validationFunction(metadataJSON);
        if (!validationResult) {
            throw validationFunction.errors;
        }
        return validationResult;
    }

    /**
     * Returns host contract, tezos network and metadata path information from the uri
     * @param tezosStorageURI TZIP16 uri of tezos-storage scheme
     */
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

    /**
     * Post validates metadata (TZIP16 schema compliance)
     * @param metadata Metadata for post validation
     */
    async postvalidate(metadata: MetadataInterface): Promise<void> {
        const _metadata = JSON.parse(JSON.stringify(metadata));
        try {
            await this.validateMetadataCompliance(_metadata);
        } catch (err) {
            throw err;
        }
    }

    /**
     * Pre validates metadata as per TZIP16 expectation
     * @param _contract Contract containing metadata
     */
    async prevalidate(_contract: ContractAbstraction<ContractProvider | Wallet>): Promise<void> {
        if (_contract.address === undefined) {
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

    /**
     * Validate metadata against specified schema or TZIP16 schema spec, otherwise
     * @param metadata JSON data to be validated
     * @param schemaDefinition Schema definition to be validated against
     */
    async validateMetadataCompliance(metadata: JSON, schemaDefinition?: JSON) {
        if (schemaDefinition) {
            return this.isJsonValidWithSchema(metadata, schemaDefinition);
        } else {
            const _schema = JSON.parse(JSON.stringify(tzip16spec));
            _schema["$id"] = "http://json-schema.org/draft-04/schema#";
            return this.isJsonValidWithSchema(metadata, _schema);
        }
    }

    /**
     * Gets metadata if it exists in the top level
     * @param storage 
     */
    async validateMetadataLevel(storage: Storage): Promise<any> {
        let metadata;
        try {
            metadata = await storage['metadata'];
        } catch (err) {
            throw new Error("Metadata bigmap does not exist in the top level of the storage tree.")
        }
        return metadata;
    }

    /**
     * Returns if metadata has type (big_map %metadata string bytes)
     * @param _metadata 
     */
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

    /**
     * Returns metadata, metadataHash and whether it matches the expected value in the provided uri
     * @param sha256uri TZIP16 uri of sha256 scheme
     */
    async validateSHA256(sha256uri: string) {
        const infoArray = sha256uri.slice(11).split('/');
        const _expectedHash = infoArray[0];
        const _encodedUri = infoArray[1];

        const metadataForHashing = await this.httpHandler.getMetadataNonJSON(decodeURIComponent(_encodedUri));
        const metadata = await this.httpHandler.getMetadataHTTP(decodeURIComponent(_encodedUri))

        const metadataHash: string = sha256(metadataForHashing.toString());

        let integrityResult: boolean = false;
        if (metadataHash.match(_expectedHash)) {
            integrityResult = true;
        }

        return { integrityResult, metadata, metadataHash }
    }

}
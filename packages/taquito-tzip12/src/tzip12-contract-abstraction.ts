import { MichelsonMap, Schema } from '@taquito/michelson-encoder';
import { ContractAbstraction, ContractProvider, Wallet } from '@taquito/taquito';
import { Tzip16ContractAbstraction, MetadataContext, View, bytes2Char, MetadataInterface } from '@taquito/tzip16'
import { InvalidTokenMetadata, TokenIdNotFound, TokenMetadataNotFound } from './tzip12-errors';

const tokenMetadataBigMapType = {
    prim: 'big_map',
    args: [
        { prim: 'nat' }, 
        { prim: 'pair', args: [
            { prim: 'nat' , annots: ['%token_id']}, 
            { prim: "map", args: [{ prim: 'string' }, { prim: 'bytes' }], annots: ['%token_info'] }] }],
    annots: ['%token_metadata']
};

type BigMapId = { int: string };

export interface TokenMetadata {
    token_id: number,
    decimals: number
    name?: string,
    symbol?: string,
}

export class Tzip12ContractAbstraction {
    private _tzip16ContractAbstraction: Tzip16ContractAbstraction;

    constructor(
        private contractAbstraction: ContractAbstraction<ContractProvider | Wallet>,
        private context: MetadataContext
    ) {
        this._tzip16ContractAbstraction = new Tzip16ContractAbstraction(this.contractAbstraction, this.context)
    }

    /**
     * @description Fetches the contract metadata (according to the Tzip-016 standard)
     * @returns An object containing the metadata, the uri, an optional integrity check result and an optional sha256 hash 
     * or `Undefined` if the contract has no metadata (non-compliant with Tzip-016)
     */
    private async getContractMetadata() {
        try {
            const contractMetadata = await this._tzip16ContractAbstraction.getMetadata();
            return contractMetadata.metadata;
        } catch (err) {
            // The contract is not compliant with Tzip-016. There is no contract metadata.
        }
    }

    /**
     * @description The Tzip-016 "interfaces" field MUST be present in the contract metadata. It should contain "TZIP-012[version-info]"
     * @returns True if "interfaces" field is present and contains "TZIP-012", false otherwise
     */
    async isTzip12Compliant() {
        let isCompliant = false;
        const metadata = await this.getContractMetadata();
        if (metadata) {
            const tzip12Interface = metadata.interfaces?.filter((x) => {
                return x.substring(0, 8) === "TZIP-012";
            });
            isCompliant = (tzip12Interface && tzip12Interface.length !== 0) ? true : false;
        }
        return isCompliant;
    }

    /**
     * @description Fetches the token metadata for a specified token ID.
     * The function first tries to find a `token_metadata` view in the contract metadata and to execute it with the token ID.
     * If there is no view, the function tries to find a `token_metadata` bigmap in the top-level pairs of the storage.
     * @param tokenId The ID of the token for which we want to retrieve token metadata
     * @returns An object of type `TokenMetadata`
     */
    async getTokenMetadata(tokenId: number) {
        const tokenMetadata = await this.retrieveTokenMetadataFromView(tokenId);
        return (!tokenMetadata) ? this.retrieveTokenMetadataFromBigMap(tokenId) : tokenMetadata;
    }

    private async retrieveTokenMetadataFromView(tokenId: number) {
        if (await this.getContractMetadata()) {
            const views = await this._tzip16ContractAbstraction.metadataViews();
            if (views && this.hasTokenMetadataView(views)) {
                return this.executeTokenMetadataView(views['token_metadata'](), tokenId);
            }
        }
    }

    private hasTokenMetadataView(views: {}) {
        for (let view of Object.keys(views)) {
            if (view === 'token_metadata') {
                return true;
            }
        }
        return false;
    }

    private async executeTokenMetadataView(tokenMetadataView: View, tokenId: number): Promise<TokenMetadata> {
        let tokenMetadata;
        try {
            tokenMetadata = await tokenMetadataView.executeView(tokenId);
        } catch (err) {
            throw new TokenIdNotFound(tokenId);
        }
        const tokenMap = Object.values(tokenMetadata)[1];
        if (!MichelsonMap.isMichelsonMap(tokenMap)) {
            throw new TokenMetadataNotFound(this.contractAbstraction.address);
        }
        const metadataFromUri = await this.fetchTokenMetadataFromUri(tokenMap as MichelsonMap<string, string>);
        return this.formatMetadataToken(tokenId, (tokenMap as MichelsonMap<string, string>), metadataFromUri);
    }

    private async fetchTokenMetadataFromUri(tokenMetadata: MichelsonMap<string, string>) {
        const uri = tokenMetadata.get("");
        if (uri) {
            try {
                const metadataFromUri = await this.context.metadataProvider.provideMetadata(
                    this.contractAbstraction,
                    bytes2Char(uri),
                    this.context
                );
                return metadataFromUri.metadata;
            } catch (e) {
                if (e.name === 'InvalidUri') {
                    console.warn(`The URI ${bytes2Char(uri)} is present in the token metadata, but is invalid.`);
                } else {
                    throw e;
                }
            }
        }
    }

    private formatMetadataToken(tokenId: number, metadataTokenMap: MichelsonMap<string, string>, metadataFromUri?: any): TokenMetadata {
        const tokenMetadataDecoded = {
            'token_id': tokenId
        };
        for (let keyTokenMetadata of metadataTokenMap.keys()) {
            if (keyTokenMetadata === 'decimals') {
                Object.assign(tokenMetadataDecoded, { [keyTokenMetadata]: Number(bytes2Char(metadataTokenMap.get(keyTokenMetadata)!)) });
            }
            else if (!(keyTokenMetadata === '')) {
                Object.assign(tokenMetadataDecoded, { [keyTokenMetadata]: bytes2Char(metadataTokenMap.get(keyTokenMetadata)!) });
            }
        }
        // if an URI is present, add the fetched properties to the object
        // if a property is in the URI and the map, prevalence is accorded to value from the URI
        if (metadataFromUri) {
            for(let property in metadataFromUri) {
                Object.assign(tokenMetadataDecoded, {[property]: metadataFromUri[property]})
            }
        }
        if(!('decimals' in tokenMetadataDecoded)) {
            throw new InvalidTokenMetadata();
        } 
        return tokenMetadataDecoded;
    }

    private async retrieveTokenMetadataFromBigMap(tokenId: number) {
        const bigmapTokenMetadataId = this.findTokenMetadataBigMap();
        let pairNatMap;
        try {
            pairNatMap = await this.context.contract.getBigMapKeyByID<any>(
                bigmapTokenMetadataId['int'].toString(),
                tokenId.toString(),
                new Schema(tokenMetadataBigMapType)
            );
        } catch (err) {
            throw new TokenIdNotFound(tokenId);
        }

        const michelsonMap = pairNatMap['token_info'];
        if (!MichelsonMap.isMichelsonMap(michelsonMap)) {
            throw new TokenIdNotFound(tokenId);
        }
        const metadataFromUri = await this.fetchTokenMetadataFromUri(michelsonMap as MichelsonMap<string, string>);
        return this.formatMetadataToken(tokenId, michelsonMap as MichelsonMap<string, string>, metadataFromUri)
    }

    private findTokenMetadataBigMap(): BigMapId {
        const tokenMetadataBigMapId = this.contractAbstraction.schema.FindFirstInTopLevelPair<BigMapId>(
            this.contractAbstraction.script.storage,
            tokenMetadataBigMapType
        );
        if (!tokenMetadataBigMapId) {
            throw new TokenMetadataNotFound(this.contractAbstraction.address);
        }
        return tokenMetadataBigMapId;
    }


}

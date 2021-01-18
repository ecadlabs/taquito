import { MichelsonMap, Schema } from '@taquito/michelson-encoder';
import { BigMapAbstraction, Context, ContractAbstraction, ContractProvider, Wallet } from '@taquito/taquito';
import { Tzip16ContractAbstraction, MetadataProviderInterface, MetadataContext, View, bytes2Char, InvalidUri, char2Bytes } from '@taquito/tzip16'
import { TokenMetadataNotFound } from './tzip12-errors';
import BigNumber from 'bignumber.js';

const tokenMetadataBigMapType = {
    prim: 'big_map',
    args: [{ prim: 'nat' }, { prim: 'pair', args: [{ prim: 'nat' }, { prim: "map", args: [{ prim: 'string' }, { prim: 'bytes' }] }] }],
    annots: ['%token_metadata']
};

type BigMapId = { int: string };

export interface TokenMetadata {
    name?: string,
    symbol?: string,
    decimals?: number
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
     * @returns Returns an object containing the metadata, the uri, an optional integrity check result and an optional sha256 hash 
     * or it returns Undefined if the contract has no metadata (non-compliant with Tzip-016)
     */
    async getContractMetadata() {
        try {
            return await this._tzip16ContractAbstraction.getMetadata();
        } catch (err) {
            // The contract is not compliant with Tzip-016. There is no contract metadata.
        }

    }

    /**
     * @description The Tzip-016 "interfaces" field MUST be present in the contract metadata. It should contain "TZIP-012[-<version-info>]"
     * @returns True if "interfaces" field is present and contains "TZIP-012", false otherwise
     */
    async isTzip12Compliant() {
        let isCompliant = false;
        const metadata = await this.getContractMetadata();
        if (metadata) {
            const tzip12Interface = metadata.metadata.interfaces?.filter((x) => {
                return x.substring(0, 8) === "TZIP-012";
            });
            isCompliant = (tzip12Interface && tzip12Interface.length !== 0) ? true : false;
        }
        return isCompliant;
    }

    async getTokenMetadata(tokenId: number) {
        // Firts step: look if the contract has metadata
        const contractMetadata = await this.getContractMetadata();
        if (contractMetadata) {
            const views = await this._tzip16ContractAbstraction.metadataViews();
            if (this.hasTokenMetadataView(views)) {
                // Second step: Look if metadata contains a view called `token_metadata`
                // execute the view 
                return await this.executeTokenMetadataView(views['token_metadata'](), tokenId);
            }
        }
            // Otherwise find %token_metadata of type (big_map nat (pair nat (map string bytes)))
            // TODO fetch metadata if there is a uri
            const bigmapTokenMetadata = this.findTokenMetadataBigMap();
            console.log(bigmapTokenMetadata)
            const pairTokenMetadata = await bigmapTokenMetadata.get<{}>(tokenId.toString());
            if(pairTokenMetadata) {
                const michelsonMap = Object.values(pairTokenMetadata)[1];
                return this.formatMetadataTokenFromViewResult(michelsonMap as MichelsonMap<string, string>)
            }
        throw new TokenMetadataNotFound(this.contractAbstraction.address)
    }

    /**
     * @description The `custom` method used by a contract to provide access to the token-metadata
     * @returns True if a view called `token_metadata` is present in the metadata, false otherwise
     */
    private hasTokenMetadataView(views: {}) {
            for (let view of Object.keys(views)) {
                if (view === 'token_metadata') {
                    return true;
                }
            }
        return false;
    }

    private async executeTokenMetadataView(tokenMetadataView: View, index: number): Promise<TokenMetadata> {
        const tokenMetadata = await tokenMetadataView.executeView(index);
        const michelsonMap = Object.values(tokenMetadata)[1];
        const metadataFromUri = await this.isUriInTokenMetadata(michelsonMap);
        if (metadataFromUri) {
            return metadataFromUri.metadata
        } else {
            return this.formatMetadataTokenFromViewResult((michelsonMap as MichelsonMap<string, string>));
        }
    }

    private async isUriInTokenMetadata(tokenMetadata: any) {
        // todo try catch
        const uri = tokenMetadata.get("");
        if (uri) {
            try {
                return await this.context.metadataProvider.provideMetadata(
                    this.contractAbstraction,
                    bytes2Char(uri),
                    this.context
                );
            } catch (e) {
                if (e.name === 'InvalidUri') {
                    console.warn(`The URI ${bytes2Char(uri)} is present in the token metadata, but is invalid.`)
                }
            }
        }
    }

    private formatMetadataTokenFromViewResult(metadataTokenMap: MichelsonMap<string, string>): TokenMetadata {
        const tokenMetadataDecoded = {};
            for (let keyTokenMetadata of metadataTokenMap.keys()) {
                if (!(keyTokenMetadata === '')){
                    Object.assign(tokenMetadataDecoded, { [keyTokenMetadata]: bytes2Char(metadataTokenMap.get(keyTokenMetadata)!) });
                }
              }
            return tokenMetadataDecoded

    }

    private findTokenMetadataBigMap(): BigMapAbstraction {
        const tokenMetadataBigMapId = this.contractAbstraction.schema.FindFirstInTopLevelPair<BigMapId>(
            this.contractAbstraction.script.storage,
            tokenMetadataBigMapType
        );
        console.log('tokenMetadataBigMapId',tokenMetadataBigMapId)
        if (!tokenMetadataBigMapId) {
            throw new TokenMetadataNotFound(this.contractAbstraction.address);
        }

        return new BigMapAbstraction(
            new BigNumber(tokenMetadataBigMapId['int']),
            new Schema(tokenMetadataBigMapType),
            this.context.contract
        );
    }


}

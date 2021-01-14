import { Context, ContractAbstraction, ContractProvider, Wallet } from '@taquito/taquito';
import { Tzip16ContractAbstraction, MetadataProviderInterface, MetadataContext } from '@taquito/tzip16'

export class Tzip12ContractAbstraction {
    private _tzip16ContractAbstraction: Tzip16ContractAbstraction;

    constructor(
        private contractAbstraction: ContractAbstraction<ContractProvider | Wallet>,
        private context: MetadataContext
    ) {
        this._tzip16ContractAbstraction = new Tzip16ContractAbstraction(this.contractAbstraction, this.context)
    }

    getTokenMetadata(){
        //const metadata = this.getMetadataFromTzip16();
    }

    private async getMetadataFromTzip16(){
        try { 
            return await this._tzip16ContractAbstraction.getMetadata();
        } catch (err) {
            // We tried the tzip16 way of finding the metadata and did not succeed.
        }

    }

    private async executeTokenMetadataView(){
        try {
            const views = await this._tzip16ContractAbstraction.metadataViews();
            views['token_metadata']().executeView(0);
        } catch(e) {

        }

    }

    private findTokenMetadataBigMap(){

    }
}

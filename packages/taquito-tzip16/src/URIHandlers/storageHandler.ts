import { ContractAbstraction, ContractProvider, Wallet } from "@taquito/taquito";
import { bytes2Char } from '../tzip16-utils';

export class StorageFetcher {
    /**
     * Gets metadata at a given key in the storage
     * @param _contractAbstraction 
     * @param _key 
     */
    async getMetadataStorage(_contractAbstraction: ContractAbstraction<ContractProvider | Wallet>, _key: string): Promise<JSON> {
        const _storage: any = await _contractAbstraction.storage();
        const _data = await _storage['metadata'].get(`${_key}`)
        return JSON.parse(bytes2Char(_data));
    }

    /**
     * Gets the type of metadata
     * @param _contractAbstraction 
     */
    getMetadataType(_contractAbstraction:ContractAbstraction<ContractProvider | Wallet>): Promise<JSON>{
        const _storage: any = _contractAbstraction.storage();
        const _metadata = _storage["metadata"];
        return _metadata.schema.root.val;
    }
}
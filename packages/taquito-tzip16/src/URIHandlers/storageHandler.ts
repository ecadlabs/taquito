import { ContractAbstraction, ContractProvider, Wallet } from "@taquito/taquito";
import { result } from "validate.js";
import { bytes2Char } from '../tzip16-utils';

export class StorageFetcher {
    /**
     * Gets metadata at a given key in the storage
     * @param _contractAbstraction 
     * @param _key 
     */
    async getMetadataStorage(_contractAbstraction: ContractAbstraction<ContractProvider | Wallet>, _key: string): Promise<JSON> {
        const _storage: Storage = await _contractAbstraction.storage();
        let _data, _result: JSON;
        try {
            _data = await _storage['metadata'].get(`${_key}`)

        } catch (err) {
            throw new Error("Metadata not found for the key")

        }
        _data = bytes2Char(_data)
        try {
            _result = JSON.parse(_data);
        } catch (err) {
            throw new Error("Metadata is not JSON. Value of metadata found is :" + _data)

        }
        return _result;
    }

    // /**
    //  * Gets the type of metadata
    //  * @param _contractAbstraction 
    //  */
    // async getMetadataType(_contractAbstraction: ContractAbstraction<ContractProvider | Wallet>): Promise<JSON> {
    //     let _metadata;
    //     try {
    //         const _storage: any = await _contractAbstraction.storage();
    //         _metadata = await _storage['metadata'];
    //     } catch (err) {
    //         throw new Error("Metadata bigmap does not exist in the top level of the storage tree.")
    //     }

    //     if(_metadata.schema.root.val.prim.match('big_map')){}
    //     else {
    //         throw new Error("Metadata exists but is not of type big_map.")
    //     }

    //     if(_metadata.schema.root.val.args[0].prim.match('string')){}
    //     else {
    //         throw new Error("Metadata exists but its key not of type string.")
    //     }

    //     if(_metadata.schema.root.val.args[1].prim.match('bytes')){}
    //     else {
    //         throw new Error("Metadata exists but its key not of type bytes.")
    //     }

    //     return _metadata.schema.root.val;
    // }
}
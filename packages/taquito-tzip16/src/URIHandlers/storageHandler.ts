import { ContractAbstraction, ContractProvider, Wallet } from "@taquito/taquito";
import { result } from "validate.js";
import { bytes2Char } from '../tzip16-utils';

export class StorageFetcher {
    /**
     * Gets metadata, when it is expected at a given key in the storage of a contract
     * @param _contractAbstraction A Tezos contract
     * @param _key Key in metadata bigmap, whose value is metadata JSON
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
}
import BigNumber from 'bignumber.js';
import { rpcContractResponse, storage } from '../data/sample19_sapling';
import { Schema } from '../src/schema/storage';

describe('Schema with sapling_state in storage', () => {
    it('Should decode storage properly', () => {
        const schema = new Schema(storage);
        /* expect(schema.Execute(rpcContractResponse.script.storage)).toEqual({
            sapling_state: new BigNumber(14)
        }); */
        expect(schema.Execute(rpcContractResponse.script.storage)).toEqual(
            '14'
        );
    });

     it('Should extract schema properly', () => {
        const schema = new Schema(storage);
        expect(schema.ExtractSchema()).toEqual({
            sapling_state: 'int'
        });
    });
});

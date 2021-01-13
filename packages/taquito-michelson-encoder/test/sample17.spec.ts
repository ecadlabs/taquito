import { script17, storage17 } from '../data/sample17';
import { Schema } from '../src/schema/storage';

describe('Schema.FindFirstInTopLevelPair test', () => {
    it(`Should find the first occurrence of a specified type in top-level pairs of the storage`, () => {
        const typeOfValueToFind = {
            prim: 'map',
            args: [
                { prim: 'nat' },
                {
                    prim: 'pair',
                    args: [{ prim: 'nat', annots: ['%current_stock'] }, { prim: 'mutez', annots: ['%max_price'] }]
                }
            ],
            annots: ['%taco_shop_storage']
        };
        const storageSchema = new Schema(storage17);
        const valueFound = storageSchema.FindFirstInTopLevelPair(script17.script.storage, typeOfValueToFind);
        expect(valueFound).toEqual([
            {
                prim: 'Elt',
                args: [
                    {
                        int: '1'
                    },
                    {
                        prim: 'Pair',
                        args: [
                            {
                                int: '10000'
                            },
                            {
                                int: '50'
                            }
                        ]
                    }
                ]
            }
        ]);
    });

    it(`Should find the first occurrence of a specified type in top-level pairs of the storage`, () => {
        const typeOfValueToFind = {
            prim: 'big_map',
            args: [{ prim: 'string' }, { prim: 'bytes' }],
            annots: ['%metadata']
        };
        const storageSchema = new Schema(storage17);
        const valueFound = storageSchema.FindFirstInTopLevelPair(script17.script.storage, typeOfValueToFind);
        expect(valueFound).toEqual({
            int: '20350'
        });
    });

    it(`Should return undefined when no value matches the specified type in top-level pairs of the storage`, () => {
        const typeOfValueToFind = {
            prim: 'big_map',
            args: [{ prim: 'string' }, { prim: 'bytes' }],
            annots: ['%invalidTest']
        };
        const storageSchema = new Schema(storage17);
        const valueFound = storageSchema.FindFirstInTopLevelPair(script17.script.storage, typeOfValueToFind);
        expect(valueFound).toBeUndefined();
    });
});

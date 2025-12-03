import { Schema } from '../src/schema/storage';

describe('List token type structure', () => {
  it('Should extract correct schema for token type list', () => {
    const storageType = {
      prim: 'list',
      args: [
        {
          prim: 'pair',
          args: [
            { prim: 'address', annots: ['%from'] },
            { prim: 'address', annots: ['%to'] },
          ],
        },
      ],
    };
    const schema = new Schema(storageType);

    expect(schema.generateSchema()).toEqual({
      __michelsonType: 'list',
      schema: {
        __michelsonType: 'pair',
        schema: {
          "from": {
            __michelsonType: "address",
            schema: "address"
          },
          "to": {
            __michelsonType: "address",
            schema: "address"
          }
        }
      }
    });

  });
});
import { storage } from '../data/sample20';
import { InvalidBigMapSchema, InvalidRpcResponseError } from '../src/schema/error';

import { Schema } from '../src/taquito-michelson-encoder';

describe('Errors releated to Schemas', () => {
  it('Should throw InvalidRpcResponseError if storage is not an array', () => {
    expect(() =>
      Schema.fromRPCResponse({
        script: {
          code: [
            {
              prim: 'view',
              args: [{ string: 'add' }, { prim: 'nat' }, { prim: 'nat' }],
            },
          ],
          storage: [],
        },
      })
    ).toThrowError(InvalidRpcResponseError);
  });

  it('Should throw InvalidBigMapSchema if big map schema is invalid', () => {
    const schema = new Schema(storage);
    const bigMap = [
      {
        key_hash: 'expruBGgmdtDn1qJCVYrfyAoyXboENZqaysqPQmYmSEcEaAu8Zd2R9',
        key: { bytes: '000041145574571df6030acad578fdc8d41c4979f0df' },
        value: {},
      },
    ];
    expect(() => schema.ExecuteOnBigMapDiff(bigMap)).toThrow(InvalidBigMapSchema);
    expect.objectContaining({
      message: expect.stringContaining('Big map schema is undefined'),
    });
  });
});

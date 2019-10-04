import { rpcContractResponse as rpcContractResponse7, storage as storage7 } from '../data/sample7';
import { Schema } from '../src/schema/storage';

describe('Schema test', () => {
  it('Should parse storage properly', () => {
    const schema = new Schema(storage7);
    const storage = schema.Execute(rpcContractResponse7.script.storage);
    expect(storage).toEqual({
      game: null,
      oracle_id: 'tz1Zwusa1tLQHRyB1KL1p44KjgDbi5KjNKay',
    });
  });

  it('Should encode storage properly', () => {
    const schema = new Schema(storage7);
    const storage = schema.Encode({
      game: null,
      oracle_id: 'tz1Zwusa1tLQHRyB1KL1p44KjgDbi5KjNKay',
    });
    expect(storage).toEqual(rpcContractResponse7.script.storage);
  });

  it('Should encode storage properly', () => {
    const schema = new Schema(storage7);
    const storage = schema.Encode({
      game: {
        number: 1,
        bet: 1,
        player: 'tz1Zwusa1tLQHRyB1KL1p44KjgDbi5KjNKay',
      },
      oracle_id: 'tz1Zwusa1tLQHRyB1KL1p44KjgDbi5KjNKay',
    });
    expect(storage).toEqual({
      args: [
        {
          args: [
            {
              args: [
                {
                  int: '1',
                },
                {
                  args: [
                    {
                      int: '1',
                    },
                    {
                      string: 'tz1Zwusa1tLQHRyB1KL1p44KjgDbi5KjNKay',
                    },
                  ],
                  prim: 'Pair',
                },
              ],
              prim: 'Pair',
            },
          ],
          prim: 'Some',
        },
        {
          string: 'tz1Zwusa1tLQHRyB1KL1p44KjgDbi5KjNKay',
        },
      ],
      prim: 'Pair',
    });
  });
});

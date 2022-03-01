import { createToken } from '../../src/tokens/createToken';
import { PairToken } from '../../src/tokens/pair';

describe('Pair token', () => {
  const token = createToken(
    {
      prim: 'pair',
      args: [{ prim: 'int', annots: ['test'] }, { prim: 'string', annots: ['test2'] }],
    },
    0
  ) as PairToken;
  describe('Compare', () => {
    test('Compare simple pair', () => {

      expect(token.compare({ test: 1, test2: 'test' }, { test: 2, test2: 'test' })).toEqual(-1);
      expect(token.compare({ test: 3, test2: 'test' }, { test: 2, test2: 'test' })).toEqual(1);
      expect(token.compare({ test: 2, test2: 'test' }, { test: 2, test2: 'test' })).toEqual(0);
      expect(token.compare({ test: 2, test2: 'hello' }, { test: 2, test2: 'test' })).toEqual(-1);
      expect(token.compare({ test: 2, test2: 'test' }, { test: 2, test2: 'hello' })).toEqual(1);
    });
  });

  describe('ToBigMapKey', () => {
    test('Simple pair to big map key', () => {
      const { key, type } = token.ToBigMapKey({ test: 1, test2: 'test' });
      expect(key).toEqual({ prim: 'Pair', args: [{ int: '1' }, { string: 'test' }] });
      expect(type).toEqual({ prim: 'pair', args: [{ prim: 'int' }, { prim: 'string' }] });
    });

    it('Nested pair to big map key', () => {
      const token = createToken(
        {
          prim: 'pair',
          args: [
            { prim: 'int', annots: ['test'] },
            {
              prim: 'pair',
              args: [{ prim: 'string', annots: ['test2'] }, { prim: 'string', annots: ['test3'] }],
            },
          ],
        },
        0
      ) as PairToken;
      const { key, type } = token.ToBigMapKey({ test: 1, test2: 'test', test3: 'test' });
      expect(key).toEqual({
        prim: 'Pair',
        args: [{ int: '1' }, { prim: 'Pair', args: [{ string: 'test' }, { string: 'test' }] }],
      });
      expect(type).toEqual({
        prim: 'pair',
        args: [{ prim: 'int' }, { prim: 'pair', args: [{ prim: 'string' }, { prim: 'string' }] }],
      });
    });
  });

  describe('generateSchema', () => {
    it('Should generate the schema properly', () => {
      expect(token.generateSchema()).toEqual({
        __michelsonType: 'pair',
        schema: {
          test: {
            __michelsonType: 'int',
            schema: 'int'
          },
          test2: {
            __michelsonType: 'string',
            schema: 'string'
          }
        }
      });
    });
  });
});

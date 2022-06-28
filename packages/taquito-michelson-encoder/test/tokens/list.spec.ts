import { ListToken } from '../../src/tokens/list';
import { createToken } from '../../src/tokens/createToken';

describe('List token', () => {
  let token: ListToken;
  beforeEach(() => {
    token = new ListToken({ prim: 'list', args: [{ prim: 'int' }], annots: [] }, 0, createToken);
  });

  describe('EncodeObject', () => {
    it('Should encode list properly', () => {
      expect(token.EncodeObject([0, 1, 2, 30, 2])).toEqual([
        { int: '0' },
        { int: '1' },
        { int: '2' },
        { int: '30' },
        { int: '2' },
      ]);
    });
  });

  describe('Encode', () => {
    it('Should encode list properly', () => {
      expect(token.Encode([[0, 1, 2, 30, 2]])).toEqual([
        { int: '0' },
        { int: '1' },
        { int: '2' },
        { int: '30' },
        { int: '2' },
      ]);
    });
  });
});

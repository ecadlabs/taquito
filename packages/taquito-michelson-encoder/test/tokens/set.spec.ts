import { SetToken } from '../../src/tokens/set';
import { createToken } from '../../src/tokens/createToken';

describe('Set token', () => {
  let token: SetToken;
  beforeEach(() => {
    token = new SetToken({ prim: 'set', args: [{ prim: 'int' }], annots: [] }, 0, createToken);
  });

  describe('EncodeObject', () => {
    it('Should encode set properly', () => {
      expect(token.EncodeObject([0, 1, 2, 30])).toEqual([
        { int: '0' },
        { int: '1' },
        { int: '2' },
        { int: '30' },
      ]);
    });
  });

  describe('Encode', () => {
    it('Should encode set properly', () => {
      expect(token.Encode([[0, 1, 2, 30]])).toEqual([
        { int: '0' },
        { int: '1' },
        { int: '2' },
        { int: '30' },
      ]);
    });
  });
});

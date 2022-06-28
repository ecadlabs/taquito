import { BoolToken } from '../../src/tokens/comparable/bool';

describe('Bool token', () => {
  let token: BoolToken;
  beforeEach(() => {
    token = new BoolToken({ prim: 'bool', args: [{ prim: 'int' }], annots: [] }, 0, null as any);
  });

  describe('EncodeObject', () => {
    it('Should encode bool properly', () => {
      expect(token.EncodeObject(true)).toEqual({
        prim: 'True',
      });
    });

    it('Should encode bool properly', () => {
      expect(token.EncodeObject(false)).toEqual({
        prim: 'False',
      });
    });
  });

  describe('Encode', () => {
    it('Should encode bool properly', () => {
      expect(token.Encode([true])).toEqual({
        prim: 'True',
      });
    });

    it('Should encode bool properly', () => {
      expect(token.Encode([false])).toEqual({
        prim: 'False',
      });
    });
  });
});

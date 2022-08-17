import { StringToken } from '../../src/tokens/comparable/string';

describe('String token', () => {
  let token: StringToken;
  beforeEach(() => {
    token = new StringToken({ prim: 'string', args: [], annots: [] }, 0, null as any);
  });

  describe('EncodeObject', () => {
    it('Should encode string to string', () => {
      expect(token.EncodeObject('hello world')).toEqual({ string: 'hello world' });
    });
  });
  describe('TypecheckValue', () => {
    it('Should return undefined', () => {
      expect(token.TypecheckValue('hello world')).toBeUndefined();
    });
  });

  describe('Encode', () => {
    it('Should encode string to string', () => {
      expect(token.Encode(['hello world'])).toEqual({ string: 'hello world' });
    });
  });
});

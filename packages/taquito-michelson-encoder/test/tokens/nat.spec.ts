import { NatToken, NatValidationError } from '../../src/tokens/comparable/nat';

describe('Nat token', () => {
  let token: NatToken;
  beforeEach(() => {
    token = new NatToken({ prim: 'nat', args: [], annots: [] }, 0, null as any);
  });

  describe('EncodeObject', () => {
    it('Should encode number to string', () => {
      expect(token.EncodeObject(0)).toEqual({ int: '0' });
      expect(token.EncodeObject(1000)).toEqual({ int: '1000' });
    });

    it('Should throw a validation error when value is less than 0', () => {
      expect(() => token.EncodeObject(-1)).toThrowError(NatValidationError);
    });

    it('Should throw a validation error when value is not a number', () => {
      expect(() => token.EncodeObject('test')).toThrowError(NatValidationError);
      expect(() => token.EncodeObject([])).toThrowError(NatValidationError);
      expect(() => token.EncodeObject({})).toThrowError(NatValidationError);
    });
  });

  describe('Encode', () => {
    it('Should encode number to string', () => {
      expect(token.Encode([0])).toEqual({ int: '0' });
      expect(token.Encode([1000])).toEqual({ int: '1000' });
    });

    it('Should throw a validation error when value is less than 0', () => {
      expect(() => token.Encode([-1])).toThrowError(NatValidationError);
    });

    it('Should throw a validation error when value is not a number', () => {
      expect(() => token.Encode(['test'])).toThrowError(NatValidationError);
      expect(() => token.Encode([])).toThrowError(NatValidationError);
      expect(() => token.Encode([{}])).toThrowError(NatValidationError);
    });
  });
});

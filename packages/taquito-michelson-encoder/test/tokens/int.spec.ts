import { IntToken, IntValidationError } from '../../src/tokens/comparable/int';

describe('Int token', () => {
  let token: IntToken;
  beforeEach(() => {
    token = new IntToken({ prim: 'int', args: [], annots: [] }, 0, null as any);
  });

  describe('EncodeObject', () => {
    it('Should encode number to string', () => {
      expect(token.EncodeObject(0)).toEqual({ int: '0' });
      expect(token.EncodeObject(1000)).toEqual({ int: '1000' });
      expect(token.EncodeObject(2000000000000000000000000000000000000000000000000000000)).toEqual({ int: '2000000000000000000000000000000000000000000000000000000' });
    });

    it('Should throw a validation error when value is not a number', () => {
      expect(() => token.EncodeObject('test')).toThrowError(IntValidationError);
      expect(() => token.EncodeObject([])).toThrowError(IntValidationError);
      expect(() => token.EncodeObject({})).toThrowError(IntValidationError);
    });
  });

  describe('Encode', () => {
    it('Should encode number to string', () => {
      expect(token.Encode([0])).toEqual({ int: '0' });
      expect(token.Encode([1000])).toEqual({ int: '1000' });
      expect(token.Encode([2000000000000000000000000000000000000000000000000000000])).toEqual({ int: '2000000000000000000000000000000000000000000000000000000' });
    });

    it('Should throw a validation error when value is not a number', () => {
      expect(() => token.Encode(['test'])).toThrowError(IntValidationError);
      expect(() => token.Encode([])).toThrowError(IntValidationError);
      expect(() => token.Encode([{}])).toThrowError(IntValidationError);
    });
  });

  describe('ToBigMapKey', () => {
    it('accepts a number as parameter', () => {
      expect(token.ToBigMapKey(0)).toEqual({
        key: { int: '0' },
        type: { prim: IntToken.prim },
      });
    });
    it('accepts a string as parameter', () => {
      expect(token.ToBigMapKey('0')).toEqual({
        key: { int: '0' },
        type: { prim: IntToken.prim },
      });
    });
  });

  describe('generateSchema', () => {
    it('Should generate the schema properly', () => {
      expect(token.generateSchema()).toEqual({
        __michelsonType: 'int',
        schema: 'int'
      });
    });
  });
});

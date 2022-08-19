import { MutezToken, MutezValidationError } from '../../src/tokens/comparable/mutez';

describe('Mutez token', () => {
  let token: MutezToken;
  beforeEach(() => {
    token = new MutezToken({ prim: 'mutez', args: [], annots: [] }, 0, null as any);
  });

  describe('EncodeObject', () => {
    it('Should encode number to string', () => {
      expect(token.EncodeObject(0)).toEqual({ int: '0' });
      expect(token.EncodeObject(1000)).toEqual({ int: '1000' });
    });

    it('Should throw a validation error when value is not a number', () => {
      expect(() => token.EncodeObject('test')).toThrowError(MutezValidationError);
      expect(() => token.EncodeObject([])).toThrowError(MutezValidationError);
      expect(() => token.EncodeObject({})).toThrowError(MutezValidationError);
    });
  });
  describe('TypecheckValue', () => {
    it('should be undefined', () => {
      expect(token.TypecheckValue(0)).toBeUndefined();
      expect(token.TypecheckValue('4')).toBeUndefined();
      expect(token.TypecheckValue("190847290834701923875098756123.1283746128374601287346023")).toBeUndefined();
    });

    it('Should throw a validation error when value is not a number', () => {
      expect(() => token.TypecheckValue('test')).toThrowError(MutezValidationError);
      expect(() => token.TypecheckValue('')).toThrowError(MutezValidationError);

    });
  });

  describe('Encode', () => {
    it('Should encode number to string', () => {
      expect(token.Encode([0])).toEqual({ int: '0' });
      expect(token.Encode([1000])).toEqual({ int: '1000' });
    });

    it('Should throw a validation error when value is not a number', () => {
      expect(() => token.Encode(['test'])).toThrowError(MutezValidationError);
      expect(() => token.Encode(['test'])).toThrowError('Value is not a number: test');
      expect(() => token.Encode([])).toThrowError(MutezValidationError);
      expect(() => token.Encode([{}])).toThrowError(MutezValidationError);
    });
  });

  describe('ToBigMapKey', () => {
  it('accepts a number as parameter', () => {
      expect(token.ToBigMapKey(10000000)).toEqual({
        key: { int: '10000000' },
        type: { prim: MutezToken.prim },
      });
    });
  it('accepts a string as parameter', () => {
      expect(token.ToBigMapKey('10000000')).toEqual({
        key: { int: '10000000' },
        type: { prim: MutezToken.prim },
      });
    });
  });

  describe('generateSchema', () => {
    it('Should generate the schema properly', () => {
      expect(token.generateSchema()).toEqual({
        __michelsonType: 'mutez',
        schema: 'mutez'
      });
    });
  });
});

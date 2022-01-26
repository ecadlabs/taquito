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
        schema: 'mutez',
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

import { NatToken, NatValidationError } from '../../src/tokens/comparable/nat';
import BigNumber from "bignumber.js"

describe('Nat token', () => {
  let token: NatToken;
  beforeEach(() => {
    token = new NatToken({ prim: 'nat', args: [], annots: [] }, 0, null as any);
  });

  describe('EncodeObject', () => {
    it('Should encode number to string', () => {
      expect(token.EncodeObject(0)).toEqual({ int: '0' });
      expect(token.EncodeObject(1000)).toEqual({ int: '1000' });
      expect(token.EncodeObject(2000000000000001000000000000000000000000000000000000000)).toEqual({ int: '2000000000000001000000000000000000000000000000000000000' });
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
  describe('TypecheckValue', () => {
    it('Should return undefined', () => {
      expect(token.TypecheckValue(0)).toBeUndefined();
      expect(token.TypecheckValue('4')).toBeUndefined();
      expect(token.TypecheckValue("1908472908347019238750987561231019283740918237409182734123908471092384701928374")).toBeUndefined();
    });

    it('Should throw a validation error when value is less than 0', () => {
      expect(() => token.TypecheckValue(-1)).toThrowError(NatValidationError);
    });

    it('Should throw error if float not nat', () => {
      // expect(() => token.TypecheckValue("19084729083470192387509875612310192837409.18237409182734123908471092384701928374")).toThrowError(NatValidationError);
      const bigNumber = new BigNumber('1029380192830912.192837918273')
      expect(() => token.TypecheckValue(bigNumber)).toThrowError(NatValidationError)

    })

    it('Should throw a validation error when value is not a number', () => {
      expect(() => token.TypecheckValue('')).toThrowError(NatValidationError);
    });
  });

  describe('Encode', () => {
    it('Should encode number to string', () => {
      expect(token.Encode([0])).toEqual({ int: '0' });
      expect(token.Encode([1000])).toEqual({ int: '1000' });
      expect(token.Encode([2000000000000000000000000000000000000000000000000000000])).toEqual({ int: '2000000000000000000000000000000000000000000000000000000' });
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

  describe('ToBigMapKey', () => {
  it('accepts a number as parameter', () => {
      expect(token.ToBigMapKey(10)).toEqual({
        key: { int: '10' },
        type: { prim: NatToken.prim },
      });
    });
  it('accepts a string as parameter', () => {
      expect(token.ToBigMapKey('10')).toEqual({
        key: { int: '10' },
        type: { prim: NatToken.prim },
      });
    });
  });

  describe('generateSchema', () => {
    it('Should generate the schema properly', () => {
      expect(token.generateSchema()).toEqual({
        __michelsonType: 'nat',
        schema: 'nat'
      });
    });
  });
});

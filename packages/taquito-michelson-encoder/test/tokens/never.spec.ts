import { createToken } from '../../src/tokens/createToken';
import { PairToken } from '../../src/tokens/pair';
import { NeverToken, NeverTokenError } from '../../src/tokens/never'
import { OptionToken } from '../../src/tokens/option';
import { ParameterSchema } from '../../src/taquito-michelson-encoder';

describe('Never token', () => {

  let tokenNever: NeverToken
  let tokenNeverOption: OptionToken;
  let tokenNeverPair: PairToken;


  beforeEach(() => {
    tokenNever = createToken({ "prim": "never" }, 0) as NeverToken;
    tokenNeverOption = createToken({ "prim": "option", "args": [{ "prim": "never" }], "annots": ["%setApprover"] }, 0) as OptionToken;
    tokenNeverPair = createToken({ "prim": "pair", "args": [{ "prim": "nat" }, { "prim": "never" }] }, 0) as PairToken;
  });

  describe('EncodeObject', () => {
    it('Should throw an error on EncodeObject as there are no literal values of this type.', () => {
      expect(() => tokenNever.EncodeObject('test')).toThrowError(NeverTokenError);
      expect(() => tokenNeverPair.EncodeObject({ 0: 4, 1: 'test' })).toThrowError(NeverTokenError);
      expect(() => tokenNeverOption.EncodeObject('test')).toThrowError(NeverTokenError);
      expect(tokenNeverOption.EncodeObject(null)).toEqual({ prim: 'None' });
    });
  });

  describe('Encode', () => {
    it('Should throw an error on Encode as there are no literal values of this type.', () => {
      expect(() => tokenNever.Encode(['test'])).toThrowError(NeverTokenError);
      expect(() => tokenNeverPair.Encode([4, 1])).toThrowError(NeverTokenError);
      expect(() => tokenNeverOption.Encode(['test'])).toThrowError(NeverTokenError);
      expect(tokenNeverOption.Encode([null])).toEqual({ prim: 'None' });
    });
  });

  describe('Execute', () => {
    it('Should throw an error on Execute as there are no literal values of this type', () => {
      expect(() => tokenNever.Execute('')).toThrowError(NeverTokenError);
    });
  });

  describe('Never parameter encoding', () => {
    it('Never parameter are encoded properly', () => {
      const schema = new ParameterSchema({ prim: 'never' });
      const result = schema.generateSchema();
      expect(result).toEqual('never');
      expect(schema.generateSchema()).toEqual({
        __michelsonType: 'never',
        schema: 'never'
      });
    });

    it('Never parameter are encoded properly', () => {
      const schema = new ParameterSchema({ "prim": "pair", "args": [{ "prim": "nat" }, { "prim": "never" }] });
      const result = schema.generateSchema();
      expect(result).toEqual({ 0: 'nat', 1: 'never' });

      expect(schema.generateSchema()).toEqual({
        __michelsonType: 'pair',
        schema: {
          0: {
            __michelsonType: 'nat',
            schema: 'nat'
          }, 1: {
            __michelsonType: 'never',
            schema: 'never'
          }
        }
      });
    });
  });

});

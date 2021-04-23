import { createToken } from '../../src/tokens/createToken';
import { PairToken } from '../../src/tokens/pair';
import { NeverToken, NeverValidationError } from '../../src/tokens/never'
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
    it('Should always throw an error on EncodeObject as there are no literal values of this type.', () => {
      expect(() => tokenNever.EncodeObject('test')).toThrowError(NeverValidationError);
      expect(() => tokenNeverPair.EncodeObject({ 0: 4, 1: 'test' })).toThrowError(NeverValidationError);
      expect(() => tokenNeverOption.EncodeObject('test')).toThrowError(NeverValidationError);
      expect(tokenNeverOption.EncodeObject(null)).toEqual({ prim: 'None' });
    });
  });

  describe('Encode', () => {
    it('Should throw an error on Encode as there are no literal values of this type.', () => {
      expect(() => tokenNever.Encode(['test'])).toThrowError(NeverValidationError);
      expect(() => tokenNeverPair.Encode([4, 1])).toThrowError(NeverValidationError);
      expect(() => tokenNeverOption.Encode(['test'])).toThrowError(NeverValidationError);
      expect(tokenNeverOption.Encode([null])).toEqual({ prim: 'None' });
    });
  });

  describe('Execute', () => {
    it('Should throw an error on Execute as there are no literal values of this type', () => {
      expect(() => tokenNever.Execute('')).toThrowError(NeverValidationError);
    });
  });

  describe('Never parameter encoding', () => {
    it('Never parameter are encoded properly', () => {
      const schema = new ParameterSchema({ prim: 'never' });
      const result = schema.ExtractSchema();
      expect(result).toEqual('never');
    });

    it('Never parameter are encoded properly', () => {
      const schema = new ParameterSchema({ "prim": "pair", "args": [{ "prim": "nat" }, { "prim": "never" }] });
      const result = schema.ExtractSchema();
      expect(result).toEqual({0: 'nat', 1: 'never'});
    });
  });

});

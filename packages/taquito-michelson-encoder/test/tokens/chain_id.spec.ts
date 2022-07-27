import { ChainIDToken, ChainIDValidationError } from '../../src/tokens/chain-id';

describe('Chain ID token', () => {
  let token: ChainIDToken;
  beforeEach(() => {
    token = new ChainIDToken({ prim: 'chain_id', args: [], annots: [] }, 0, null as any);
  });

  describe('EncodeObject', () => {
    it('Should encode chain id to string', () => {
      expect(token.EncodeObject('NetXpqTM3MbtXCx')).toEqual({ string: 'NetXpqTM3MbtXCx' });
    });

    it('Should throw a validation error when value is not a valid chain id', () => {
      expect(() => token.EncodeObject('test')).toThrowError(ChainIDValidationError);
      expect(() => token.EncodeObject({})).toThrowError(ChainIDValidationError);
    });
  });

  describe('Encode', () => {
    it('Should encode chain id to string', () => {
      expect(token.Encode(['NetXpqTM3MbtXCx'])).toEqual({ string: 'NetXpqTM3MbtXCx' });
    });

    it('Should throw a validation error when value is not a valid chain id', () => {
      expect(() => token.Encode(['test'])).toThrowError(ChainIDValidationError);
      expect(() => token.Encode([])).toThrowError(ChainIDValidationError);
      expect(() => token.Encode([{}])).toThrowError(ChainIDValidationError);
    });
  });

  describe('generateSchema', () => {
    it('Should generate the schema properly', () => {
      expect(token.generateSchema()).toEqual({
        __michelsonType: 'chain_id',
        schema: 'chain_id'
      });
    });
  });
});

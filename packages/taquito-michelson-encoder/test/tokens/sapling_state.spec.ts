import { SaplingStateToken, SaplingStateValidationError } from '../../src/tokens/sapling-state';
import { SaplingStateValue } from '../../src/taquito-michelson-encoder';

describe('Sapling Transaction token', () => {
  let token: SaplingStateToken;
  beforeEach(() => {
    token = new SaplingStateToken(
      { prim: 'sapling_state', args: [{ int: '8' }], annots: [] },
      0,
      null as any
    );
  });

  describe('EncodeObject', () => {
    it('Should encode sapling state into an empty array', () => {
      expect(token.EncodeObject(SaplingStateValue)).toEqual([]);
      expect(token.EncodeObject([])).toEqual([]);
      expect(token.EncodeObject({})).toEqual([]);
    });

    it('Should throw a validation error when value is not a valid sapling state', () => {
      expect(() => token.EncodeObject('1')).toThrowError(SaplingStateValidationError);
    });
  });

  describe('Encode', () => {
    it('Should encode sapling state into an empty array', () => {
      expect(token.Encode([SaplingStateValue])).toEqual([]);
      expect(token.Encode([[]])).toEqual([]);
      expect(token.Encode([{}])).toEqual([]);
    });

    it('Should throw a validation error when value is not a valid sapling state', () => {
      expect(() => token.Encode(['1'])).toThrowError(SaplingStateValidationError);
    });
  });

  describe('Execute', () => {
    it('Should return the sapling state id', () => {
      const result = token.Execute({ int: 12 } as any);
      expect(result).toEqual(12);
    });
  });

  describe('ExtractSchema', () => {
    it('Should extract schema', () => {
      expect(token.generateSchema()).toEqual({
        __michelsonType: 'sapling_state',
        schema: {
          memoSize: '8'
        },
      });
    });
  });
});

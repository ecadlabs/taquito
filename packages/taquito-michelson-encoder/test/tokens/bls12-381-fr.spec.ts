import { Bls12381frValidationError, Bls12381frToken } from '../../src/tokens/bls12-381-fr';

describe('Bls12-381-fr token', () => {
  let token: Bls12381frToken;
  beforeEach(() => {
    token = new Bls12381frToken({ prim: 'bls12_381_fr', args: [], annots: [] }, 0, null as any);
  });

  describe('EncodeObject', () => {
    it('Should encode hex string to Michelson bytes format', () => {
      expect(token.EncodeObject('1234')).toEqual({
        bytes: '1234',
      });
    });

    it('Should encode Uint8Array to Michelson bytes format', () => {
      const uint8 = new Uint8Array([21, 31]);
      expect(token.EncodeObject(uint8)).toEqual({
        bytes: '151f',
      });
    });

    it('Should encode number to Michelson int format', () => {
      expect(token.EncodeObject(1234)).toEqual({
        int: '1234',
      });
    });

    it('Should throw a validation error when bytes are not valid', () => {
      expect(() => token.EncodeObject('test')).toThrowError(Bls12381frValidationError);
    });
  });

  describe('Encode', () => {
    it('Should encode bytes string to Michelson bytes format', () => {
      expect(token.Encode(['cafe'])).toEqual({
        bytes: 'cafe',
      });
    });

    it('Should encode Uint8Array to bytes', () => {
      const uint8 = new Uint8Array([115, 2, 65]);
      expect(token.Encode([uint8])).toEqual({
        bytes: '730241',
      });
    });

    it('Should encode number to Michelson int format', () => {
      expect(token.Encode([1234])).toEqual({
        int: '1234',
      });
    });

    it('Should throw a validation error when bytes are not valid', () => {
      expect(() => token.Encode(['test'])).toThrowError(Bls12381frValidationError);

      try {
        token.Encode(['test']);
      } catch (ex) {
        expect(ex.name).toEqual('Bls12381frValidationError');
      }
    });
  });

  describe('Execute', () => {
    it('Should extract hex string from Michelson data', () => {
      expect(
        token.Execute({ bytes: '0100000000000000000000000000000000000000000000000000000000000000' })
      ).toEqual('0100000000000000000000000000000000000000000000000000000000000000');
    });
  });

  describe('ExtractSchema', () => {
    it('test schema', () => {
      expect(token.generateSchema()).toEqual('bls12_381_fr');
      expect(token.generateSchema()).toEqual({
        __michelsonType: 'bls12_381_fr',
        schema: 'bls12_381_fr'
      });
    });
  });
});

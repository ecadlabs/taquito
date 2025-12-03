import { Bls12381g1ValidationError, Bls12381g1Token } from '../../src/tokens/bls12-381-g1';

describe('Bls12-381-g1 token', () => {
  let token: Bls12381g1Token;
  beforeEach(() => {
    token = new Bls12381g1Token({ prim: 'bls12_381_g1', args: [], annots: [] }, 0, null as any);
  });

  describe('EncodeObject', () => {
    it('Should encode hex string to Michelson bytes format', () => {
      expect(
        token.EncodeObject(
          '0572cbea904d67468808c8eb50a9450c9721db309128012543902d0ac358a62ae28f75bb8f1c7c42c39a8c5529bf0f4e166a9d8cabc673a322fda673779d8e3822ba3ecb8670e461f73bb9021d5fd76a4c56d9d4cd16bd1bba86881979749d28'
        )
      ).toEqual({
        bytes:
          '0572cbea904d67468808c8eb50a9450c9721db309128012543902d0ac358a62ae28f75bb8f1c7c42c39a8c5529bf0f4e166a9d8cabc673a322fda673779d8e3822ba3ecb8670e461f73bb9021d5fd76a4c56d9d4cd16bd1bba86881979749d28',
      });
    });

    it('Should encode Uint8Array to Michelson bytes format', () => {
      const uint8 = new Uint8Array([21, 31]);
      expect(token.EncodeObject(uint8)).toEqual({
        bytes: '151f',
      });
    });

    it('Should throw a validation error when bytes are not valid', () => {
      expect(() => token.EncodeObject('test')).toThrowError(Bls12381g1ValidationError);
      expect(() => token.EncodeObject('4')).toThrowError(Bls12381g1ValidationError);
    });
  });

  describe('Encode', () => {
    it('Should encode bytes string to Michelson bytes format', () => {
      expect(
        token.Encode([
          '0572cbea904d67468808c8eb50a9450c9721db309128012543902d0ac358a62ae28f75bb8f1c7c42c39a8c5529bf0f4e166a9d8cabc673a322fda673779d8e3822ba3ecb8670e461f73bb9021d5fd76a4c56d9d4cd16bd1bba86881979749d28',
        ])
      ).toEqual({
        bytes:
          '0572cbea904d67468808c8eb50a9450c9721db309128012543902d0ac358a62ae28f75bb8f1c7c42c39a8c5529bf0f4e166a9d8cabc673a322fda673779d8e3822ba3ecb8670e461f73bb9021d5fd76a4c56d9d4cd16bd1bba86881979749d28',
      });
    });

    it('Should encode Uint8Array to bytes', () => {
      const uint8 = new Uint8Array([115, 2, 65]);
      expect(token.Encode([uint8])).toEqual({
        bytes: '730241',
      });
    });

    it('Should throw a validation error when bytes are not valid', () => {
      expect(() => token.Encode(['test'])).toThrowError(Bls12381g1ValidationError);
      expect(() => token.Encode([23])).toThrowError(Bls12381g1ValidationError);

      try {
        token.Encode(['test']);
      } catch (ex) {
        expect(ex.name).toEqual('Bls12381g1ValidationError');
      }
    });
  });

  describe('Execute', () => {
    it('Should extract hex string from Michelson data', () => {
      expect(
        token.Execute({
          bytes:
            '0572cbea904d67468808c8eb50a9450c9721db309128012543902d0ac358a62ae28f75bb8f1c7c42c39a8c5529bf0f4e166a9d8cabc673a322fda673779d8e3822ba3ecb8670e461f73bb9021d5fd76a4c56d9d4cd16bd1bba868',
        })
      ).toEqual(
        '0572cbea904d67468808c8eb50a9450c9721db309128012543902d0ac358a62ae28f75bb8f1c7c42c39a8c5529bf0f4e166a9d8cabc673a322fda673779d8e3822ba3ecb8670e461f73bb9021d5fd76a4c56d9d4cd16bd1bba868'
      );
    });
  });

  describe('ExtractSchema', () => {
    it('test schema', () => {
      expect(token.generateSchema()).toEqual('bls12_381_g1');

      expect(token.generateSchema()).toEqual({
        __michelsonType: 'bls12_381_g1',
        schema: 'bls12_381_g1'
      });
    });
  });
});

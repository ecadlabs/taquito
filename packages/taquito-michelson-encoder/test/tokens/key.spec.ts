import { KeyToken, KeyValidationError } from '../../src/tokens/key';

describe('Key token', () => {
  let token: KeyToken;
  beforeEach(() => {
    token = new KeyToken({ prim: 'key', args: [], annots: [] }, 0, null as any);
  });

  describe('EncodeObject', () => {
    it('Should encode address to string', () => {
      expect(token.EncodeObject('edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g')).toEqual({
        string: 'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g',
      });
    });

    it('Should throw a validation error when address is not valid', () => {
      expect(() => token.EncodeObject('test')).toThrowError(KeyValidationError);
      expect(() => token.EncodeObject('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn')).toThrowError(
        KeyValidationError
      );
      expect(() => token.EncodeObject(0)).toThrowError(KeyValidationError);
      expect(() => token.EncodeObject([])).toThrowError(KeyValidationError);
    });
  });

  describe('Encode', () => {
    it('Should encode key to string', () => {
      expect(token.Encode(['edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g'])).toEqual({
        string: 'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g',
      });
    });

    it('Should throw a validation error when address is not valid', () => {
      expect(() => token.Encode(['test'])).toThrowError(KeyValidationError);
      expect(() => token.Encode(['tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn'])).toThrowError(
        KeyValidationError
      );

      try {
        token.Encode(['test']);
      } catch (ex) {
        expect(ex.name).toEqual('KeyValidationError');
      }
    });
  });
});

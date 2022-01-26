import { KeyHashToken, KeyHashValidationError } from '../../src/tokens/comparable/key_hash';

describe('KeyHash token', () => {
  let token: KeyHashToken;
  beforeEach(() => {
    token = new KeyHashToken({ prim: 'key_hash', args: [], annots: [] }, 0, null as any);
  });

  describe('EncodeObject', () => {
    it('Should encode address to string', () => {
      expect(token.EncodeObject('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn')).toEqual({
        string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
      });
    });

    it('Should throw a validation error when address is not valid', () => {
      expect(() => token.EncodeObject('test')).toThrowError(KeyHashValidationError);
      expect(() => token.EncodeObject('KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D')).toThrowError(
        'KeyHash is not valid: KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D'
      );
      expect(() => token.EncodeObject(0)).toThrowError(KeyHashValidationError);
      expect(() => token.EncodeObject([])).toThrowError(KeyHashValidationError);
    });
  });

  describe('Encode', () => {
    it('Should encode address to string', () => {
      expect(token.Encode(['tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn'])).toEqual({
        string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
      });
    });

    it('Should throw a validation error when address is not valid', () => {
      expect(() => token.Encode(['test'])).toThrowError(KeyHashValidationError);

      try {
        token.Encode(['test']);
      } catch (ex) {
        expect(ex.name).toEqual('KeyHashValidationError');
      }
    });
  });

  describe('generateSchema', () => {
    it('Should generate the schema properly', () => {
      expect(token.generateSchema()).toEqual({
        __michelsonType: 'key_hash',
        schema: 'key_hash',
      });
    });
  });
});

import { AddressToken, AddressValidationError } from '../../src/tokens/comparable/address';

describe('Address token', () => {
  let token: AddressToken;
  beforeEach(() => {
    token = new AddressToken({ prim: 'address', args: [], annots: [] }, 0, null as any);
  });

  describe('EncodeObject', () => {
    it('Should encode address to string', () => {
      expect(token.EncodeObject('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn')).toEqual({
        string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
      });
    });

    it('Should throw a validation error when address is not valid', () => {
      expect(() => token.EncodeObject('test')).toThrowError(AddressValidationError);
      expect(() => token.EncodeObject(0)).toThrowError(AddressValidationError);
      expect(() => token.EncodeObject([])).toThrowError(AddressValidationError);
    });
  });

  describe('Encode', () => {
    it('Should encode address to string', () => {
      expect(token.Encode(['tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn'])).toEqual({
        string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
      });
    });

    it('Should throw a validation error when address is not valid', () => {
      expect(() => token.Encode(['test'])).toThrowError(AddressValidationError);

      try {
        token.Encode(['test']);
      } catch (ex) {
        expect(ex.name).toEqual('AddressValidationError');
      }
    });
  });

  describe('generateSchema', () => {
    it('Should generate the schema properly', () => {
      expect(token.generateSchema()).toEqual({
        __michelsonType: 'address',
        schema: 'address',
      });
    });
  });
});

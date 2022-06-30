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
describe('Address Token with txr1', () => {
  let token: AddressToken;
  beforeEach(() => {
    token = new AddressToken({ prim: 'address', args: [], annots: [] }, 0, null as any);
  });

  describe('test ToBigMapKey', () => {
    it('to bytes', () => {
      expect(token.ToBigMapKey('txr1MfFbj6diPLS2MN2ntoid6cyuk4mUzLibP')).toEqual({
        key: { bytes: '02012e7a294c836eeb02010b907c2632b88ed3e23a00' },
        type: { prim: 'bytes' },
      });
    });
  });

  describe('EncodeObject', () => {
    it("should add string to object with key 'string'", () => {
      expect(token.EncodeObject('txr1XHHx4KH3asGN5CMpdqzQA3c7HkfniPRxL')).toEqual({
        string: 'txr1XHHx4KH3asGN5CMpdqzQA3c7HkfniPRxL',
      });
    });

    it('test semantic', () => {
      const val1 = token.EncodeObject('txr1XHHx4KH3asGN5CMpdqzQA3c7HkfniPRxL', {
        address: () => ({ string: 'tester' }),
      });
      const val2 = token.EncodeObject('txr1XHHx4KH3asGN5CMpdqzQA3c7HkfniPRxL', {
        address: (arg) => ({ string: arg }),
      });
      expect(val1).toEqual({ string: 'tester' });
      expect(val2).toEqual({ string: 'txr1XHHx4KH3asGN5CMpdqzQA3c7HkfniPRxL' });
    });

    it('should throw error with invalid args', () => {
      expect(() => token.EncodeObject('txr1')).toThrowError(AddressValidationError);
      expect(() => token.EncodeObject([])).toThrowError(AddressValidationError);
      expect(() => token.EncodeObject({})).toThrowError(AddressValidationError);
      expect(() => token.EncodeObject(1)).toThrowError(AddressValidationError);
      expect(() => token.EncodeObject('tz4QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn')).toThrowError(
        AddressValidationError
      );
    });
  });

  describe('Encode', () => {
    it('should encode address to object with key "string"', () => {
      expect(token.Encode(['txr1XHHx4KH3asGN5CMpdqzQA3c7HkfniPRxL'])).toEqual({
        string: 'txr1XHHx4KH3asGN5CMpdqzQA3c7HkfniPRxL',
      });
    });
    it('should throw error if address not valid', () => {
      expect(() => token.Encode(['something'])).toThrowError(AddressValidationError);
      expect(() => token.Encode(['', '', '', ''])).toThrowError(AddressValidationError);
      expect(() => token.Encode([])).toThrowError(AddressValidationError);
      expect(() => token.Encode(['1'])).toThrowError(AddressValidationError);
      try {
        token.Encode(['async']);
      } catch (ex) {
        expect(ex.name).toEqual('AddressValidationError');
      }
    });
  });
  describe('generateSchema', () => {
    it('should generate properly', () => {
      expect(token.generateSchema()).toEqual({
        __michelsonType: 'address',
        schema: 'address',
      });
    });
  });

  describe('Execute', () => {
    it('should throw if no bytes or string', () => {
      expect(() => token.Execute({ string: '', bytes: '' })).toThrowError(AddressValidationError);
    });
    it('should return string', () => {
      expect(token.Execute({ string: 'txr1XHHx4KH3asGN5CMpdqzQA3c7HkfniPRxL', bytes: '' })).toEqual(
        'txr1XHHx4KH3asGN5CMpdqzQA3c7HkfniPRxL'
      );
      expect(
        token.Execute({ bytes: '02f16e732d45ba6f24d5ec421f20ab199b3a82907100', string: '' })
      ).toEqual('txr1jZaQfi9zdwzJteYkRBSN9D7RDvMh1QNkL');
    });
  });
  describe('Tokey', () => {
    it('should change bytes to pkh', () => {
      expect(token.ToKey({ bytes: '02012e7a294c836eeb02010b907c2632b88ed3e23a00' })).toEqual(
        'txr1MfFbj6diPLS2MN2ntoid6cyuk4mUzLibP'
      );
      expect(token.ToKey({ string: 'txr1XHHx4KH3asGN5CMpdqzQA3c7HkfniPRxL' })).toEqual(
        'txr1XHHx4KH3asGN5CMpdqzQA3c7HkfniPRxL'
      );
    });
    it('throw error if empty', () => {
      expect(() => token.ToKey({ bytes: '', string: '' })).toThrowError(AddressValidationError);
    });
  });
  describe('compare', () => {
    it('should order addresses correctly', () => {
      expect(
        token.compare(
          'KT1CDEg2oY3VfMa1neB7hK5LoVMButvivKYv',
          'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD'
        )
      ).toEqual(1);
      expect(
        token.compare(
          'tz3YjfexGakCDeCseXFUpcXPSAN9xHxE9TH2',
          'tz1ccqAEwfPgeoipnXtjAv1iucrpQv3DFmmS'
        )
      ).toEqual(1);
      expect(
        token.compare(
          'KT1CDEg2oY3VfMa1neB7hK5LoVMButvivKYv',
          'KT1XM8VUFBiM9AC5czWU15fEeE9nmuEYWt3Y'
        )
      ).toEqual(-1);
      expect(
        token.compare(
          'txr1YpFMKsYwTJ4YBmYqy2kw4pxCUgeQkZmwo',
          'txr1YpFMKsYwTJ4YBmYqy2kw4pxCUgeQkZmwo'
        )
      ).toEqual(0);
    });
  });
  describe('find return tokens', () => {
    it('should return or not return token', () => {
      expect(token.findAndReturnTokens('address', [])).toEqual([token]);
      expect(token.findAndReturnTokens('tx_rollup_l2_address', [])).toEqual([]);
    });
  });
});

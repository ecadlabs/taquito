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

  describe('compare', () => {
    it('Should compare addresses properly', () => {
      expect(token.compare("tz1VqAq7XGziEcee4Y4kdVG9XxxJ1r9BmThV", "tz1M8SnwGFB7Hnxgq6rCeyx3aiheyH6b6UMJ")).toEqual(1);
      expect(token.compare("tz1hu55Z7gPjyGKLTP2kzrBU1NhU76u2jJdx", "tz1VWnvuvhd5hQrX1xCgC9aPhKpDfLDNsetr")).toEqual(1);
      expect(token.compare("tz1VkT3u3Cpha5sZof3xJviHuRGugJDhpGET", "tz1b8nu4TNAFhn8wXpDjfvZeeT9P8DdqDFsW")).toEqual(-1);
      expect(token.compare("tz1hyxDxcaZuNmoqYEQUqdatSLwfdBhX9x61", "tz1Xbi5kVw3iYvrcSegLWSDaRJkLSz31XE8f")).toEqual(1);
      expect(token.compare("tz1PgiGQ2Bcg1FNBPdxxJdAJJ267FeQA78PF", "tz1geFsjAFibHEHypZyCmiGxkNpbyyyArtzs")).toEqual(-1);
      expect(token.compare("tz2NjNtMdj6KeJNrnnctxPjMWgMZ6EozF4G8", "tz2Cv3bEm12m8M5he5rEHiGmeM5dz5Dt6Cn1")).toEqual(1);
      expect(token.compare("tz2EPzvK7JPEz5cwpQ5Q5eFCaFA5FSbQzTrD", "tz2LjZSckDHtnTrM4i4zTReQ81cJS8Ufmfpd")).toEqual(-1);
      expect(token.compare("tz2LRCiqdRDt82sY7z1m7T2Nxz35Kq9dsCF4", "tz2KAgSUucoJwiaVo8fJ5Z1Xu8JRnpcs8Q3C")).toEqual(1);
      expect(token.compare("tz2SkvMjNH9pBaQG3N5vNBnsUykHVLxqmeQc", "tz2TPznBauRz2RSvWqSCvfL9aRjgURYikXxt")).toEqual(-1);
      expect(token.compare("tz2Fs1PNZivSmaCRLDnDSAx9uA2a5LbyPiPs", "tz2ChnSybBcDTv7xxiKkH2WumCtv9UTS7hSU")).toEqual(1);
      expect(token.compare("tz4S6JfUusG7pvmWyPyUBUrJRhHaZeFB32zc", "tz4QjLEb91k82QGhasmcgAzBoyiay5vLMgye")).toEqual(1);
      expect(token.compare("tz4NFi9HLqcRaGPcaPJbonuzK37d7B76Kjgg", "tz4PEwe6H7cQG9Ce5nSHZcXvkXygJZTs3um7")).toEqual(-1);
      expect(token.compare("tz4Hmxm1ULZcAwEfRw9bAX8czv5JCpKx3AE5", "tz4HBNXtBfqecLsAxEi9bHwvRMFqAcx3SCAz")).toEqual(1);
      expect(token.compare("tz4XKRGpf8N2xDL9LbET8SzAMr1PawzqCmq1", "tz4HHJU6Yk89socL7mLemSaDbnZ5fvh8QWK8")).toEqual(1);
      expect(token.compare("tz4GcUCNYK6MFhQ7xTBsGZWb15zN6tFXfHaZ", "tz4VvT1RjUpT7Ebec8jTDrqNwqTRZU8X3QnM")).toEqual(-1);
      expect(token.compare("tz2Cv3bEm12m8M5he5rEHiGmeM5dz5Dt6Cn1", "tz1M8SnwGFB7Hnxgq6rCeyx3aiheyH6b6UMJ")).toEqual(1);
      expect(token.compare("tz3PUX8Kt8x8yxBYePcPcunvcA1U7x4vVX4G", "tz2Cv3bEm12m8M5he5rEHiGmeM5dz5Dt6Cn1")).toEqual(1);
      expect(token.compare("tz4QjLEb91k82QGhasmcgAzBoyiay5vLMgye", "tz3PUX8Kt8x8yxBYePcPcunvcA1U7x4vVX4G")).toEqual(1);

      expect(token.compare("tz1ddb9NMYHZi5UzPdzTZMYQQZoMub195zgv", "KT1SwbTqhSKF6Pdokiu1K4Fpi17ahPPzmt1X")).toEqual(-1);
      expect(token.compare("KT1SwbTqhSKF6Pdokiu1K4Fpi17ahPPzmt1X", "sr19LCYLxPx91U7dPuWBMdLyYKdFzGwebPPP")).toEqual(-1);
    });
  });
});

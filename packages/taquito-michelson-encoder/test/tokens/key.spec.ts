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

  describe('ToKey', () => {
    it('Should transform Michelson bytes data to a key of type string', () => {
      expect(
        token.ToKey({ bytes: '00ebcf82872f4942052704e95dc4bfa0538503dbece27414a39b6650bcecbff896' })
      ).toEqual('edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g');
    });
  });

  describe('ToBigMapKey', () => {
    it('Should transform key of type string to a Michelson big map key', () => {
      expect(token.ToBigMapKey('edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g')).toEqual({
        key: { string: 'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g' },
        type: { prim: 'key' },
      });
    });
  });

  describe('compare', () => {
    it('Should compare public keys properly', () => {
      expect(
        token.compare(
          'edpktt7qGsHLPTdZHtKACLDrwDNn6P9kdaZ5cJmh5BuDnQmtNSVg3M',
          'edpkv45Zphyki6fphgUHRnp8ZS7J8qsMocD2eEBZfn9oxHzGhiskRT'
        )
      ).toEqual(-1);
      expect(
        token.compare(
          'edpkubTr4khcuFgtgyepc5fujptyKNwMvJWyYv1QQpXusv6W2B7chH',
          'edpktfxffffmmR9FjgCs8RiixADdxWDdU4NCXVfLat6aHuegT66Lh3'
        )
      ).toEqual(1);
      expect(
        token.compare(
          'edpkuaxea9wnUH1Jtdfr5xoPXGNeUiShhwfmNKARcFkNBR4c16S6Yz',
          'edpku9vgCjrnHWLTKAdau4vsSyUwkcmmaRiUJgVgUyth2XD1HaC2b4'
        )
      ).toEqual(1);
      expect(
        token.compare(
          'edpku2UaZ18rR7zKrmQwMCy7tWfSyugTes2o5dkJkQxPSejfFCpdii',
          'edpkuwqjKg2KjdFwyhpiDZidHrJfHq1LfA2MQuLEdZTVg41pTm6xAX'
        )
      ).toEqual(-1);
      expect(
        token.compare(
          'edpku4ZSucrVyATVxm2Hc5fbxKtbry3HBWGpQAhAyw9HcsFCQwzmgA',
          'edpkuhrXfwCYPUWcPrxg7kUodvhjWWW9M1Jg9Z9UHStgDEHzPATsDE'
        )
      ).toEqual(-1);
      expect(
        token.compare(
          'sppk7bujVhCRWzawXHK9wC5RpiHRob1s62YR9x4bNBbiHaSMDeENsuF',
          'sppk7bNScBLCkKA3gQWEn6fof1TgA1yVvD6WyzEaWXEtpzQDJuLaiWc'
        )
      ).toEqual(1);
      expect(
        token.compare(
          'sppk7c3assGEfswWeUcndtCbgc2eDCW5ztSR1wfEPBkHDXRWnnxzZ63',
          'sppk7caP7gcEknYXBPp3zT657pDCFCnu4uzvEExMD5ZPTW633wX18js'
        )
      ).toEqual(-1);
      expect(
        token.compare(
          'sppk7bfotoBsyBBzzCH6J38pNG23AFiQvN6bsYSq55VdQHjrTViZB23',
          'sppk7ctTtrwR1WoX8BeQVNVSmBRA14GnkdFggP74uTscRoBpdbPs1ty'
        )
      ).toEqual(-1);
      expect(
        token.compare(
          'sppk7ZxoRiZgLFb4ofUvkBXz6WJDQnkyyiazSi86BpYdkrT7tRpRQRT',
          'sppk7bKY5SKBKwduzUqMShuRH1hci2qThDwLor5c1jKHP4zzUM89abp'
        )
      ).toEqual(-1);
      expect(
        token.compare(
          'sppk7aJFnNwT41KTTf2XXLwWJUEK7rqHUkSDc2KBz2k28k5sE3rCALC',
          'sppk7dAUAfvBwb4KjU6zE66itc5AwCkxHHxEiYbVb1uAi7PYBiT59y1'
        )
      ).toEqual(-1);
      expect(
        token.compare(
          'BLpk1w3urTgb1QJskQe8B9Tv2d7PiJi63HGo5XcPA9StafezaBijDVxAi8McfYWKptQrRoTvyhmZ',
          'BLpk1pNZeF2EzDxN5HekTDfwqdXhJDyiPXGL3eXo3jtXLXfGcccdFTg6QNwyVBsi5ApKQYWWCEqT'
        )
      ).toEqual(1);
      expect(
        token.compare(
          'BLpk1xeqZcZ8Rz7rMzJXSzjstRHGJpuv2A9SCJmBG9WZ5E4XrjUv3DBDa2J271y8aDdrEy6WgUvf',
          'BLpk1uf9G9N38KkG58iNRfqzjnACrKiQ8brJv9PVzGdhhuiqXWu6wdKSkmF7rXDhPGbBQFpArGyf'
        )
      ).toEqual(1);
      expect(
        token.compare(
          'BLpk1tYvtGix5PBju1Trpz63Ezuuocvf1dw1cvXPdToHNGFs8brqpmF2hw44cs9xqfRAsDW5JWRE',
          'BLpk1wdswKAQynswErddqDxjsMkhg3n5i2Qgn8XTBYCrfuvwdeQDR7GvbwQPPS2q2pBiw5mcatRF'
        )
      ).toEqual(-1);
      expect(
        token.compare(
          'BLpk1wKC8QjyZ8YH4sJ55ZKg5o9pEqkJF8jaWqmvkLghoVxQu9zaPVYdsLAYmBushzfhnczJrrVp',
          'BLpk1vJqHuKCdAuBtP7GDYJwLAdm2uvfENz48cEpZRDHq8xkFKNBg4aGeofWxtx8tN5SfrYs1WHG'
        )
      ).toEqual(1);
      expect(
        token.compare(
          'BLpk1nKVbygxgq6FdH9LGqpAaBMrdftQJuSAr1JvCJrsuewPGDLvrvqgxMSawg669ATM4F4hL29Z',
          'BLpk1oPdW8e1FM15AikesALbFoBwDNvFdrnHc2pLnZ6wYL6WAH2ioNMTHF2febHFscdD5MGfZQKj'
        )
      ).toEqual(-1);
      expect(
        token.compare(
          'sppk7bNScBLCkKA3gQWEn6fof1TgA1yVvD6WyzEaWXEtpzQDJuLaiWc',
          'edpkv45Zphyki6fphgUHRnp8ZS7J8qsMocD2eEBZfn9oxHzGhiskRT'
        )
      ).toEqual(1);
      expect(
        token.compare(
          'p2pk68TMwUNx5PzFKaSrDmc7wdEaTENBFvTYFHJdTej5Uoct3ZBgaaw',
          'sppk7bNScBLCkKA3gQWEn6fof1TgA1yVvD6WyzEaWXEtpzQDJuLaiWc'
        )
      ).toEqual(1);
      expect(
        token.compare(
          'BLpk1pNZeF2EzDxN5HekTDfwqdXhJDyiPXGL3eXo3jtXLXfGcccdFTg6QNwyVBsi5ApKQYWWCEqT',
          'p2pk68TMwUNx5PzFKaSrDmc7wdEaTENBFvTYFHJdTej5Uoct3ZBgaaw'
        )
      ).toEqual(-1);
    });
  });

  describe('generateSchema', () => {
    it('Should generate the schema properly', () => {
      expect(token.generateSchema()).toEqual({
        __michelsonType: 'key',
        schema: 'key',
      });
    });
  });
});

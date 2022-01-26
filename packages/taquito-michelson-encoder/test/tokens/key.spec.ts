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
    it('Should compare key properly', () => {
      // edpk... and edpk... -> Alphabetical comparison
      // sppk... and sppk... -> Alphabetical comparison
      // p2pk... and p2pk... -> Bytes comparison starting from the 5th byte: [3, 178, 139, 127, x, <start> b1, b2, ..., bn <end>]

      expect(
        token.compare(
          'edpkuNjKKT48xBoT5asPrWdmuM1Yw8D93MwgFgVvtca8jb5pstzaCh',
          'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g'
        )
      ).toEqual(-1);
      expect(
        token.compare(
          'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g',
          'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g'
        )
      ).toEqual(0);
      expect(
        token.compare(
          'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g',
          'edpkuNjKKT48xBoT5asPrWdmuM1Yw8D93MwgFgVvtca8jb5pstzaCh'
        )
      ).toEqual(1);
      expect(
        token.compare(
          'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g',
          'sppk7aTKnmX5WV17KPo3LanjfPLoXTuNjkQTdLx2bYDqHPLVVCbSwoj'
        )
      ).toEqual(-1);
      expect(
        token.compare(
          'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g',
          'p2pk67c5b5THCj5fyksX1C13etdUpLR9BDYvJUuJNrxeGqCgbY3NFpV'
        )
      ).toEqual(-1);

      expect(
        token.compare(
          'sppk7aTKnmX5WV17KPo3LanjfPLoXTuNjkQTdLx2bYDqHPLVVCbSwoj',
          'sppk7aVdgAmezMCRTcHciVkVZoGNnhSdKEYcn5pYaqt4PvLjgFbLRxo'
        )
      ).toEqual(-1);
      expect(
        token.compare(
          'sppk7aTKnmX5WV17KPo3LanjfPLoXTuNjkQTdLx2bYDqHPLVVCbSwoj',
          'sppk7aTKnmX5WV17KPo3LanjfPLoXTuNjkQTdLx2bYDqHPLVVCbSwoj'
        )
      ).toEqual(0);
      expect(
        token.compare(
          'sppk7aVdgAmezMCRTcHciVkVZoGNnhSdKEYcn5pYaqt4PvLjgFbLRxo',
          'sppk7aTKnmX5WV17KPo3LanjfPLoXTuNjkQTdLx2bYDqHPLVVCbSwoj'
        )
      ).toEqual(1);
      expect(
        token.compare(
          'sppk7aTKnmX5WV17KPo3LanjfPLoXTuNjkQTdLx2bYDqHPLVVCbSwoj',
          'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g'
        )
      ).toEqual(1);
      expect(
        token.compare(
          'sppk7aTKnmX5WV17KPo3LanjfPLoXTuNjkQTdLx2bYDqHPLVVCbSwoj',
          'p2pk65shUHKhx7zUSF7e8KZ2inmQ5aMS4jRBUmK6aCis4oaHoiWPXoT'
        )
      ).toEqual(-1);

      expect(
        token.compare(
          'p2pk67c5b5THCj5fyksX1C13etdUpLR9BDYvJUuJNrxeGqCgbY3NFpV',
          'p2pk65shUHKhx7zUSF7e8KZ2inmQ5aMS4jRBUmK6aCis4oaHoiWPXoT'
        )
      ).toEqual(-1);
      expect(
        token.compare(
          'p2pk65shUHKhx7zUSF7e8KZ2inmQ5aMS4jRBUmK6aCis4oaHoiWPXoT',
          'p2pk65shUHKhx7zUSF7e8KZ2inmQ5aMS4jRBUmK6aCis4oaHoiWPXoT'
        )
      ).toEqual(0);
      expect(
        token.compare(
          'p2pk65shUHKhx7zUSF7e8KZ2inmQ5aMS4jRBUmK6aCis4oaHoiWPXoT',
          'p2pk67c5b5THCj5fyksX1C13etdUpLR9BDYvJUuJNrxeGqCgbY3NFpV'
        )
      ).toEqual(1);
      expect(
        token.compare(
          'p2pk66xmhjiN7LpfrDGFwpxPtJxkLtPjQ6HUxJbKmRbxSR7RMpamDwi',
          'p2pk67c5b5THCj5fyksX1C13etdUpLR9BDYvJUuJNrxeGqCgbY3NFpV'
        )
      ).toEqual(-1);
      expect(
        token.compare(
          'p2pk67c5b5THCj5fyksX1C13etdUpLR9BDYvJUuJNrxeGqCgbY3NFpV',
          'p2pk66xmhjiN7LpfrDGFwpxPtJxkLtPjQ6HUxJbKmRbxSR7RMpamDwi'
        )
      ).toEqual(1);
      expect(
        token.compare(
          'p2pk65shUHKhx7zUSF7e8KZ2inmQ5aMS4jRBUmK6aCis4oaHoiWPXoT',
          'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g'
        )
      ).toEqual(1);
      expect(
        token.compare(
          'p2pk65shUHKhx7zUSF7e8KZ2inmQ5aMS4jRBUmK6aCis4oaHoiWPXoT',
          'sppk7aTKnmX5WV17KPo3LanjfPLoXTuNjkQTdLx2bYDqHPLVVCbSwoj'
        )
      ).toEqual(1);
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

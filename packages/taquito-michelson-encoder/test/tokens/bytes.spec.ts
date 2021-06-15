import { BytesToken, BytesValidationError } from '../../src/tokens/comparable/bytes';

describe('Bytes token', () => {
  let token: BytesToken;
  beforeEach(() => {
    token = new BytesToken({ prim: 'bytes', args: [], annots: [] }, 0, null as any);
  });

  describe('EncodeObject', () => {
    it('Should encode bytes string to bytes', () => {
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

    it('Should throw a validation error when bytes are not valid', () => {
      expect(() => token.EncodeObject('test')).toThrowError(BytesValidationError);
      expect(() => token.EncodeObject('0')).toThrowError(BytesValidationError);
    });
  });

  describe('Encode', () => {
    it('Should encode address to bytes', () => {
      expect(token.Encode(['1234'])).toEqual({
        bytes: '1234',
      });
    });

    it('Should encode Uint8Array to bytes', () => {
      const uint8 = new Uint8Array([115, 2, 65]);
      expect(token.Encode([uint8])).toEqual({
        bytes: '730241',
      });
    });

    it('Should throw a validation error when address is not valid', () => {
      expect(() => token.Encode(['test'])).toThrowError(BytesValidationError);

      try {
        token.Encode(['test']);
      } catch (ex) {
        expect(ex.name).toEqual('BytesValidationError');
      }
    });
  });
});

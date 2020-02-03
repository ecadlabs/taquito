import { createToken } from '../../src/tokens/createToken';
import { OrToken } from '../../src/tokens/or';

describe('Or token', () => {
  let token: OrToken;
  let annotToken: OrToken;
  beforeEach(() => {
    token = createToken(
      { prim: 'or', args: [{ prim: 'int' }, { prim: 'string' }], annots: [] },
      0
    ) as OrToken;
    annotToken = createToken(
      {
        prim: 'or',
        args: [
          { prim: 'int', annots: ['key1'] },
          { prim: 'string', annots: ['key2'] },
        ],
        annots: [],
      },
      0
    ) as OrToken;
  });

  describe('EncodeObject', () => {
    it('Should encode object using object property as key', () => {
      expect(token.EncodeObject({ 0: 0 })).toEqual({ prim: 'Left', args: [{ int: '0' }] });
      expect(token.EncodeObject({ 1: 'test' })).toEqual({
        prim: 'Right',
        args: [{ string: 'test' }],
      });

      expect(annotToken.EncodeObject({ key1: 0 })).toEqual({ prim: 'Left', args: [{ int: '0' }] });
      expect(annotToken.EncodeObject({ key2: 'test' })).toEqual({
        prim: 'Right',
        args: [{ string: 'test' }],
      });
    });
  });

  describe('Encode', () => {
    it('Should encode list using the last element as a key', () => {
      expect(token.Encode(['3', 0])).toEqual({ prim: 'Left', args: [{ int: '3' }] });
      expect(token.Encode(['test', '1'])).toEqual({ prim: 'Right', args: [{ string: 'test' }] });

      expect(annotToken.Encode(['3', 'key1'])).toEqual({ prim: 'Left', args: [{ int: '3' }] });
      expect(annotToken.Encode(['test', 'key2'])).toEqual({
        prim: 'Right',
        args: [{ string: 'test' }],
      });
    });
  });

  describe('Execute', () => {
    it('Should parse storage properly', () => {
      expect(token.Execute({ prim: 'Left', args: [{ int: '3' }] })[0].toString()).toEqual('3');
      expect(token.Execute({ prim: 'Right', args: [{ string: 'test' }] })).toEqual('test');
    });
  });
});

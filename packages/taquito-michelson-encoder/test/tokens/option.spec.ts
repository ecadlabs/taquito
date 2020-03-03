import { OptionToken } from '../../src/tokens/option';
import { createToken } from '../../src/tokens/createToken';
import { UnitValue } from '../../src/taquito-michelson-encoder';

describe('Option token', () => {
  let token: OptionToken;
  let unitToken: OptionToken;
  beforeEach(() => {
    token = createToken({ prim: 'option', args: [{ prim: 'int' }], annots: [] }, 0) as OptionToken;
    unitToken = createToken(
      { prim: 'option', args: [{ prim: 'unit' }], annots: [] },
      0
    ) as OptionToken;
  });

  describe('EncodeObject', () => {
    it('Should encode number to string', () => {
      expect(token.EncodeObject(0)).toEqual({ prim: 'Some', args: [{ int: '0' }] });
      expect(token.EncodeObject(1000)).toEqual({ prim: 'Some', args: [{ int: '1000' }] });
      expect(unitToken.EncodeObject(UnitValue)).toEqual({ prim: 'Some', args: [{ prim: 'Unit' }] });
    });

    it('Should encode to None when null', () => {
      expect(token.EncodeObject(null)).toEqual({ prim: 'None' });
      expect(unitToken.EncodeObject(null)).toEqual({ prim: 'None' });
    });

    it('Should encode to None when undefined', () => {
      expect(token.EncodeObject(undefined)).toEqual({ prim: 'None' });
      expect(unitToken.EncodeObject(undefined)).toEqual({ prim: 'None' });
    });
  });

  describe('Encode', () => {
    it('Should encode number to string', () => {
      expect(token.Encode([0])).toEqual({ prim: 'Some', args: [{ int: '0' }] });
      expect(token.Encode([1000])).toEqual({ prim: 'Some', args: [{ int: '1000' }] });
      expect(unitToken.Encode([UnitValue])).toEqual({ prim: 'Some', args: [{ prim: 'Unit' }] });
    });

    it('Should encode to None when null', () => {
      expect(token.Encode([null])).toEqual({ prim: 'None' });
      expect(unitToken.Encode([null])).toEqual({ prim: 'None' });
    });

    it('Should encode to None when undefined', () => {
      expect(token.Encode([undefined])).toEqual({ prim: 'None' });
      expect(unitToken.Encode([undefined])).toEqual({ prim: 'None' });
    });
  });

  describe('Execute', () => {
    it('Should execute on Some michelson value', () => {
      expect(token.Execute({ prim: 'Some', args: [{ int: '0' }] }).toString()).toEqual('0');
      expect(token.Execute({ prim: 'Some', args: [{ int: '1000' }] }).toString()).toEqual('1000');
      expect(unitToken.Execute({ prim: 'Some', args: [{ prim: 'Unit' }] })).toEqual(UnitValue);
    });

    it('Should execute on None michelson value', () => {
      expect(token.Execute({ prim: 'None' })).toEqual(null);
      expect(token.Execute({ prim: 'None' })).toEqual(null);
      expect(unitToken.Execute({ prim: 'None' })).toEqual(null);
    });
  });
});

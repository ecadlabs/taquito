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

  describe('Compare', () => {
    it('Should compare values properly', () => {
      expect(token.compare(2, 12)).toEqual(-1);
      expect(token.compare(22, 2)).toEqual(1);
      expect(token.compare(null, 12)).toEqual(-1);
      expect(token.compare(22, null)).toEqual(1);
    });
  });

  describe('Tokey', () => {
    it('Should transform Michelson bytes data to a key of type string', () => {
      expect(token.ToKey({ prim: 'Some', args: [{ int: '4' }] }).toString()).toEqual('4');
    });
  });

  describe('ToBigMapKey', () => {
    it('Should transform option value to a Michelson big map key', () => {
      expect(token.ToBigMapKey(5)).toEqual({
        key: { prim: 'Some', args: [{ int: '5' }] },
        type: { prim: 'option', args: [{ prim: 'int' }] },
      });
    });
  });

  describe('generateSchema', () => {
    it('Should generate the schema properly', () => {
      expect(token.generateSchema()).toEqual({
        __michelsonType: 'option',
        schema: {
          __michelsonType: 'int',
          schema: 'int',
        },
      });
    });
  });
});

import { OptionToken } from '../../src/tokens/option';
import { createToken } from '../../src/tokens/createToken';
import { UnitValue } from '../../src/taquito-michelson-encoder';
import BigNumber from 'bignumber.js';

describe('Option token', () => {
  let token: OptionToken;
  let unitToken: OptionToken;
  let nestedToken: OptionToken;
  beforeEach(() => {
    token = createToken({ prim: 'option', args: [{ prim: 'int' }], annots: [] }, 0) as OptionToken;
    unitToken = createToken(
      { prim: 'option', args: [{ prim: 'unit' }], annots: [] },
      0
    ) as OptionToken;
    nestedToken = createToken(
      { prim: 'option', args: [{ prim: 'option', args: [{ prim: 'int' }] }], annots: [] },
      0
    ) as OptionToken;
  });

  describe('EncodeObject', () => {
    it('Should encode number to string', () => {
      expect(token.EncodeObject(0)).toEqual({ prim: 'Some', args: [{ int: '0' }] });
      expect(token.EncodeObject(1000)).toEqual({ prim: 'Some', args: [{ int: '1000' }] });
      expect(unitToken.EncodeObject(UnitValue)).toEqual({ prim: 'Some', args: [{ prim: 'Unit' }] });
      expect(nestedToken.EncodeObject(10)).toEqual({
        prim: 'Some',
        args: [{ prim: 'Some', args: [{ int: '10' }] }],
      });
      expect(nestedToken.EncodeObject([10])).toEqual({
        prim: 'Some',
        args: [{ prim: 'Some', args: [{ int: '10' }] }],
      });
      expect(nestedToken.EncodeObject({ Some: 10 })).toEqual({
        prim: 'Some',
        args: [{ prim: 'Some', args: [{ int: '10' }] }],
      });
    });

    it('Should encode to None when null', () => {
      expect(token.EncodeObject(null)).toEqual({ prim: 'None' });
      expect(unitToken.EncodeObject(null)).toEqual({ prim: 'None' });
      expect(nestedToken.EncodeObject(null)).toEqual({ prim: 'None' });
    });

    it('Should encode to None when undefined', () => {
      expect(token.EncodeObject(undefined)).toEqual({ prim: 'None' });
      expect(unitToken.EncodeObject(undefined)).toEqual({ prim: 'None' });
      expect(nestedToken.EncodeObject(undefined)).toEqual({ prim: 'None' });
    });

    it('Should encode to Some(None) when { Some: null }', () => {
      expect(nestedToken.EncodeObject({ Some: null })).toEqual({
        prim: 'Some',
        args: [{ prim: 'None' }],
      });
    });
  });

  describe('Encode', () => {
    it('Should encode number to string', () => {
      expect(token.Encode([0])).toEqual({ prim: 'Some', args: [{ int: '0' }] });
      expect(token.Encode([1000])).toEqual({ prim: 'Some', args: [{ int: '1000' }] });
      expect(unitToken.Encode([UnitValue])).toEqual({ prim: 'Some', args: [{ prim: 'Unit' }] });
      expect(nestedToken.Encode([10])).toEqual({
        prim: 'Some',
        args: [{ prim: 'Some', args: [{ int: '10' }] }],
      });
    });

    it('Should encode to None when null', () => {
      expect(token.Encode([null])).toEqual({ prim: 'None' });
      expect(unitToken.Encode([null])).toEqual({ prim: 'None' });
      expect(nestedToken.Encode([null])).toEqual({ prim: 'None' });
    });

    it('Should encode to None when undefined', () => {
      expect(token.Encode([undefined])).toEqual({ prim: 'None' });
      expect(unitToken.Encode([undefined])).toEqual({ prim: 'None' });
      expect(nestedToken.Encode([undefined])).toEqual({ prim: 'None' });
    });
  });

  describe('Execute', () => {
    it('Should execute on Some michelson value', () => {
      expect(token.Execute({ prim: 'Some', args: [{ int: '0' }] })).toMatchObject({
        Some: new BigNumber(0),
      });
      expect(token.Execute({ prim: 'Some', args: [{ int: '1000' }] })).toMatchObject({
        Some: new BigNumber('1000'),
      });
      expect(unitToken.Execute({ prim: 'Some', args: [{ prim: 'Unit' }] })).toMatchObject({
        Some: UnitValue,
      });
      expect(
        nestedToken.Execute({ prim: 'Some', args: [{ prim: 'Some', args: [{ int: '10' }] }] })
      ).toMatchObject({ Some: { Some: new BigNumber(10) } });
    });

    it('Should execute on None michelson value', () => {
      expect(token.Execute({ prim: 'None' })).toEqual(null);
      expect(token.Execute({ prim: 'None' })).toEqual(null);
      expect(unitToken.Execute({ prim: 'None' })).toEqual(null);
      expect(nestedToken.Execute({ prim: 'None' })).toEqual(null);
    });

    it('Should execute on Some(None) michelson value', () => {
      expect(
        nestedToken.Execute({
          prim: 'Some',
          args: [{ prim: 'None' }],
        })
      ).toEqual({ Some: null });
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
      expect(token.ToKey({ prim: 'Some', args: [{ int: '4' }] })).toMatchObject({
        Some: new BigNumber(4),
      });
      expect(
        nestedToken.ToKey({ prim: 'Some', args: [{ prim: 'Some', args: [{ int: '10' }] }] })
      ).toMatchObject({ Some: { Some: new BigNumber(10) } });
    });
  });

  describe('ToBigMapKey', () => {
    it('Should transform option value to a Michelson big map key', () => {
      expect(token.ToBigMapKey(5)).toEqual({
        key: { prim: 'Some', args: [{ int: '5' }] },
        type: { prim: 'option', args: [{ prim: 'int' }] },
      });
      expect(nestedToken.ToBigMapKey({ Some: 10 })).toEqual({
        key: { prim: 'Some', args: [{ prim: 'Some', args: [{ int: '10' }] }] },
        type: { prim: 'option', args: [{ prim: 'option', args: [{ prim: 'int' }] }] },
      });
      expect(nestedToken.ToBigMapKey(10)).toEqual({
        key: { prim: 'Some', args: [{ prim: 'Some', args: [{ int: '10' }] }] },
        type: { prim: 'option', args: [{ prim: 'option', args: [{ prim: 'int' }] }] },
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

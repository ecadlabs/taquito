import { b58decodeRollup } from '@taquito/utils';
import { TxRollupL2AddressToken, TxRollupL2AddressValidationError } from './../../src/tokens/comparable/tx_rollup_l2_address';

describe("TxRollupL2Address Token", () => {
  let token: TxRollupL2AddressToken;
  const bytes = b58decodeRollup("tz49XoaXbDZcWi2R1iKxQUxtBWXt4g4S1qtf")
  beforeEach(() => {
    token = new TxRollupL2AddressToken({prim: "tx_rollup_l2_address", args: [], annots: []}, 0, null as any);
  });

  describe("test ToBigMapKey", () => {
    it("to email bytes", () => {
      expect(token.ToBigMapKey("tz49XoaXbDZcWi2R1iKxQUxtBWXt4g4S1qtf")).toEqual({key: {bytes}, type: {prim: 'bytes'}})
    })
  })

  describe("EncodeObject", () => {
    it('Should encode address to string', () => {
      expect(token.EncodeObject('tz49XoaXbDZcWi2R1iKxQUxtBWXt4g4S1qtf')).toEqual({
        string: 'tz49XoaXbDZcWi2R1iKxQUxtBWXt4g4S1qtf',
      });
    });

    it('test semantic', () => {
      const val = token.EncodeObject('tz49XoaXbDZcWi2R1iKxQUxtBWXt4g4S1qtf', {tx_rollup_l2_address: () => ({string: 'tester'})})
      const val2 = token.EncodeObject('tz49XoaXbDZcWi2R1iKxQUxtBWXt4g4S1qtf', {tx_rollup_l2_address: (arg) => ({string: arg})})
      expect(val).toEqual({string:'tester'})
      expect(val2).toEqual({string: 'tz49XoaXbDZcWi2R1iKxQUxtBWXt4g4S1qtf'})
    })

    it("Should throw a new validation error when address is not valid", () => {
      expect(() => token.EncodeObject("tz4").toThrowError(TxRollupL2AddressValidationError));
      expect(() => token.EncodeObject("tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn").toThrowError(TxRollupL2AddressValidationError));
      expect(() => token.EncodeObject(1).toThrowError(TxRollupL2AddressValidationError));
      expect(() => token.EncodeObject([]).toThrowError(TxRollupL2AddressValidationError));
    })
  })

  describe('Encode', () => {
    it('Should encode address to string', () => {
      expect(token.Encode(['tz49XoaXbDZcWi2R1iKxQUxtBWXt4g4S1qtf'])).toEqual({
        string: 'tz49XoaXbDZcWi2R1iKxQUxtBWXt4g4S1qtf',
      });
    });

    it('Should throw a validation error when address is not valid', () => {
      expect(() => token.Encode(['test'])).toThrowError(TxRollupL2AddressValidationError);
      expect(() => token.Encode([])).toThrowError(TxRollupL2AddressValidationError);
      expect(() => token.Encode(['', '' ,'' ,''])).toThrowError(TxRollupL2AddressValidationError);
      expect(() => token.Encode(["1"])).toThrowError(TxRollupL2AddressValidationError);

      try {
        token.Encode(['test']);
      } catch (ex) {
        expect(ex.name).toEqual('TxRollupL2AddressValidationError');
      }
    });
  });

  describe('generateSchema', () => {
    it('Should generate the schema properly', () => {
      expect(token.generateSchema()).toEqual({
        __michelsonType: 'tx_rollup_l2_address',
        schema: 'tx_rollup_l2_address'
      });
    });
  });
  describe('ToBigMapKey', () => {
    it("should equal expected", () => {
      expect(() => token.ToBigMapKey(''))
    })
  })
  describe('Execute', () => {
    it("should throw error if not bytes", () => {
      expect(() => token.Execute({string: ''})).toThrowError(TxRollupL2AddressValidationError)
      expect(() => token.Execute({bytes: ''})).toThrowError(TxRollupL2AddressValidationError)
      expect(() => token.Execute({bytes: '', string: ''})).toThrowError(TxRollupL2AddressValidationError)
    })
    it("should return string", () => {
      expect(token.Execute({bytes: '', string: 'tz49XoaXbDZcWi2R1iKxQUxtBWXt4g4S1qtf'})).toEqual("tz49XoaXbDZcWi2R1iKxQUxtBWXt4g4S1qtf")
    })
    it("should return string", () => {
      expect(token.Execute({bytes,})).toEqual("tz49XoaXbDZcWi2R1iKxQUxtBWXt4g4S1qtf")
    })
  })
  describe('ToKey', () => {
    it("tz4 address should be returned", () => {
      expect(token.ToKey({bytes})).toEqual("tz49XoaXbDZcWi2R1iKxQUxtBWXt4g4S1qtf")
      expect(token.ToKey({string: "tz49XoaXbDZcWi2R1iKxQUxtBWXt4g4S1qtf"})).toEqual("tz49XoaXbDZcWi2R1iKxQUxtBWXt4g4S1qtf")

    })
    it("should throw error when incorrect provided", () => {
      expect(() => token.ToKey({bytes: ""})).toThrowError(TxRollupL2AddressValidationError)
    })
  })
  describe('extract schema', () => {
    it("should be prim value of token", () => {
      expect(token.ExtractSchema()).toEqual("tx_rollup_l2_address")
    })
  })
  describe('find return tokens', () => {
    it("should return array with prim of this token", () => {
      expect(token.findAndReturnTokens('tx_rollup_l2_address', [])).toEqual([token])
      expect(token.findAndReturnTokens('else', [])).toEqual([])
    })
  })
})

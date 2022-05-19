import { TxRollupL2AddressToken, TxRollupL2AddressValidationError } from './../../src/tokens/comparable/tx_rollup_l2_address';

describe("TxRollupL2Address Token", () => {
  let token: TxRollupL2AddressToken;
  beforeEach(() => {
    token = new TxRollupL2AddressToken({prim: "l2_address", args: [], annots: []}, 0, null as any);
  });

  describe("EncodeObject", () => {
    it('Should encode address to string', () => {
      expect(token.EncodeObject('tz49XoaXbDZcWi2R1iKxQUxtBWXt4g4S1qtf')).toEqual({
        string: 'tz49XoaXbDZcWi2R1iKxQUxtBWXt4g4S1qtf',
      });
    });

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
      expect(() => token.Encode([]).toThrowError(TxRollupL2AddressValidationError));
      expect(() => token.EncodeObject("tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn").toThrowError(TxRollupL2AddressValidationError));
      expect(() => token.EncodeObject(1).toThrowError(TxRollupL2AddressValidationError));

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
})

import { UnitValue } from '../../src/taquito-michelson-encoder';
import { UnitToken } from '../../src/tokens/unit';

describe('Signature token', () => {
  let token: UnitToken;
  beforeEach(() => {
    token = new UnitToken({ prim: 'unit', args: [], annots: [] }, 0, null as any);
  });

  describe('Execute', () => {
    it('Should transform Michelson unit data to UnitValue', () => {
      expect(token.Execute({ prim: 'unit' })).toEqual(UnitValue);
    });
  });

  describe('ToKey', () => {
    it('Should transform Michelson signature data to js', () => {
      expect(token.ToKey({ prim: 'unit' })).toEqual(UnitValue);
    });
  });

  describe('ToBigMapKey', () => {
    it('Should transform signature to a Michelson big map key', () => {
      expect(token.ToBigMapKey(UnitValue)).toEqual({
        key: { prim: 'Unit' },
        type: { prim: 'unit' },
      });
    });
  });

  describe('Compare', () => {
    it('Should compare signature properly', () => {
      expect(token.compare(UnitValue, UnitValue)).toEqual(0);
    });
  });

  describe('generateSchema', () => {
    it('Should generate the schema properly', () => {
      expect(token.generateSchema()).toEqual({
        __michelsonType: 'unit',
        schema: 'unit',
      });
    });
  });
});

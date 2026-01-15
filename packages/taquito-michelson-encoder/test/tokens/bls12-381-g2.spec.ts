import { Bls12381g2ValidationError, Bls12381g2Token } from '../../src/tokens/bls12-381-g2';

describe('Bls12-381-g2 token', () => {
  let token: Bls12381g2Token;
  beforeEach(() => {
    token = new Bls12381g2Token({ prim: 'bls12_381_g2', args: [], annots: [] }, 0, null as any);
  });

  describe('EncodeObject', () => {
    it('Should encode hex string to Michelson bytes format', () => {
      expect(
        token.EncodeObject(
          '0a4edef9c1ed7f729f520e47730a124fd70662a904ba1074728114d1031e1572c6c886f6b57ec72a6178288c47c335771638533957d540a9d2370f17cc7ed5863bc0b995b8825e0ee1ea1e1e4d00dbae81f14b0bf3611b78c952aacab827a0530f6d4552fa65dd2638b361543f887136a43253d9c66c411697003f7a13c308f5422e1aa0a59c8967acdefd8b6e36ccf30468fb440d82b0630aeb8dca2b5256789a66da69bf91009cbfe6bd221e47aa8ae88dece9764bf3bd999d95d71e4c9899'
        )
      ).toEqual({
        bytes:
          '0a4edef9c1ed7f729f520e47730a124fd70662a904ba1074728114d1031e1572c6c886f6b57ec72a6178288c47c335771638533957d540a9d2370f17cc7ed5863bc0b995b8825e0ee1ea1e1e4d00dbae81f14b0bf3611b78c952aacab827a0530f6d4552fa65dd2638b361543f887136a43253d9c66c411697003f7a13c308f5422e1aa0a59c8967acdefd8b6e36ccf30468fb440d82b0630aeb8dca2b5256789a66da69bf91009cbfe6bd221e47aa8ae88dece9764bf3bd999d95d71e4c9899',
      });
    });

    it('Should encode Uint8Array to Michelson bytes format', () => {
      const uint8 = new Uint8Array([21, 31]);
      expect(token.EncodeObject(uint8)).toEqual({
        bytes: '151f',
      });
    });

    it('Should throw a validation error when bytes are not valid', () => {
      expect(() => token.EncodeObject('test')).toThrowError(Bls12381g2ValidationError);
      expect(() => token.EncodeObject('4')).toThrowError(Bls12381g2ValidationError);
    });
  });

  describe('Encode', () => {
    it('Should encode bytes string to Michelson bytes format', () => {
      expect(
        token.Encode([
          '0a4edef9c1ed7f729f520e47730a124fd70662a904ba1074728114d1031e1572c6c886f6b57ec72a6178288c47c335771638533957d540a9d2370f17cc7ed5863bc0b995b8825e0ee1ea1e1e4d00dbae81f14b0bf3611b78c952aacab827a0530f6d4552fa65dd2638b361543f887136a43253d9c66c411697003f7a13c308f5422e1aa0a59c8967acdefd8b6e36ccf30468fb440d82b0630aeb8dca2b5256789a66da69bf91009cbfe6bd221e47aa8ae88dece9764bf3bd999d95d71e4c9899',
        ])
      ).toEqual({
        bytes:
          '0a4edef9c1ed7f729f520e47730a124fd70662a904ba1074728114d1031e1572c6c886f6b57ec72a6178288c47c335771638533957d540a9d2370f17cc7ed5863bc0b995b8825e0ee1ea1e1e4d00dbae81f14b0bf3611b78c952aacab827a0530f6d4552fa65dd2638b361543f887136a43253d9c66c411697003f7a13c308f5422e1aa0a59c8967acdefd8b6e36ccf30468fb440d82b0630aeb8dca2b5256789a66da69bf91009cbfe6bd221e47aa8ae88dece9764bf3bd999d95d71e4c9899',
      });
    });

    it('Should encode Uint8Array to bytes', () => {
      const uint8 = new Uint8Array([115, 2, 65]);
      expect(token.Encode([uint8])).toEqual({
        bytes: '730241',
      });
    });

    it('Should throw a validation error when bytes are not valid', () => {
      expect(() => token.Encode(['test'])).toThrowError(Bls12381g2ValidationError);
      expect(() => token.Encode([22])).toThrowError(Bls12381g2ValidationError);

      try {
        token.Encode(['test']);
      } catch (ex) {
        expect(ex.name).toEqual('Bls12381g2ValidationError');
      }
    });
  });

  describe('Execute', () => {
    it('Should extract hex string from Michelson data', () => {
      expect(
        token.Execute({
          bytes:
            '0a4edef9c1ed7f729f520e47730a124fd70662a904ba1074728114d1031e1572c6c886f6b57ec72a6178288c47c335771638533957d540a9d2370f17cc7ed5863bc0b995b8825e0ee1ea1e1e4d00dbae81f14b0bf3611b78c952aacab827a0530f6d4552fa65dd2638b361543f887136a43253d9c66c411697003f7a13c308f5422e1aa0a59c8967acdefd8b6e36ccf30468fb440d82b0630aeb8dca2b5256789a66da69bf91009cbfe6bd221e47aa8ae88dece9764bf3bd999d95d71e4c9899',
        })
      ).toEqual(
        '0a4edef9c1ed7f729f520e47730a124fd70662a904ba1074728114d1031e1572c6c886f6b57ec72a6178288c47c335771638533957d540a9d2370f17cc7ed5863bc0b995b8825e0ee1ea1e1e4d00dbae81f14b0bf3611b78c952aacab827a0530f6d4552fa65dd2638b361543f887136a43253d9c66c411697003f7a13c308f5422e1aa0a59c8967acdefd8b6e36ccf30468fb440d82b0630aeb8dca2b5256789a66da69bf91009cbfe6bd221e47aa8ae88dece9764bf3bd999d95d71e4c9899'
      );
    });
  });

  describe('ExtractSchema', () => {
    it('test schema', () => {
      expect(token.generateSchema()).toEqual({
        __michelsonType: 'bls12_381_g2',
        schema: 'bls12_381_g2',
      });
    });
  });
});

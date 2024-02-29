import { CONFIGS } from '../../config';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test contract origination and method calls with types bls12_381_fr, bls12_381_g1 and bls12_381_g2 through contract api using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup();
    });

    it('Verify contract.originate for a contract with a hex string matching type bls12_381_fr in initial storage and update the storage value via default method call', async () => {
      const op = await Tezos.contract.originate({
        code: `
        parameter (pair bls12_381_fr bls12_381_fr);
        storage (option (bls12_381_fr));
        code {CAR; UNPAIR; ADD; SOME; NIL operation; PAIR}
        `,
        storage: '0001'
      });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      const contract = await op.contract();
      expect(await contract.storage()).toEqual(
        { Some: '0001000000000000000000000000000000000000000000000000000000000000' }
      );

      // bls12_381_fr value can be a hex string or a number
      const methodCall = await contract.methods.default('01', 1).send();
      await methodCall.confirmation();

      expect(methodCall.hash).toBeDefined();
      expect(methodCall.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      expect(await contract.storage()).toEqual(
        { Some: '0200000000000000000000000000000000000000000000000000000000000000' }
      );

    });

    it('Verify contract.originate for a contract with a hex string matching type bls12_381_g1 in initial storage and update storage value via default method call', async () => {
      const op = await Tezos.contract.originate({
        code: `
        parameter (pair bls12_381_g1 bls12_381_fr);
        storage (option (bls12_381_g1));
        code {CAR; UNPAIR; MUL; SOME; NIL operation; PAIR}
        `,
        storage:
          '0572cbea904d67468808c8eb50a9450c9721db309128012543902d0ac358a62ae28f75bb8f1c7c42c39a8c5529bf0f4e166a9d8cabc673a322fda673779d8e3822ba3ecb8670e461f73bb9021d5fd76a4c56d9d4cd16bd1bba86881979749d28'
      });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      const contract = await op.contract();
      expect(await contract.storage()).toEqual(
        { Some: '0572cbea904d67468808c8eb50a9450c9721db309128012543902d0ac358a62ae28f75bb8f1c7c42c39a8c5529bf0f4e166a9d8cabc673a322fda673779d8e3822ba3ecb8670e461f73bb9021d5fd76a4c56d9d4cd16bd1bba86881979749d28' }
      );

      const methodCall = await contract.methods
        .default(
          '0572cbea904d67468808c8eb50a9450c9721db309128012543902d0ac358a62ae28f75bb8f1c7c42c39a8c5529bf0f4e166a9d8cabc673a322fda673779d8e3822ba3ecb8670e461f73bb9021d5fd76a4c56d9d4cd16bd1bba86881979749d28',
          2
        )
        .send();
      await methodCall.confirmation();

      expect(methodCall.hash).toBeDefined();
      expect(methodCall.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      expect(await contract.storage()).toEqual(
        { Some: '0c9b60d5afcbd5663a8a44b7c5a02f19e9a77ab0a35bd65809bb5c67ec582c897feb04decc694b13e08587f3ff9b5b60143be6d078c2b79a7d4f1d1b21486a030ec93f56aa54e1de880db5a66dd833a652a95bee27c824084006cb5644cbd43f' }
      );

    });

    it('Verify contract.originate for a contract with empty initial storage and update storage value via default method call with a hex string matching type bls12_381_g2', async () => {
      const op = await Tezos.contract.originate({
        code: `
        parameter bls12_381_g2;
        storage (option (bls12_381_g2));
        code {CAR; SOME; NIL operation; PAIR}
        `,
        storage: null,
      })
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      const contract = await op.contract();
      expect(await contract.storage()).toEqual(null);

      const methodCall = await contract.methods.default('0a4edef9c1ed7f729f520e47730a124fd70662a904ba1074728114d1031e1572c6c886f6b57ec72a6178288c47c335771638533957d540a9d2370f17cc7ed5863bc0b995b8825e0ee1ea1e1e4d00dbae81f14b0bf3611b78c952aacab827a0530f6d4552fa65dd2638b361543f887136a43253d9c66c411697003f7a13c308f5422e1aa0a59c8967acdefd8b6e36ccf30468fb440d82b0630aeb8dca2b5256789a66da69bf91009cbfe6bd221e47aa8ae88dece9764bf3bd999d95d71e4c9899').send();
      await methodCall.confirmation();

      expect(methodCall.hash).toBeDefined();
      expect(methodCall.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      expect(await contract.storage()).toEqual({ Some: '0a4edef9c1ed7f729f520e47730a124fd70662a904ba1074728114d1031e1572c6c886f6b57ec72a6178288c47c335771638533957d540a9d2370f17cc7ed5863bc0b995b8825e0ee1ea1e1e4d00dbae81f14b0bf3611b78c952aacab827a0530f6d4552fa65dd2638b361543f887136a43253d9c66c411697003f7a13c308f5422e1aa0a59c8967acdefd8b6e36ccf30468fb440d82b0630aeb8dca2b5256789a66da69bf91009cbfe6bd221e47aa8ae88dece9764bf3bd999d95d71e4c9899' });

    });
  });
});

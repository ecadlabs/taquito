import { MANAGER_LAMBDA, TezosToolkit, getRevealFee } from '@taquito/taquito';
import { Contract } from '@taquito/taquito';
import { CONFIGS } from '../../config';
import { originate, originate2, transferImplicit2 } from '../../data/lambda';
import { ligoSample } from '../../data/ligo-simple-contract';
import { managerCode } from '../../data/manager_code';
import { InvalidAmountError } from '@taquito/core';

CONFIGS().forEach(({ lib, setup, knownBaker, createAddress, rpc }) => {
  const Tezos = lib;

  describe(`Test estimate scenarios using: ${rpc}`, () => {
    let LowAmountTez: TezosToolkit;
    let contract: Contract;
    let amt = 2000000

    beforeAll(async () => {
      try {
        await setup();
        LowAmountTez = await createAddress();
        const pkh = await LowAmountTez.signer.publicKeyHash();
        amt += getRevealFee(await LowAmountTez.signer.publicKeyHash());
        const transfer = await Tezos.contract.transfer({ to: pkh, mutez: true, amount: amt });
        await transfer.confirmation();
        const op = await Tezos.contract.originate({
          balance: '1',
          code: managerCode,
          init: { 'string': pkh },
        });
        await op.confirmation();
        contract = await LowAmountTez.contract.at((await op.contract()).address);
        expect(op.status).toEqual('applied');
      }
      catch (ex: any) {
        fail(ex.message);
      } finally {
      }
    });

    it('Verify .estimate.transfer with allocated destination', async () => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 0.019 });
      expect(estimate.gasLimit).toEqual(101);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(186);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(166);
      expect(estimate.totalCost).toEqual(166);
      expect(estimate.usingBaseFeeMutez).toEqual(166);
      expect(estimate.consumedMilligas).toEqual(100040);
    });

    it('Verify .estimate.transfer with unallocated destination', async () => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), amount: 0.017 });
      expect(estimate.gasLimit).toEqual(101);
      expect(estimate.storageLimit).toEqual(277);
      expect(estimate.suggestedFeeMutez).toEqual(186);
      expect(estimate.burnFeeMutez).toEqual(69250);
      expect(estimate.minimalFeeMutez).toEqual(166);
      expect(estimate.totalCost).toEqual(69416);
      expect(estimate.usingBaseFeeMutez).toEqual(166);
      expect(estimate.consumedMilligas).toEqual(100040);
    });

    it('Verify .estimate.originate simple contract', async () => {
      const estimate = await LowAmountTez.estimate.originate({
        balance: '1',
        code: ligoSample,
        storage: 0,
      });
      expect(estimate.gasLimit).toEqual(677);
      expect(estimate.storageLimit).toEqual(591);
      expect(estimate.suggestedFeeMutez).toEqual(535);
      expect(estimate.burnFeeMutez).toEqual(147750);
      expect(estimate.minimalFeeMutez).toEqual(515);
      expect(estimate.totalCost).toEqual(148265);
      expect(estimate.usingBaseFeeMutez).toEqual(515);
      expect(estimate.consumedMilligas).toEqual(676402);
    });

    it('Verify .estimate.setDelegate result', async () => {
      const estimate = await LowAmountTez.estimate.setDelegate({
        delegate: knownBaker,
        source: await LowAmountTez.signer.publicKeyHash(),
      });
      expect(estimate.gasLimit).toEqual(100);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(181);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(161);
      expect(estimate.totalCost).toEqual(161);
      expect(estimate.usingBaseFeeMutez).toEqual(161);
      expect(estimate.consumedMilligas).toEqual(100000);
    });

    it('Verify .estimate.transfer for internal transfer to allocated implicit', async () => {
      const tx = contract.methods.do(MANAGER_LAMBDA.transferImplicit(knownBaker, 5)).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx);
      expect(estimate.gasLimit).toEqual(1456);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(394);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(374);
      expect(estimate.totalCost).toEqual(374);
      expect(estimate.usingBaseFeeMutez).toEqual(374);
      expect(estimate.consumedMilligas).toEqual(1455798);
    });

    it('Verify .estimate.transfer for multiple internal transfers to unallocated account', async () => {
      const tx = contract.methods.do(transferImplicit2(
        await (await createAddress()).signer.publicKeyHash(),
        await (await createAddress()).signer.publicKeyHash(),
        50)
      ).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx);
      expect(estimate.gasLimit).toEqual(1571);
      expect(estimate.storageLimit).toEqual(534);
      expect(estimate.suggestedFeeMutez).toEqual(465);
      expect(estimate.burnFeeMutez).toEqual(133500);
      expect(estimate.minimalFeeMutez).toEqual(445);
      expect(estimate.totalCost).toEqual(133945);
      expect(estimate.usingBaseFeeMutez).toEqual(445);
      expect(estimate.consumedMilligas).toEqual(1570327);
    });

    it('Verify .estimate.transfer for internal origination', async () => {
      const tx = contract.methods.do(originate()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx);
      expect(estimate.gasLimit).toEqual(1867);
      expect(estimate.storageLimit).toEqual(337);
      expect(estimate.suggestedFeeMutez).toEqual(441);
      expect(estimate.burnFeeMutez).toEqual(84250);
      expect(estimate.minimalFeeMutez).toEqual(421);
      expect(estimate.totalCost).toEqual(84671);
      expect(estimate.usingBaseFeeMutez).toEqual(421);
      expect(estimate.consumedMilligas).toEqual(1866422);
    });

    it('Verify .estimate.transfer for multiple internal originations', async () => {
      const tx = contract.methods.do(originate2()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx);
      expect(estimate.gasLimit).toEqual(2392);
      expect(estimate.storageLimit).toEqual(654);
      expect(estimate.suggestedFeeMutez).toEqual(559);
      expect(estimate.burnFeeMutez).toEqual(163500);
      expect(estimate.minimalFeeMutez).toEqual(539);
      expect(estimate.totalCost).toEqual(164039);
      expect(estimate.usingBaseFeeMutez).toEqual(539);
      expect(estimate.consumedMilligas).toEqual(2391575);
      // Do the actual operation
      const op2 = await contract.methods.do(originate2()).send();
      await op2.confirmation();
    });

    it('should throw error when trying to estimate transfer with negative amount in param', async () => {
      expect(async () => {
        const est = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: -1 });
      }).rejects.toThrowError(InvalidAmountError);
    });
  });


  describe(`Test estimate scenarios with very low balance using: ${rpc}`, () => {
    let LowAmountTez: TezosToolkit;
    let amt = 2000

    beforeAll(async () => {
      await setup();
      LowAmountTez = await createAddress();
      const pkh = await LowAmountTez.signer.publicKeyHash();
      amt += getRevealFee(await LowAmountTez.signer.publicKeyHash());
      const transfer = await Tezos.contract.transfer({ to: pkh, mutez: true, amount: amt });
      await transfer.confirmation();
    });

    it('Verify .estimate.transfer to regular address', async () => {
      let estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + getRevealFee(await LowAmountTez.signer.publicKeyHash())) });
      expect(estimate.gasLimit).toEqual(101);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(185);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(165);
      expect(estimate.totalCost).toEqual(165);
      expect(estimate.usingBaseFeeMutez).toEqual(165);
      expect(estimate.consumedMilligas).toEqual(100040);
    });

    it('Estimate transfer to regular address with a fixed fee', async () => {

      const params = { fee: 2000, to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + getRevealFee(await LowAmountTez.signer.publicKeyHash())) };
      await expect(LowAmountTez.estimate.transfer(params)).rejects.toMatchObject({
        id: expect.stringContaining('empty_implicit_contract'),
      });
    });

    it('Estimate transfer to regular address with insufficient balance', async () => {
      await expect(
        LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt })
      ).rejects.toMatchObject({
        id: expect.stringContaining('subtraction_underflow'),
      });
    });

    it('Estimate transfer to regular address with insufficient balance to pay storage for allocation', async () => {
      await expect(
        LowAmountTez.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), mutez: true, amount: amt - (1382 + getRevealFee(await LowAmountTez.signer.publicKeyHash())) })
      ).rejects.toEqual(
        expect.objectContaining({
          errors: expect.arrayContaining([expect.objectContaining({ id: expect.stringContaining('cannot_pay_storage_fee') })]),
          message: expect.stringContaining('subtraction_underflow'),
        }));
    });

    it('Estimate origination with insufficient balance to pay storage', async () => {
      expect(true).toBeTruthy();
      await expect(LowAmountTez.estimate.originate({
        balance: '0',
        code: ligoSample,
        storage: 0,
      })).rejects.toEqual(
        expect.objectContaining({
          errors: expect.arrayContaining([expect.objectContaining({ id: expect.stringContaining('cannot_pay_storage_fee') })]),
          message: expect.stringContaining('subtraction_underflow'),
        }));
    });
  });
});
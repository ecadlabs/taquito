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
      expect(estimate.gasLimit).toEqual(2101);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(390);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(370);
      expect(estimate.totalCost).toEqual(370);
      expect(estimate.usingBaseFeeMutez).toEqual(370);
      expect(estimate.consumedMilligas).toEqual(2100040);
    });

    it('Verify .estimate.transfer with unallocated destination', async () => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), amount: 0.017 });
      expect(estimate.gasLimit).toEqual(2101);
      expect(estimate.storageLimit).toEqual(277);
      expect(estimate.suggestedFeeMutez).toEqual(390);
      expect(estimate.burnFeeMutez).toEqual(69250);
      expect(estimate.minimalFeeMutez).toEqual(370);
      expect(estimate.totalCost).toEqual(69620);
      expect(estimate.usingBaseFeeMutez).toEqual(370);
      expect(estimate.consumedMilligas).toEqual(2100040);
    });

    it('Verify .estimate.originate simple contract', async () => {
      const estimate = await LowAmountTez.estimate.originate({
        balance: '1',
        code: ligoSample,
        storage: 0,
      });
      expect(estimate.gasLimit).toEqual(677);
      expect(estimate.storageLimit).toEqual(591);
      expect(estimate.suggestedFeeMutez).toEqual(539);
      expect(estimate.burnFeeMutez).toEqual(147750);
      expect(estimate.minimalFeeMutez).toEqual(519);
      expect(estimate.totalCost).toEqual(148269);
      expect(estimate.usingBaseFeeMutez).toEqual(519);
      expect(estimate.consumedMilligas).toEqual(676402);
    });

    it('Verify .estimate.setDelegate result', async () => {
      const estimate = await LowAmountTez.estimate.setDelegate({
        delegate: knownBaker,
        source: await LowAmountTez.signer.publicKeyHash(),
      });
      expect(estimate.gasLimit).toEqual(100);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(185);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(165);
      expect(estimate.totalCost).toEqual(165);
      expect(estimate.usingBaseFeeMutez).toEqual(165);
      expect(estimate.consumedMilligas).toEqual(100000);
    });

    it('Verify .estimate.transfer for internal transfer to allocated implicit', async () => {
      const tx = contract.methodsObject.do(MANAGER_LAMBDA.transferImplicit(knownBaker, 5)).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx);
      expect(estimate.gasLimit).toEqual(3457);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(598);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(578);
      expect(estimate.totalCost).toEqual(578);
      expect(estimate.usingBaseFeeMutez).toEqual(578);
      expect(estimate.consumedMilligas).toEqual(3456228);
    });

    it('Verify .estimate.transfer for multiple internal transfers to unallocated account', async () => {
      const tx = contract.methodsObject.do(transferImplicit2(
        await (await createAddress()).signer.publicKeyHash(),
        await (await createAddress()).signer.publicKeyHash(),
        50)
      ).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx);
      expect(estimate.gasLimit).toEqual(5571);
      expect(estimate.storageLimit).toEqual(534);
      expect(estimate.suggestedFeeMutez).toEqual(869);
      expect(estimate.burnFeeMutez).toEqual(133500);
      expect(estimate.minimalFeeMutez).toEqual(849);
      expect(estimate.totalCost).toEqual(134349);
      expect(estimate.usingBaseFeeMutez).toEqual(849);
      expect(estimate.consumedMilligas).toEqual(5570757);
    });

    it('Verify .estimate.transfer for internal origination', async () => {
      const tx = contract.methodsObject.do(originate()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx);
      expect(estimate.gasLimit).toEqual(1867);
      expect(estimate.storageLimit).toEqual(337);
      expect(estimate.suggestedFeeMutez).toEqual(445);
      expect(estimate.burnFeeMutez).toEqual(84250);
      expect(estimate.minimalFeeMutez).toEqual(425);
      expect(estimate.totalCost).toEqual(84675);
      expect(estimate.usingBaseFeeMutez).toEqual(425);
      expect(estimate.consumedMilligas).toEqual(1866852);
    });

    it('Verify .estimate.transfer for multiple internal originations', async () => {
      const tx = contract.methodsObject.do(originate2()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx);
      expect(estimate.gasLimit).toEqual(2393);
      expect(estimate.storageLimit).toEqual(654);
      expect(estimate.suggestedFeeMutez).toEqual(563);
      expect(estimate.burnFeeMutez).toEqual(163500);
      expect(estimate.minimalFeeMutez).toEqual(543);
      expect(estimate.totalCost).toEqual(164043);
      expect(estimate.usingBaseFeeMutez).toEqual(543);
      expect(estimate.consumedMilligas).toEqual(2392005);
      // Do the actual operation
      const op2 = await contract.methodsObject.do(originate2()).send();
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
      expect(estimate.gasLimit).toEqual(2101);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(389);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(369);
      expect(estimate.totalCost).toEqual(369);
      expect(estimate.usingBaseFeeMutez).toEqual(369);
      expect(estimate.consumedMilligas).toEqual(2100040);
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
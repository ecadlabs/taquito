import { MANAGER_LAMBDA, TezosToolkit, getRevealFee } from '@taquito/taquito';
import { Contract } from '@taquito/taquito';
import { CONFIGS } from '../../config';
import { originate, originate2, transferImplicit2 } from '../../data/lambda';
import { ligoSample } from '../../data/ligo-simple-contract';
import { managerCode } from '../../data/manager_code';
import { InvalidAmountError } from '@taquito/core';
import { PrefixV2 } from '@taquito/utils';

CONFIGS().forEach(({ lib, setup, knownBaker, createAddress, rpc }) => {
  const Tezos = lib;
  let pkh: string;
  describe(`Test estimate scenarios using: ${rpc}`, () => {
    let Tz3: TezosToolkit;
    let contract: Contract;
    let amt = 2000000

    beforeAll(async () => {
      try {
        await setup();
        Tz3 = await createAddress(PrefixV2.P256SecretKey);
        pkh = await Tz3.signer.publicKeyHash();
        amt += getRevealFee(pkh);
        const transfer = await Tezos.contract.transfer({ to: pkh, mutez: true, amount: amt });
        await transfer.confirmation();
        const op = await Tezos.contract.originate({
          balance: '1',
          code: managerCode,
          init: { 'string': pkh },
        });
        await op.confirmation();
        contract = await Tz3.contract.at((await op.contract()).address);
        expect(op.status).toEqual('applied');
      }
      catch (ex: any) {
        console.log(ex.message);
      }
    });

    it('Verify .estimate.transfer with allocated destination', async () => {
      const estimate = await Tz3.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 0.019 });
      expect(estimate.gasLimit).toEqual(2101);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(388);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(368);
      expect(estimate.totalCost).toEqual(368);
      expect(estimate.usingBaseFeeMutez).toEqual(368);
      expect(estimate.consumedMilligas).toEqual(2100040);
    });

    it('Verify .estimate.transfer with unallocated destination', async () => {
      const estimate = await Tz3.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), amount: 0.017 });
      expect(estimate.gasLimit).toEqual(2101);
      expect(estimate.storageLimit).toEqual(277);
      expect(estimate.suggestedFeeMutez).toEqual(388);
      expect(estimate.burnFeeMutez).toEqual(69250);
      expect(estimate.minimalFeeMutez).toEqual(368);
      expect(estimate.totalCost).toEqual(69618);
      expect(estimate.usingBaseFeeMutez).toEqual(368);
      expect(estimate.consumedMilligas).toEqual(2100040);
    });

    it('Verify .estimate.originate simple contract', async () => {
      const estimate = await Tz3.estimate.originate({
        balance: '1',
        code: ligoSample,
        storage: 0,
      });
      expect(estimate.gasLimit).toEqual(677);
      expect(estimate.storageLimit).toEqual(591);
      expect(estimate.suggestedFeeMutez).toEqual(537);
      expect(estimate.burnFeeMutez).toEqual(147750);
      expect(estimate.minimalFeeMutez).toEqual(517);
      expect(estimate.totalCost).toEqual(148267);
      expect(estimate.usingBaseFeeMutez).toEqual(517);
      expect(estimate.consumedMilligas).toEqual(676402);
    });

    it('Verify .estimate.setDelegate result', async () => {
      const estimate = await Tz3.estimate.setDelegate({
        delegate: knownBaker,
        source: pkh,
      });
      expect(estimate.gasLimit).toEqual(100);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(183);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(163);
      expect(estimate.totalCost).toEqual(163);
      expect(estimate.usingBaseFeeMutez).toEqual(163);
      expect(estimate.consumedMilligas).toEqual(100000);
    });

    it('Verify .estimate.transfer for internal transfer to allocated implicit', async () => {
      const tx = contract.methodsObject.do(MANAGER_LAMBDA.transferImplicit(knownBaker, 5)).toTransferParams();
      const estimate = await Tz3.estimate.transfer(tx);
      expect(estimate.gasLimit).toEqual(3456);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(596);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(576);
      expect(estimate.totalCost).toEqual(576);
      expect(estimate.usingBaseFeeMutez).toEqual(576);
      expect(estimate.consumedMilligas).toEqual(3456228);
    });

    it('Verify .estimate.transfer for multiple internal transfers to unallocated account', async () => {
      const tx = contract.methodsObject.do(transferImplicit2(
        await (await createAddress()).signer.publicKeyHash(),
        await (await createAddress()).signer.publicKeyHash(),
        50)
      ).toTransferParams();
      const estimate = await Tz3.estimate.transfer(tx);
      expect(estimate.gasLimit).toEqual(5571);
      expect(estimate.storageLimit).toEqual(534);
      expect(estimate.suggestedFeeMutez).toEqual(867);
      expect(estimate.burnFeeMutez).toEqual(133500);
      expect(estimate.minimalFeeMutez).toEqual(847);
      expect(estimate.totalCost).toEqual(134347);
      expect(estimate.usingBaseFeeMutez).toEqual(847);
      expect(estimate.consumedMilligas).toEqual(5570499);
    });

    it('Verify .estimate.transfer for internal origination', async () => {
      const tx = contract.methodsObject.do(originate()).toTransferParams();
      const estimate = await Tz3.estimate.transfer(tx);
      expect(estimate.gasLimit).toEqual(1867);
      expect(estimate.storageLimit).toEqual(337);
      expect(estimate.suggestedFeeMutez).toEqual(443);
      expect(estimate.burnFeeMutez).toEqual(84250);
      expect(estimate.minimalFeeMutez).toEqual(423);
      expect(estimate.totalCost).toEqual(84673);
      expect(estimate.usingBaseFeeMutez).toEqual(423);
      expect(estimate.consumedMilligas).toEqual(1866594);
    });

    it('Verify .estimate.transfer for multiple internal originations', async () => {
      const tx = contract.methodsObject.do(originate2()).toTransferParams();
      const estimate = await Tz3.estimate.transfer(tx);
      expect(estimate.gasLimit).toEqual(2392);
      expect(estimate.storageLimit).toEqual(654);
      expect(estimate.suggestedFeeMutez).toEqual(561);
      expect(estimate.burnFeeMutez).toEqual(163500);
      expect(estimate.minimalFeeMutez).toEqual(541);
      expect(estimate.totalCost).toEqual(164041);
      expect(estimate.usingBaseFeeMutez).toEqual(541);
      expect(estimate.consumedMilligas).toEqual(2392005);
      // Do the actual operation
      const op2 = await contract.methodsObject.do(originate2()).send();
      await op2.confirmation();
    });

    it('should throw error when trying to estimate transfer with negative amount in param', async () => {
      expect(async () => {
        const est = await Tz3.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: -1 });
      }).rejects.toThrowError(InvalidAmountError);
    });
  });


  describe(`Test estimate scenarios with very low balance using: ${rpc}`, () => {
    let LowAmountTz3: TezosToolkit;
    let amt = 2000

    beforeAll(async () => {
      await setup();
      LowAmountTz3 = await createAddress(PrefixV2.P256SecretKey);
      const pkh = await LowAmountTz3.signer.publicKeyHash();
      amt += getRevealFee(pkh);
      const transfer = await Tezos.contract.transfer({ to: pkh, mutez: true, amount: amt });
      await transfer.confirmation();
    });

    it('Verify .estimate.transfer to regular address', async () => {
      let estimate = await LowAmountTz3.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + getRevealFee(pkh)) });
      expect(estimate.gasLimit).toEqual(2101);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(387);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(367);
      expect(estimate.totalCost).toEqual(367);
      expect(estimate.usingBaseFeeMutez).toEqual(367);
      expect(estimate.consumedMilligas).toEqual(2100040);
    });

    it('Estimate transfer to regular address with a fixed fee', async () => {

      const params = { fee: 2000, to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + getRevealFee(pkh)) };
      await expect(LowAmountTz3.estimate.transfer(params)).rejects.toMatchObject({
        id: expect.stringContaining('empty_implicit_contract'),
      });
    });

    it('Estimate transfer to regular address with insufficient balance', async () => {
      await expect(
        LowAmountTz3.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt })
      ).rejects.toMatchObject({
        id: expect.stringContaining('subtraction_underflow'),
      });
    });

    it('Estimate transfer to regular address with insufficient balance to pay storage for allocation', async () => {
      await expect(
        LowAmountTz3.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), mutez: true, amount: amt - (1382 + getRevealFee(pkh)) })
      ).rejects.toEqual(
        expect.objectContaining({
          errors: expect.arrayContaining([expect.objectContaining({ id: expect.stringContaining('cannot_pay_storage_fee') })]),
          message: expect.stringContaining('subtraction_underflow'),
        }));
    });

    it('Estimate origination with insufficient balance to pay storage', async () => {
      expect(true).toBeTruthy();
      await expect(LowAmountTz3.estimate.originate({
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
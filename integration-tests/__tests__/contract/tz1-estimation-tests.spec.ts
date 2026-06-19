import { MANAGER_LAMBDA, TezosToolkit, getRevealFee } from '@taquito/taquito';
import { Contract } from '@taquito/taquito';
import { CONFIGS } from '../../config';
import { originate, originate2, transferImplicit2 } from '../../data/lambda';
import { ligoSample } from '../../data/ligo-simple-contract';
import { managerCode } from '../../data/manager_code';
import { InvalidAmountError } from '@taquito/core';
import { PrefixV2 } from '@taquito/utils';
import { expectEstimate } from './estimation-test-helpers';
import { waitForContractAt } from './contract-test-helpers';

CONFIGS().forEach(({ lib, setup, knownBaker, createAddress, rpc }) => {
  const Tezos = lib;
  let pkh: string;

  describe(`Test tz1 estimate scenarios using: ${rpc}`, () => {
    let Tz1: TezosToolkit;
    let contract: Contract;
    let amt = 2000000

    beforeAll(async () => {
      try {
        await setup({ preferFreshKey: true, minBalanceMutez: 5_000_000 });
        Tz1 = await createAddress(PrefixV2.Ed25519Seed);
        pkh = await Tz1.signer.publicKeyHash();
        amt += getRevealFee(pkh);
        const fund = await Tezos.contract.transfer({ to: pkh, mutez: true, amount: amt });
        await fund.confirmation();
        const originate = await Tezos.contract.originate({
          balance: '1',
          code: managerCode,
          init: { 'string': pkh },
          fee: 800,
        });
        await originate.confirmation();
        contract = await waitForContractAt(Tz1, (await originate.contract()).address);
        expect(originate.status).toEqual('applied');
      }
      catch (ex: any) {
        console.log(ex.message);
        throw ex;
      }
    });

    it('Verify .estimate.transfer with allocated destination', async () => {
      const estimate = await Tz1.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 0.019 });
      expectEstimate(estimate, rpc, {
        gasLimit: 2101,
        storageLimit: 0,
        suggestedFeeMutez: 389,
        burnFeeMutez: 0,
        minimalFeeMutez: 369,
        totalCost: 369,
        usingBaseFeeMutez: 369,
        consumedMilligas: 2100040,
      }, {
        gasLimit: 2101,
        storageLimit: 0,
        suggestedFeeMutez: 387,
        burnFeeMutez: 0,
        minimalFeeMutez: 367,
        totalCost: 367,
        usingBaseFeeMutez: 367,
        consumedMilligas: 2100040,
      });
    });

    it('Verify .estimate.transfer with unallocated destination', async () => {
      const estimate = await Tz1.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), amount: 0.017 });
      expectEstimate(estimate, rpc, {
        gasLimit: 2101,
        storageLimit: 277,
        suggestedFeeMutez: 389,
        burnFeeMutez: 69250,
        minimalFeeMutez: 369,
        totalCost: 69619,
        usingBaseFeeMutez: 369,
        consumedMilligas: 2100040,
      }, {
        gasLimit: 2101,
        storageLimit: 277,
        suggestedFeeMutez: 387,
        burnFeeMutez: 69250,
        minimalFeeMutez: 367,
        totalCost: 69617,
        usingBaseFeeMutez: 367,
        consumedMilligas: 2100040,
      });
    });

    it('Verify .estimate.originate simple contract', async () => {
      const estimate = await Tz1.estimate.originate({
        balance: '1',
        code: ligoSample,
        storage: 0,
      });
      expectEstimate(estimate, rpc, {
        gasLimit: 677,
        storageLimit: 591,
        suggestedFeeMutez: 538,
        burnFeeMutez: 147750,
        minimalFeeMutez: 518,
        totalCost: 148268,
        usingBaseFeeMutez: 518,
        consumedMilligas: 676402,
      }, {
        gasLimit: 677,
        storageLimit: 591,
        suggestedFeeMutez: 536,
        burnFeeMutez: 147750,
        minimalFeeMutez: 516,
        totalCost: 148266,
        usingBaseFeeMutez: 516,
        consumedMilligas: 676402,
      });
    });

    it('Verify .estimate.setDelegate result', async () => {
      const estimate = await Tz1.estimate.setDelegate({
        delegate: knownBaker,
        source: pkh,
      });
      expectEstimate(estimate, rpc, {
        gasLimit: 100,
        storageLimit: 0,
        suggestedFeeMutez: 184,
        burnFeeMutez: 0,
        minimalFeeMutez: 164,
        totalCost: 164,
        usingBaseFeeMutez: 164,
        consumedMilligas: 100000,
      }, {
        gasLimit: 100,
        storageLimit: 0,
        suggestedFeeMutez: 182,
        burnFeeMutez: 0,
        minimalFeeMutez: 162,
        totalCost: 162,
        usingBaseFeeMutez: 162,
        consumedMilligas: 100000,
      });
    });

    it('Verify .estimate.transfer for internal transfer to allocated implicit', async () => {
      const tx = contract.methodsObject.do(MANAGER_LAMBDA.transferImplicit(knownBaker, 5)).toTransferParams();
      const estimate = await Tz1.estimate.transfer(tx);
      expectEstimate(estimate, rpc, {
        gasLimit: 3458,
        storageLimit: 0,
        suggestedFeeMutez: 597,
        burnFeeMutez: 0,
        minimalFeeMutez: 577,
        totalCost: 577,
        usingBaseFeeMutez: 577,
        consumedMilligas: 3457645,
      }, {
        gasLimit: 3458,
        storageLimit: 0,
        suggestedFeeMutez: 595,
        burnFeeMutez: 0,
        minimalFeeMutez: 575,
        totalCost: 575,
        usingBaseFeeMutez: 575,
        consumedMilligas: 3457129,
      }, {
        gasLimit: 3458,
        storageLimit: 0,
        suggestedFeeMutez: 595,
        burnFeeMutez: 0,
        minimalFeeMutez: 575,
        totalCost: 575,
        usingBaseFeeMutez: 575,
        consumedMilligas: 3457258,
      });
    });

    it('Verify .estimate.transfer for multiple internal transfers to unallocated account', async () => {
      const tx = contract.methodsObject.do(transferImplicit2(
        await (await createAddress()).signer.publicKeyHash(),
        await (await createAddress()).signer.publicKeyHash(),
        50)
      ).toTransferParams();
      const estimate = await Tz1.estimate.transfer(tx);
      expectEstimate(estimate, rpc, {
        gasLimit: 5573,
        storageLimit: 534,
        suggestedFeeMutez: 868,
        burnFeeMutez: 133500,
        minimalFeeMutez: 848,
        totalCost: 134348,
        usingBaseFeeMutez: 848,
        consumedMilligas: 5572174,
      }, {
        gasLimit: 5572,
        storageLimit: 534,
        suggestedFeeMutez: 866,
        burnFeeMutez: 133500,
        minimalFeeMutez: 846,
        totalCost: 134346,
        usingBaseFeeMutez: 846,
        consumedMilligas: 5571658,
      }, {
        gasLimit: 5572,
        storageLimit: 534,
        suggestedFeeMutez: 866,
        burnFeeMutez: 133500,
        minimalFeeMutez: 846,
        totalCost: 134346,
        usingBaseFeeMutez: 846,
        consumedMilligas: 5571787,
      });
    });

    it('Verify .estimate.transfer for internal origination', async () => {
      const tx = contract.methodsObject.do(originate()).toTransferParams();
      const estimate = await Tz1.estimate.transfer(tx);
      expectEstimate(estimate, rpc, {
        gasLimit: 1869,
        storageLimit: 337,
        suggestedFeeMutez: 444,
        burnFeeMutez: 84250,
        minimalFeeMutez: 424,
        totalCost: 84674,
        usingBaseFeeMutez: 424,
        consumedMilligas: 1868269,
      }, {
        gasLimit: 1868,
        storageLimit: 337,
        suggestedFeeMutez: 442,
        burnFeeMutez: 84250,
        minimalFeeMutez: 422,
        totalCost: 84672,
        usingBaseFeeMutez: 422,
        consumedMilligas: 1867753,
      }, {
        gasLimit: 1868,
        storageLimit: 337,
        suggestedFeeMutez: 442,
        burnFeeMutez: 84250,
        minimalFeeMutez: 422,
        totalCost: 84672,
        usingBaseFeeMutez: 422,
        consumedMilligas: 1867882,
      });
    });

    it('Verify .estimate.transfer for multiple internal originations', async () => {
      const tx = contract.methodsObject.do(originate2()).toTransferParams();
      const estimate = await Tz1.estimate.transfer(tx);
      expectEstimate(estimate, rpc, {
        gasLimit: 2394,
        storageLimit: 654,
        suggestedFeeMutez: 562,
        burnFeeMutez: 163500,
        minimalFeeMutez: 542,
        totalCost: 164042,
        usingBaseFeeMutez: 542,
        consumedMilligas: 2393422,
      }, {
        gasLimit: 2393,
        storageLimit: 654,
        suggestedFeeMutez: 560,
        burnFeeMutez: 163500,
        minimalFeeMutez: 540,
        totalCost: 164040,
        usingBaseFeeMutez: 540,
        consumedMilligas: 2392906,
      }, {
        gasLimit: 2394,
        storageLimit: 654,
        suggestedFeeMutez: 560,
        burnFeeMutez: 163500,
        minimalFeeMutez: 540,
        totalCost: 164040,
        usingBaseFeeMutez: 540,
        consumedMilligas: 2393035,
      });
      // Do the actual operation
      const op2 = await contract.methodsObject.do(originate2()).send();
      await op2.confirmation();
    });

    it('should throw error when trying to estimate transfer with negative amount in param', async () => {
      await expect(async () => {
        const est = await Tz1.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: -1 });
      }).rejects.toThrow(InvalidAmountError);
    });
  });


  describe(`Test tz1 estimate scenarios with very low balance using: ${rpc}`, () => {
    let LowAmountTz1: TezosToolkit;
    let amt = 2000

    beforeAll(async () => {
      await setup({ preferFreshKey: true, minBalanceMutez: 5_000_000 });
      LowAmountTz1 = await createAddress(PrefixV2.Ed25519Seed);
      const pkh = await LowAmountTz1.signer.publicKeyHash();
      amt += getRevealFee(pkh);
      const transfer = await Tezos.contract.transfer({ to: pkh, mutez: true, amount: amt });
      await transfer.confirmation();
    });

    it('Verify .estimate.transfer to regular address', async () => {
      let estimate = await LowAmountTz1.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + getRevealFee(pkh)) });
      expectEstimate(estimate, rpc, {
        gasLimit: 2101,
        storageLimit: 0,
        suggestedFeeMutez: 388,
        burnFeeMutez: 0,
        minimalFeeMutez: 368,
        totalCost: 368,
        usingBaseFeeMutez: 368,
        consumedMilligas: 2100040,
      }, {
        gasLimit: 2101,
        storageLimit: 0,
        suggestedFeeMutez: 386,
        burnFeeMutez: 0,
        minimalFeeMutez: 366,
        totalCost: 366,
        usingBaseFeeMutez: 366,
        consumedMilligas: 2100040,
      });
    });

    it('Estimate transfer to regular address with a fixed fee', async () => {

      const params = { fee: 2000, to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + getRevealFee(pkh)) };
      await expect(LowAmountTz1.estimate.transfer(params)).rejects.toMatchObject({
        id: expect.stringContaining('empty_implicit_contract'),
      });
    });

    it('Estimate transfer to regular address with insufficient balance', async () => {
      await expect(
        LowAmountTz1.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt })
      ).rejects.toMatchObject({
        id: expect.stringContaining('subtraction_underflow'),
      });
    });

    it('Estimate transfer to regular address with insufficient balance to pay storage for allocation', async () => {
      await expect(
        LowAmountTz1.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), mutez: true, amount: amt - (1382 + getRevealFee(pkh)) })
      ).rejects.toEqual(
        expect.objectContaining({
          errors: expect.arrayContaining([expect.objectContaining({ id: expect.stringContaining('cannot_pay_storage_fee') })]),
          message: expect.stringContaining('subtraction_underflow'),
        }));
    });

    it('Estimate origination with insufficient balance to pay storage', async () => {
      expect(true).toBeTruthy();
      await expect(LowAmountTz1.estimate.originate({
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

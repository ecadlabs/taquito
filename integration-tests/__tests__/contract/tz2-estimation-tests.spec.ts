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
  describe(`Test estimate scenarios using: ${rpc}`, () => {
    let LowAmountTez: TezosToolkit;
    let contract: Contract;
    let amt = 2000000

    beforeAll(async () => {
      try {
        await setup({ preferFreshKey: true, minBalanceMutez: 5_000_000 });
        LowAmountTez = await createAddress(PrefixV2.Secp256k1SecretKey);
        pkh = await LowAmountTez.signer.publicKeyHash();
        amt += getRevealFee(pkh);
        const transfer = await Tezos.contract.transfer({ to: pkh, mutez: true, amount: amt });
        await transfer.confirmation();
        const op = await Tezos.contract.originate({
          balance: '1',
          code: managerCode,
          init: { 'string': pkh },
        });
        await op.confirmation();
        contract = await waitForContractAt(LowAmountTez, (await op.contract()).address);
        expect(op.status).toEqual('applied');
      }
      catch (ex: any) {
        console.log(ex.message);
        throw ex;
      }
    });

    it('Verify .estimate.transfer with allocated destination', async () => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 0.019 });
      expectEstimate(estimate, rpc, {
        gasLimit: 2101,
        storageLimit: 0,
        suggestedFeeMutez: 390,
        burnFeeMutez: 0,
        minimalFeeMutez: 370,
        totalCost: 370,
        usingBaseFeeMutez: 370,
        consumedMilligas: 2100040,
      }, {
        gasLimit: 2101,
        storageLimit: 0,
        suggestedFeeMutez: 388,
        burnFeeMutez: 0,
        minimalFeeMutez: 368,
        totalCost: 368,
        usingBaseFeeMutez: 368,
        consumedMilligas: 2100040,
      });
    });

    it('Verify .estimate.transfer with unallocated destination', async () => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), amount: 0.017 });
      expectEstimate(estimate, rpc, {
        gasLimit: 2101,
        storageLimit: 277,
        suggestedFeeMutez: 390,
        burnFeeMutez: 69250,
        minimalFeeMutez: 370,
        totalCost: 69620,
        usingBaseFeeMutez: 370,
        consumedMilligas: 2100040,
      }, {
        gasLimit: 2101,
        storageLimit: 277,
        suggestedFeeMutez: 388,
        burnFeeMutez: 69250,
        minimalFeeMutez: 368,
        totalCost: 69618,
        usingBaseFeeMutez: 368,
        consumedMilligas: 2100040,
      });
    });

    it('Verify .estimate.originate simple contract', async () => {
      const estimate = await LowAmountTez.estimate.originate({
        balance: '1',
        code: ligoSample,
        storage: 0,
      });
      expectEstimate(estimate, rpc, {
        gasLimit: 677,
        storageLimit: 591,
        suggestedFeeMutez: 539,
        burnFeeMutez: 147750,
        minimalFeeMutez: 519,
        totalCost: 148269,
        usingBaseFeeMutez: 519,
        consumedMilligas: 676402,
      }, {
        gasLimit: 677,
        storageLimit: 591,
        suggestedFeeMutez: 537,
        burnFeeMutez: 147750,
        minimalFeeMutez: 517,
        totalCost: 148267,
        usingBaseFeeMutez: 517,
        consumedMilligas: 676402,
      });
    });

    it('Verify .estimate.setDelegate result', async () => {
      const estimate = await LowAmountTez.estimate.setDelegate({
        delegate: knownBaker,
        source: pkh,
      });
      expectEstimate(estimate, rpc, {
        gasLimit: 100,
        storageLimit: 0,
        suggestedFeeMutez: 185,
        burnFeeMutez: 0,
        minimalFeeMutez: 165,
        totalCost: 165,
        usingBaseFeeMutez: 165,
        consumedMilligas: 100000,
      }, {
        gasLimit: 100,
        storageLimit: 0,
        suggestedFeeMutez: 183,
        burnFeeMutez: 0,
        minimalFeeMutez: 163,
        totalCost: 163,
        usingBaseFeeMutez: 163,
        consumedMilligas: 100000,
      });
    });

    it('Verify .estimate.transfer for internal transfer to allocated implicit', async () => {
      const tx = contract.methodsObject.do(MANAGER_LAMBDA.transferImplicit(knownBaker, 5)).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx);
      expectEstimate(estimate, rpc, {
        gasLimit: 3458,
        storageLimit: 0,
        suggestedFeeMutez: 598,
        burnFeeMutez: 0,
        minimalFeeMutez: 578,
        totalCost: 578,
        usingBaseFeeMutez: 578,
        consumedMilligas: 3457645,
      }, {
        gasLimit: 3458,
        storageLimit: 0,
        suggestedFeeMutez: 596,
        burnFeeMutez: 0,
        minimalFeeMutez: 576,
        totalCost: 576,
        usingBaseFeeMutez: 576,
        consumedMilligas: 3457129,
      }, {
        gasLimit: 3458,
        storageLimit: 0,
        suggestedFeeMutez: 596,
        burnFeeMutez: 0,
        minimalFeeMutez: 576,
        totalCost: 576,
        usingBaseFeeMutez: 576,
        consumedMilligas: 3457258,
      });
    });

    it('Verify .estimate.transfer for multiple internal transfers to unallocated account', async () => {
      const tx = contract.methodsObject.do(transferImplicit2(
        await (await createAddress()).signer.publicKeyHash(),
        await (await createAddress()).signer.publicKeyHash(),
        50)
      ).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx);
      expectEstimate(estimate, rpc, {
        gasLimit: 5573,
        storageLimit: 534,
        suggestedFeeMutez: 869,
        burnFeeMutez: 133500,
        minimalFeeMutez: 849,
        totalCost: 134349,
        usingBaseFeeMutez: 849,
        consumedMilligas: 5572174,
      }, {
        gasLimit: 5572,
        storageLimit: 534,
        suggestedFeeMutez: 867,
        burnFeeMutez: 133500,
        minimalFeeMutez: 847,
        totalCost: 134347,
        usingBaseFeeMutez: 847,
        consumedMilligas: 5571658,
      }, {
        gasLimit: 5572,
        storageLimit: 534,
        suggestedFeeMutez: 867,
        burnFeeMutez: 133500,
        minimalFeeMutez: 847,
        totalCost: 134347,
        usingBaseFeeMutez: 847,
        consumedMilligas: 5571787,
      });
    });

    it('Verify .estimate.transfer for internal origination', async () => {
      const tx = contract.methodsObject.do(originate()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx);
      expectEstimate(estimate, rpc, {
        gasLimit: 1869,
        storageLimit: 337,
        suggestedFeeMutez: 445,
        burnFeeMutez: 84250,
        minimalFeeMutez: 425,
        totalCost: 84675,
        usingBaseFeeMutez: 425,
        consumedMilligas: 1868269,
      }, {
        gasLimit: 1868,
        storageLimit: 337,
        suggestedFeeMutez: 443,
        burnFeeMutez: 84250,
        minimalFeeMutez: 423,
        totalCost: 84673,
        usingBaseFeeMutez: 423,
        consumedMilligas: 1867753,
      }, {
        gasLimit: 1868,
        storageLimit: 337,
        suggestedFeeMutez: 443,
        burnFeeMutez: 84250,
        minimalFeeMutez: 423,
        totalCost: 84673,
        usingBaseFeeMutez: 423,
        consumedMilligas: 1867882,
      });
    });

    it('Verify .estimate.transfer for multiple internal originations', async () => {
      const tx = contract.methodsObject.do(originate2()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx);
      expectEstimate(estimate, rpc, {
        gasLimit: 2394,
        storageLimit: 654,
        suggestedFeeMutez: 563,
        burnFeeMutez: 163500,
        minimalFeeMutez: 543,
        totalCost: 164043,
        usingBaseFeeMutez: 543,
        consumedMilligas: 2393422,
      }, {
        gasLimit: 2393,
        storageLimit: 654,
        suggestedFeeMutez: 561,
        burnFeeMutez: 163500,
        minimalFeeMutez: 541,
        totalCost: 164041,
        usingBaseFeeMutez: 541,
        consumedMilligas: 2392906,
      }, {
        gasLimit: 2394,
        storageLimit: 654,
        suggestedFeeMutez: 561,
        burnFeeMutez: 163500,
        minimalFeeMutez: 541,
        totalCost: 164041,
        usingBaseFeeMutez: 541,
        consumedMilligas: 2393035,
      });
      // Do the actual operation
      const op2 = await contract.methodsObject.do(originate2()).send();
      await op2.confirmation();
    });

    it('should throw error when trying to estimate transfer with negative amount in param', async () => {
      await expect(async () => {
        const est = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: -1 });
      }).rejects.toThrowError(InvalidAmountError);
    });
  });


  describe(`Test estimate scenarios with very low balance using: ${rpc}`, () => {
    let LowAmountTez: TezosToolkit;
    let amt = 2000

    beforeAll(async () => {
      await setup({ preferFreshKey: true, minBalanceMutez: 5_000_000 });
      LowAmountTez = await createAddress(PrefixV2.Secp256k1SecretKey);
      const pkh = await LowAmountTez.signer.publicKeyHash();
      amt += getRevealFee(pkh);
      const transfer = await Tezos.contract.transfer({ to: pkh, mutez: true, amount: amt });
      await transfer.confirmation();
    });

    it('Verify .estimate.transfer to regular address', async () => {
      let estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + getRevealFee(pkh)) });
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

    it('Estimate transfer to regular address with a fixed fee', async () => {

      const params = { fee: 2000, to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + getRevealFee(pkh)) };
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
        LowAmountTez.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), mutez: true, amount: amt - (1382 + getRevealFee(pkh)) })
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

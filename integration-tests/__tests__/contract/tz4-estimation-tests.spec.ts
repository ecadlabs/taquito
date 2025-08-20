import { MANAGER_LAMBDA, Protocols, TezosToolkit, getRevealFee } from '@taquito/taquito';
import { Contract } from '@taquito/taquito';
import { CONFIGS } from '../../config';
import { originate, originate2, transferImplicit2 } from '../../data/lambda';
import { ligoSample } from '../../data/ligo-simple-contract';
import { managerCode } from '../../data/manager_code';
import { InvalidAmountError } from '@taquito/core';
import { PrefixV2 } from '@taquito/utils';
import { ProtoGreaterOrEqual } from '@taquito/michel-codec';

CONFIGS().forEach(({ lib, setup, knownBaker, createAddress, rpc, protocol }) => {
  const seoulnetAndAlpha = ProtoGreaterOrEqual(protocol, Protocols.PtSeouLou) ? test : test;

  const Tezos = lib;
  let pkh: string;
  describe(`Test estimate scenarios using: ${rpc}`, () => {
    let Tz4: TezosToolkit;
    let contract: Contract;
    let amt = 2000000

    beforeAll(async () => {
      try {
        await setup();
        Tz4 = await createAddress(PrefixV2.BLS12_381SecretKey);
        pkh = await Tz4.signer.publicKeyHash();
        amt += getRevealFee(pkh);
        const transfer = await Tezos.contract.transfer({ to: pkh, mutez: true, amount: amt });
        await transfer.confirmation();
        const op = await Tezos.contract.originate({
          balance: '1',
          code: managerCode,
          init: { 'string': pkh },
          fee: 800,
        });
        await op.confirmation();
        contract = await Tz4.contract.at((await op.contract()).address);
        expect(op.status).toEqual('applied');
      }
      catch (ex: any) {
        console.log(ex.message);
      }
    });

    seoulnetAndAlpha('Verify .estimate.transfer with allocated destination', async () => {
      const estimate = await Tz4.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 0.019 });
      expect(estimate.gasLimit).toEqual(2101);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(504);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(484);
      expect(estimate.totalCost).toEqual(484);
      expect(estimate.usingBaseFeeMutez).toEqual(484);
      expect(estimate.consumedMilligas).toEqual(2100040);
    });

    seoulnetAndAlpha('Verify .estimate.transfer with unallocated destination', async () => {
      const estimate = await Tz4.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), amount: 0.017 });
      expect(estimate.gasLimit).toEqual(2101);
      expect(estimate.storageLimit).toEqual(277);
      expect(estimate.suggestedFeeMutez).toEqual(504);
      expect(estimate.burnFeeMutez).toEqual(69250);
      expect(estimate.minimalFeeMutez).toEqual(484);
      expect(estimate.totalCost).toEqual(69734);
      expect(estimate.usingBaseFeeMutez).toEqual(484);
      expect(estimate.consumedMilligas).toEqual(2100040);
    });

    seoulnetAndAlpha('Verify .estimate.originate simple contract', async () => {
      const estimate = await Tz4.estimate.originate({
        balance: '1',
        code: ligoSample,
        storage: 0,
      });
      expect(estimate.gasLimit).toEqual(677);
      expect(estimate.storageLimit).toEqual(591);
      expect(estimate.suggestedFeeMutez).toEqual(653);
      expect(estimate.burnFeeMutez).toEqual(147750);
      expect(estimate.minimalFeeMutez).toEqual(633);
      expect(estimate.totalCost).toEqual(148383);
      expect(estimate.usingBaseFeeMutez).toEqual(633);
      expect(estimate.consumedMilligas).toEqual(676402);
    });

    seoulnetAndAlpha('Verify .estimate.setDelegate result', async () => {
      const estimate = await Tz4.estimate.setDelegate({
        delegate: knownBaker,
        source: pkh,
      });
      expect(estimate.gasLimit).toEqual(100);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(299);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(279);
      expect(estimate.totalCost).toEqual(279);
      expect(estimate.usingBaseFeeMutez).toEqual(279);
      expect(estimate.consumedMilligas).toEqual(100000);
    });

    seoulnetAndAlpha('Verify .estimate.transfer for internal transfer to allocated implicit', async () => {
      const tx = contract.methodsObject.do(MANAGER_LAMBDA.transferImplicit(knownBaker, 5)).toTransferParams();
      const estimate = await Tz4.estimate.transfer(tx);
      expect(estimate.gasLimit).toEqual(3457);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(712);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(692);
      expect(estimate.totalCost).toEqual(692);
      expect(estimate.usingBaseFeeMutez).toEqual(692);
      expect(estimate.consumedMilligas).toEqual(3456142);
    });

    seoulnetAndAlpha('Verify .estimate.transfer for multiple internal transfers to unallocated account', async () => {
      const tx = contract.methodsObject.do(transferImplicit2(
        await (await createAddress()).signer.publicKeyHash(),
        await (await createAddress()).signer.publicKeyHash(),
        50)
      ).toTransferParams();
      const estimate = await Tz4.estimate.transfer(tx);
      expect(estimate.gasLimit).toEqual(5571);
      expect(estimate.storageLimit).toEqual(534);
      expect(estimate.suggestedFeeMutez).toEqual(983);
      expect(estimate.burnFeeMutez).toEqual(133500);
      expect(estimate.minimalFeeMutez).toEqual(963);
      expect(estimate.totalCost).toEqual(134463);
      expect(estimate.usingBaseFeeMutez).toEqual(963);
      expect(estimate.consumedMilligas).toEqual(5570671);
    });

    seoulnetAndAlpha('Verify .estimate.transfer for internal origination', async () => {
      const tx = contract.methodsObject.do(originate()).toTransferParams();
      const estimate = await Tz4.estimate.transfer(tx);
      expect(estimate.gasLimit).toEqual(1867);
      expect(estimate.storageLimit).toEqual(337);
      expect(estimate.suggestedFeeMutez).toEqual(559);
      expect(estimate.burnFeeMutez).toEqual(84250);
      expect(estimate.minimalFeeMutez).toEqual(539);
      expect(estimate.totalCost).toEqual(84789);
      expect(estimate.usingBaseFeeMutez).toEqual(539);
      expect(estimate.consumedMilligas).toEqual(1866766);
    });

    seoulnetAndAlpha('Verify .estimate.transfer for multiple internal originations', async () => {
      const tx = contract.methodsObject.do(originate2()).toTransferParams();
      const estimate = await Tz4.estimate.transfer(tx);
      expect(estimate.gasLimit).toEqual(2392);
      expect(estimate.storageLimit).toEqual(654);
      expect(estimate.suggestedFeeMutez).toEqual(677);
      expect(estimate.burnFeeMutez).toEqual(163500);
      expect(estimate.minimalFeeMutez).toEqual(657);
      expect(estimate.totalCost).toEqual(164157);
      expect(estimate.usingBaseFeeMutez).toEqual(657);
      expect(estimate.consumedMilligas).toEqual(2391919);
      // TODO: uncomment when we optimize gas estimation for bls
      // Do the actual operation
      // const op2 = await contract.methodsObject.do(originate2()).send();
      // await op2.confirmation();
    });

    seoulnetAndAlpha('should throw error when trying to estimate transfer with negative amount in param', async () => {
      expect(async () => {
        const est = await Tz4.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: -1 });
      }).rejects.toThrowError(InvalidAmountError);
    });
  });


  describe(`Test estimate scenarios with very low balance using: ${rpc}`, () => {
    let LowAmountTz4: TezosToolkit;
    let amt = 2000

    beforeAll(async () => {
      await setup();
      LowAmountTz4 = await createAddress(PrefixV2.BLS12_381SecretKey);
      const pkh = await LowAmountTz4.signer.publicKeyHash();
      amt += getRevealFee(pkh);
      const transfer = await Tezos.contract.transfer({ to: pkh, mutez: true, amount: amt });
      await transfer.confirmation();
    });

    seoulnetAndAlpha('Verify .estimate.transfer to regular address', async () => {
      let estimate = await LowAmountTz4.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + getRevealFee(pkh)) });
      expect(estimate.gasLimit).toEqual(2101);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(503);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(483);
      expect(estimate.totalCost).toEqual(483);
      expect(estimate.usingBaseFeeMutez).toEqual(483);
      expect(estimate.consumedMilligas).toEqual(2100040);
    });

    seoulnetAndAlpha('Estimate transfer to regular address with a fixed fee', async () => {

      const params = { fee: 2000, to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + getRevealFee(pkh)) };
      await expect(LowAmountTz4.estimate.transfer(params)).rejects.toMatchObject({
        id: expect.stringContaining('empty_implicit_contract'),
      });
    });

    seoulnetAndAlpha('Estimate transfer to regular address with insufficient balance', async () => {
      await expect(
        LowAmountTz4.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt })
      ).rejects.toMatchObject({
        id: expect.stringContaining('subtraction_underflow'),
      });
    });

    seoulnetAndAlpha('Estimate transfer to regular address with insufficient balance to pay storage for allocation', async () => {
      await expect(
        LowAmountTz4.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), mutez: true, amount: amt - (1382 + getRevealFee(pkh)) })
      ).rejects.toEqual(
        expect.objectContaining({
          errors: expect.arrayContaining([expect.objectContaining({ id: expect.stringContaining('cannot_pay_storage_fee') })]),
          message: expect.stringContaining('subtraction_underflow'),
        }));
    });

    seoulnetAndAlpha('Estimate origination with insufficient balance to pay storage', async () => {
      expect(true).toBeTruthy();
      await expect(LowAmountTz4.estimate.originate({
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
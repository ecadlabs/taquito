import { DEFAULT_FEE, MANAGER_LAMBDA, TezosToolkit } from "@taquito/taquito";
import { Contract } from "@taquito/taquito";
import { CONFIGS } from "./config";
import { originate, originate2, transferImplicit2 } from "./data/lambda";
import { ligoSample } from "./data/ligo-simple-contract";
import { managerCode } from "./data/manager_code";
import { InvalidAmountError } from "@taquito/core";

CONFIGS().forEach(({ lib, setup, knownBaker, createAddress, rpc }) => {
  const Tezos = lib;

  describe(`Test estimate scenarios using: ${rpc}`, () => {
    let LowAmountTez: TezosToolkit;
    let contract: Contract;
    const amt = 2000000 + DEFAULT_FEE.REVEAL;

    beforeAll(async (done) => {
      try {
        await setup();
        LowAmountTez = await createAddress();
        const pkh = await LowAmountTez.signer.publicKeyHash();
        const transfer = await Tezos.contract.transfer({ to: pkh, mutez: true, amount: amt });
        await transfer.confirmation();
        const op = await Tezos.contract.originate({
          balance: "1",
          code: managerCode,
          init: { "string": pkh },
        });
        contract = await op.contract();
        contract = await LowAmountTez.contract.at(contract.address);
        expect(op.status).toEqual('applied');
      }
      catch (ex: any) {
        fail(ex.message);
      } finally {
        done();
      }
    });

    it('Verify .estimate.transfer with allocated destination', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 0.019 });
      expect(estimate.gasLimit).toEqual(201);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(374);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(274);
      expect(estimate.totalCost).toEqual(274);
      expect(estimate.usingBaseFeeMutez).toEqual(274);
      expect(estimate.consumedMilligas).toEqual(100040);
      done();
    });

    it('Verify .estimate.transfer with unallocated destination', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), amount: 0.017 });
      expect(estimate.gasLimit).toEqual(201);
      expect(estimate.storageLimit).toEqual(257);
      expect(estimate.suggestedFeeMutez).toEqual(374);
      expect(estimate.burnFeeMutez).toEqual(64250);
      expect(estimate.minimalFeeMutez).toEqual(274);
      expect(estimate.totalCost).toEqual(64524);
      expect(estimate.usingBaseFeeMutez).toEqual(274);
      expect(estimate.consumedMilligas).toEqual(100040);
      done();
    });

    it('Verify .estimate.originate simple contract', async (done) => {
      const estimate = await LowAmountTez.estimate.originate({
        balance: "1",
        code: ligoSample,
        storage: 0,
      });
      expect(estimate.gasLimit).toEqual(677);
      expect(estimate.storageLimit).toEqual(571);
      expect(estimate.suggestedFeeMutez).toEqual(713);
      expect(estimate.burnFeeMutez).toEqual(142750);
      expect(estimate.minimalFeeMutez).toEqual(613);
      expect(estimate.totalCost).toEqual(143363);
      expect(estimate.usingBaseFeeMutez).toEqual(613);
      expect(estimate.consumedMilligas).toEqual(576347);
      done();
    });

    it('Verify .estimate.setDelegate result', async (done) => {
      const estimate = await LowAmountTez.estimate.setDelegate({
        delegate: knownBaker,
        source: await LowAmountTez.signer.publicKeyHash(),
      });
      expect(estimate.gasLimit).toEqual(200);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(369);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(269);
      expect(estimate.totalCost).toEqual(269);
      expect(estimate.usingBaseFeeMutez).toEqual(269);
      expect(estimate.consumedMilligas).toEqual(100000);
      done();
    });

    it('Verify .estimate.transfer for internal transfer to allocated implicit', async (done) => {
      const tx = contract.methods.do(MANAGER_LAMBDA.transferImplicit(knownBaker, 5)).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx);
      expect(estimate.gasLimit).toEqual(1457);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(572);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(472);
      expect(estimate.totalCost).toEqual(472);
      expect(estimate.usingBaseFeeMutez).toEqual(472);
      expect(estimate.consumedMilligas).toEqual(1356735);
      done();
    });

    it('Verify .estimate.transfer for multiple internal transfers to unallocated account', async (done) => {
      const tx = contract.methods.do(transferImplicit2(
        await (await createAddress()).signer.publicKeyHash(),
        await (await createAddress()).signer.publicKeyHash(),
        50)
      ).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx);
      expect(estimate.gasLimit).toEqual(1572);
      expect(estimate.storageLimit).toEqual(514);
      expect(estimate.suggestedFeeMutez).toEqual(643);
      expect(estimate.burnFeeMutez).toEqual(128500);
      expect(estimate.minimalFeeMutez).toEqual(543);
      expect(estimate.totalCost).toEqual(129043);
      expect(estimate.usingBaseFeeMutez).toEqual(543);
      expect(estimate.consumedMilligas).toEqual(1471270);
      done();
    });

    it('Verify .estimate.transfer for internal origination', async (done) => {
      const tx = contract.methods.do(originate()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx);
      expect(estimate.gasLimit).toEqual(1868);
      expect(estimate.storageLimit).toEqual(317);
      expect(estimate.suggestedFeeMutez).toEqual(619);
      expect(estimate.burnFeeMutez).toEqual(79250);
      expect(estimate.minimalFeeMutez).toEqual(519);
      expect(estimate.totalCost).toEqual(79769);
      expect(estimate.usingBaseFeeMutez).toEqual(519);
      expect(estimate.consumedMilligas).toEqual(1767848);
      done();
    });

    it('Verify .estimate.transfer for multiple internal originations', async (done) => {
      const tx = contract.methods.do(originate2()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx);
      expect(estimate.gasLimit).toEqual(2394);
      expect(estimate.storageLimit).toEqual(634);
      expect(estimate.suggestedFeeMutez).toEqual(737);
      expect(estimate.burnFeeMutez).toEqual(158500);
      expect(estimate.minimalFeeMutez).toEqual(637);
      expect(estimate.totalCost).toEqual(159137);
      expect(estimate.usingBaseFeeMutez).toEqual(637);
      expect(estimate.consumedMilligas).toEqual(2293496);
      // Do the actual operation
      const op2 = await contract.methods.do(originate2()).send();
      await op2.confirmation();
      done();
    });

    it('should throw error when trying to estimate transfer with negative amount in param', async (done) => {
      expect(async () => {
        const est = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: -1 });
      }).rejects.toThrowError(InvalidAmountError);
      done();
    });
  });


  describe(`Test estimate scenarios with very low balance using: ${rpc}`, () => {
    let LowAmountTez: TezosToolkit;
    const amt = 2000 + DEFAULT_FEE.REVEAL;

    beforeAll(async (done) => {
      await setup();
      LowAmountTez = await createAddress();
      const pkh = await LowAmountTez.signer.publicKeyHash();
      const transfer = await Tezos.contract.transfer({ to: pkh, mutez: true, amount: amt });
      await transfer.confirmation();
      done();
    });

    it('Verify .estimate.transfer to regular address', async (done) => {
      let estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) });
      expect(estimate.gasLimit).toEqual(201);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(372);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(272);
      expect(estimate.totalCost).toEqual(272);
      expect(estimate.usingBaseFeeMutez).toEqual(272);
      expect(estimate.consumedMilligas).toEqual(100040);
      done();
    });

    it('Estimate transfer to regular address with a fixed fee', async (done) => {

      const params = { fee: 2000, to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) };

      await expect(LowAmountTez.estimate.transfer(params)).rejects.toMatchObject({
        id: 'proto.017-PtNairob.implicit.empty_implicit_contract',
      });
      done();
    });

    it('Estimate transfer to regular address with insufficient balance', async (done) => {
      await expect(
        LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt })
      ).rejects.toMatchObject({
        id: 'proto.017-PtNairob.tez.subtraction_underflow',
      });
      done();
    });

    it('Estimate transfer to regular address with insufficient balance to pay storage for allocation', async (done) => {
      await expect(
        LowAmountTez.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) })
      ).rejects.toEqual(
        expect.objectContaining({
          message: expect.stringContaining('storage_exhausted'),
        }));
      done();
    });

    it('Estimate origination with insufficient balance to pay storage', async (done) => {
      await expect(LowAmountTez.estimate.originate({
        balance: "0",
        code: ligoSample,
        storage: 0,
      })).rejects.toEqual(
        expect.objectContaining({
          message: expect.stringContaining('storage_exhausted'),
        }));
      done();
    });
  });
});
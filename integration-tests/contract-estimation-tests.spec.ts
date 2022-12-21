import { DEFAULT_FEE, MANAGER_LAMBDA, TezosToolkit, Protocols, ChainIds } from "@taquito/taquito";
import { Contract } from "@taquito/taquito";
import { CONFIGS } from "./config";
import { originate, originate2, transferImplicit2 } from "./data/lambda";
import { ligoSample } from "./data/ligo-simple-contract";
import { managerCode } from "./data/manager_code";

CONFIGS().forEach(({ lib, setup, knownBaker, createAddress, protocol, rpc }) => {
  const Tezos = lib;
  const limanet = (protocol === Protocols.PtLimaPtL) ? test : test.skip;

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

    limanet('Verify .estimate.transfer with allocated destination', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 0.019 });
      expect(estimate.gasLimit).toEqual(1101);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(464);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(364);
      expect(estimate.totalCost).toEqual(364);
      expect(estimate.usingBaseFeeMutez).toEqual(364);
      expect(estimate.consumedMilligas).toEqual(1000040);
      done();
    });

    limanet('Verify .estimate.transfer with unallocated destination', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), amount: 0.017 });
      expect(estimate.gasLimit).toEqual(1101);
      expect(estimate.storageLimit).toEqual(257);
      expect(estimate.suggestedFeeMutez).toEqual(464);
      expect(estimate.burnFeeMutez).toEqual(64250);
      expect(estimate.minimalFeeMutez).toEqual(364);
      expect(estimate.totalCost).toEqual(64614);
      expect(estimate.usingBaseFeeMutez).toEqual(364);
      expect(estimate.consumedMilligas).toEqual(1000040);
      done();
    });

    limanet('Verify .estimate.originate simple contract', async (done) => {
      const estimate = await LowAmountTez.estimate.originate({
        balance: "1",
        code: ligoSample,
        storage: 0,
      });
      expect(estimate.gasLimit).toEqual(1577);
      expect(estimate.storageLimit).toEqual(571);
      expect(estimate.suggestedFeeMutez).toEqual(803);
      expect(estimate.burnFeeMutez).toEqual(142750);
      expect(estimate.minimalFeeMutez).toEqual(703);
      expect(estimate.totalCost).toEqual(143453);
      expect(estimate.usingBaseFeeMutez).toEqual(703);
      expect(estimate.consumedMilligas).toEqual(1476347);
      done();
    });

    limanet('Verify .estimate.setDelegate result', async (done) => {
      const estimate = await LowAmountTez.estimate.setDelegate({
        delegate: knownBaker,
        source: await LowAmountTez.signer.publicKeyHash(),
      });
      expect(estimate.gasLimit).toEqual(1100);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(459);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(359);
      expect(estimate.totalCost).toEqual(359);
      expect(estimate.usingBaseFeeMutez).toEqual(359);
      expect(estimate.consumedMilligas).toEqual(1000000);
      done();
    });

    limanet('Verify .estimate.transfer for internal transfer to allocated implicit', async (done) => {
      const tx = contract.methods.do(MANAGER_LAMBDA.transferImplicit(knownBaker, 5)).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx);
      expect(estimate.gasLimit).toEqual(3249);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(751);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(651);
      expect(estimate.totalCost).toEqual(651);
      expect(estimate.usingBaseFeeMutez).toEqual(651);
      expect(estimate.consumedMilligas).toEqual(3148786);
      done();
    });

    limanet('Verify .estimate.transfer for multiple internal transfers to unallocated account', async (done) => {
      const tx = contract.methods.do(transferImplicit2(
        await (await createAddress()).signer.publicKeyHash(),
        await (await createAddress()).signer.publicKeyHash(),
        50)
      ).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx);
      expect(estimate.gasLimit).toEqual(4257);
      expect(estimate.storageLimit).toEqual(514);
      expect(estimate.suggestedFeeMutez).toEqual(911);
      expect(estimate.burnFeeMutez).toEqual(128500);
      expect(estimate.minimalFeeMutez).toEqual(811);
      expect(estimate.totalCost).toEqual(129311);
      expect(estimate.usingBaseFeeMutez).toEqual(811);
      expect(estimate.consumedMilligas).toEqual(4156456);
      done();
    });

    limanet('Verify .estimate.transfer for internal origination', async (done) => {
      const tx = contract.methods.do(originate()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx);
      expect(estimate.gasLimit).toEqual(3660);
      expect(estimate.storageLimit).toEqual(317);
      expect(estimate.suggestedFeeMutez).toEqual(798);
      expect(estimate.burnFeeMutez).toEqual(79250);
      expect(estimate.minimalFeeMutez).toEqual(698);
      expect(estimate.totalCost).toEqual(79948);
      expect(estimate.usingBaseFeeMutez).toEqual(698);
      expect(estimate.consumedMilligas).toEqual(3559296);
      done();
    });

    limanet('Verify .estimate.transfer for multiple internal originations', async (done) => {
      const tx = contract.methods.do(originate2()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx);
      expect(estimate.gasLimit).toEqual(5078);
      expect(estimate.storageLimit).toEqual(634);
      expect(estimate.suggestedFeeMutez).toEqual(1005);
      expect(estimate.burnFeeMutez).toEqual(158500);
      expect(estimate.minimalFeeMutez).toEqual(905);
      expect(estimate.totalCost).toEqual(159405);
      expect(estimate.usingBaseFeeMutez).toEqual(905);
      expect(estimate.consumedMilligas).toEqual(4977476);
      // Do the actual operation
      const op2 = await contract.methods.do(originate2()).send();
      await op2.confirmation();
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

    limanet('Verify .estimate.transfer to regular address', async (done) => {
      let estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) });
      expect(estimate.gasLimit).toEqual(1101);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(462);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(362);
      expect(estimate.totalCost).toEqual(362);
      expect(estimate.usingBaseFeeMutez).toEqual(362);
      expect(estimate.consumedMilligas).toEqual(1000040);
      done();
    });

    limanet('Estimate transfer to regular address with a fixed fee', async (done) => {

      const params = { fee: 2000, to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) };

      await expect(LowAmountTez.estimate.transfer(params)).rejects.toMatchObject({
        id: 'proto.015-PtLimaPt.implicit.empty_implicit_contract',
      });
      done();
    });

    limanet('Estimate transfer to regular address with insufficient balance', async (done) => {
      await expect(
        LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt })
      ).rejects.toMatchObject({
        id: 'proto.015-PtLimaPt.tez.subtraction_underflow',
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

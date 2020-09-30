import { DEFAULT_FEE, MANAGER_LAMBDA, TezosToolkit, Protocols } from "@taquito/taquito";
import { Contract } from "taquito/src/contract/contract";
import { CONFIGS } from "./config";
import { originate, originate2, transferImplicit2 } from "./data/lambda";
import { ligoSample } from "./data/ligo-simple-contract";
import { managerCode } from "./data/manager_code";

CONFIGS().forEach(({ lib, setup, knownBaker, createAddress, protocol }) => {
  const Tezos = lib;

  if (protocol === Protocols.PsDELPH1) {

  describe('Estimate scenario', () => {
    let LowAmountTez: TezosToolkit;
    let contract: Contract;
    const amt = 2000000 + DEFAULT_FEE.REVEAL;

    beforeAll(async (done) => {
      try {
        await setup()
        LowAmountTez = await createAddress();
        const pkh = await LowAmountTez.signer.publicKeyHash()
        const transfer = await Tezos.contract.transfer({ to: pkh, mutez: true, amount: amt });
        await transfer.confirmation();
        const op = await Tezos.contract.originate({
          balance: "1",
          code: managerCode,
          init: { "string": pkh },
        })
        contract = await op.contract();
        contract = await LowAmountTez.contract.at(contract.address)
        expect(op.status).toEqual('applied')
      }
      catch (ex) {
        fail(ex.message)
      } finally {
        done()
      }
    })

    test('Estimate transfer with allocated destination', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 1.9 });
      expect(estimate.gasLimit).toEqual(1527);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(506);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(406);
      expect(estimate.totalCost).toEqual(406);
      expect(estimate.usingBaseFeeMutez).toEqual(406);
      done();
    })

    test('Estimate transfer with unallocated destination', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), amount: 1.7 });
      expect(estimate.gasLimit).toEqual(1527);
      expect(estimate.storageLimit).toEqual(257);
      expect(estimate.suggestedFeeMutez).toEqual(506);
      expect(estimate.burnFeeMutez).toEqual(64250);
      expect(estimate.minimalFeeMutez).toEqual(406);
      expect(estimate.totalCost).toEqual(64656);
      expect(estimate.usingBaseFeeMutez).toEqual(406);
      done();
    });

    test('Estimate simple origination', async (done) => {
      const estimate = await LowAmountTez.estimate.originate({
        balance: "1",
        code: ligoSample,
        storage: 0,
      })
      expect(estimate.gasLimit).toEqual(2775);
      expect(estimate.storageLimit).toEqual(571);
      expect(estimate.suggestedFeeMutez).toEqual(923);
      expect(estimate.burnFeeMutez).toEqual(142750);
      expect(estimate.minimalFeeMutez).toEqual(823);
      expect(estimate.totalCost).toEqual(143573);
      expect(estimate.usingBaseFeeMutez).toEqual(823);
      done();
    });

    test('Estimate setDelegate', async (done) => {
      const estimate = await LowAmountTez.estimate.setDelegate({
        delegate: knownBaker,
        source: await LowAmountTez.signer.publicKeyHash(),
      })
      expect(estimate.gasLimit).toEqual(1100);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(459);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(359);
      expect(estimate.totalCost).toEqual(359);
      expect(estimate.usingBaseFeeMutez).toEqual(359);
      done();
    })

    test('Estimate internal transfer to allocated implicit', async (done) => {
      const tx = contract.methods.do(MANAGER_LAMBDA.transferImplicit(knownBaker, 50)).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(4963);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(923);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(823);
      expect(estimate.totalCost).toEqual(823);
      expect(estimate.usingBaseFeeMutez).toEqual(823);
      done();
    })

    test('Estimate to multiple internal transfer to unallocated account', async (done) => {
      const tx = contract.methods.do(transferImplicit2(
        await (await createAddress()).signer.publicKeyHash(),
        await (await createAddress()).signer.publicKeyHash(),
        50)
      ).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(6549);
      expect(estimate.storageLimit).toEqual(514);
      expect(estimate.suggestedFeeMutez).toEqual(1140);
      expect(estimate.burnFeeMutez).toEqual(128500);
      expect(estimate.minimalFeeMutez).toEqual(1040);
      expect(estimate.totalCost).toEqual(129540);
      expect(estimate.usingBaseFeeMutez).toEqual(1040);
      done();
    })

    test('Estimate internal origination', async (done) => {
      const tx = contract.methods.do(originate()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(5568);
      expect(estimate.storageLimit).toEqual(317);
      expect(estimate.suggestedFeeMutez).toEqual(989);
      expect(estimate.burnFeeMutez).toEqual(79250);
      expect(estimate.minimalFeeMutez).toEqual(889);
      expect(estimate.totalCost).toEqual(80139);
      expect(estimate.usingBaseFeeMutez).toEqual(889);
      done();
    })

    test('Estimate multiple internal origination', async (done) => {
      const tx = contract.methods.do(originate2()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(7758);
      expect(estimate.storageLimit).toEqual(634);
      expect(estimate.suggestedFeeMutez).toEqual(1273);
      expect(estimate.burnFeeMutez).toEqual(158500);
      expect(estimate.minimalFeeMutez).toEqual(1173);
      expect(estimate.totalCost).toEqual(159673);
      expect(estimate.usingBaseFeeMutez).toEqual(1173);
      // Do the actual operation
      const op2 = await contract.methods.do(originate2()).send();
      await op2.confirmation();
      done();
    })
  })

  describe('Estimate with very low balance', () => {
    let LowAmountTez: TezosToolkit;
    const amt = 2000 + DEFAULT_FEE.REVEAL;

    beforeAll(async (done) => {
      await setup()
      LowAmountTez = await createAddress();
      const pkh = await LowAmountTez.signer.publicKeyHash()
      const transfer = await Tezos.contract.transfer({ to: pkh, mutez: true, amount: amt });
      await transfer.confirmation();
      done()
    })

    it('Estimate transfer to regular address', async (done) => {
      let estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) });
      expect(estimate.gasLimit).toEqual(1527);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(504);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(404);
      expect(estimate.totalCost).toEqual(404);
      expect(estimate.usingBaseFeeMutez).toEqual(404);
      done();
    });

    it('Estimate transfer to regular address with a fixed fee', async (done) => {
      // fee, gasLimit and storage limit are not taken into account
      const params = { fee: 2000, to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) }

      await expect(LowAmountTez.estimate.transfer(params)).rejects.toEqual(
        expect.objectContaining({
          // Not sure if it is expected according to (https://tezos.gitlab.io/api/errors.html)
          message: expect.stringContaining('storage_error'),
        }));
      done();
    });

    it('Estimate transfer to regular address with unsufficient balance', async (done) => {
      await expect(
        LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt })
      ).rejects.toEqual(
        expect.objectContaining({
          message: expect.stringContaining('balance_too_low'),
        }));
      done();
    });

    it('Estimate transfer to regular address with unsufficient balance to pay storage for allocation', async (done) => {
      await expect(
        LowAmountTez.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) })
      ).rejects.toEqual(
        expect.objectContaining({
          message: expect.stringContaining('storage_exhausted'),
        }));
      done();
    });

    it('Estimate origination with unsufficient balance to pay storage', async (done) => {
      await expect(LowAmountTez.estimate.originate({
        balance: "0",
        code: ligoSample,
        storage: 0,
      })).rejects.toEqual(
        expect.objectContaining({
          message: expect.stringContaining('storage_exhausted'),
        }));
      done();
    })
  });
} else {
  test.skip
}
})

import { DEFAULT_FEE, MANAGER_LAMBDA, TezosToolkit, Protocols } from "@taquito/taquito";
import { Contract } from "taquito/src/contract/contract";
import { CONFIGS } from "./config";
import { originate, originate2, transferImplicit2 } from "./data/lambda";
import { ligoSample } from "./data/ligo-simple-contract";
import { managerCode } from "./data/manager_code";

CONFIGS().forEach(({ lib, setup, knownBaker, createAddress, protocol, rpc }) => {
  const Tezos = lib;

  const edonet = (protocol === Protocols.PtEdo2Zk) ? test : test.skip;
  const florencenet = (protocol === Protocols.PsFLorena) ? test : test.skip;

  describe(`Estimate scenario using: ${rpc}`, () => {
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

    florencenet('Estimate transfer with allocated destination', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 1.9 }, { includeRevealOperation: true });
      expect(estimate.gasLimit).toEqual(2527);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(670);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(570);
      expect(estimate.totalCost).toEqual(570);
      expect(estimate.usingBaseFeeMutez).toEqual(570);
      expect(estimate.consumedMilligas).toEqual(2427000);
      done();
    })

    edonet('Estimate transfer with allocated destination', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 1.9 }, { includeRevealOperation: true });
      expect(estimate.gasLimit).toEqual(2527);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(670);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(570);
      expect(estimate.totalCost).toEqual(570);
      expect(estimate.usingBaseFeeMutez).toEqual(570);
      expect(estimate.consumedMilligas).toEqual(2427000);
      done();
    })

    florencenet('Estimate transfer with unallocated destination', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), amount: 1.7 }, { includeRevealOperation: true });
      expect(estimate.gasLimit).toEqual(2527);
      expect(estimate.storageLimit).toEqual(257);
      expect(estimate.suggestedFeeMutez).toEqual(670);
      expect(estimate.burnFeeMutez).toEqual(64250);
      expect(estimate.minimalFeeMutez).toEqual(570);
      expect(estimate.totalCost).toEqual(64820);
      expect(estimate.usingBaseFeeMutez).toEqual(570);
      expect(estimate.consumedMilligas).toEqual(2427000);
      done();
    });

    edonet('Estimate transfer with unallocated destination', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), amount: 1.7 }, { includeRevealOperation: true });
      expect(estimate.gasLimit).toEqual(2527);
      expect(estimate.storageLimit).toEqual(257);
      expect(estimate.suggestedFeeMutez).toEqual(670);
      expect(estimate.burnFeeMutez).toEqual(64250);
      expect(estimate.minimalFeeMutez).toEqual(570);
      expect(estimate.totalCost).toEqual(64820);
      expect(estimate.usingBaseFeeMutez).toEqual(570);
      expect(estimate.consumedMilligas).toEqual(2427000);
      done();
    });

    florencenet('Estimate simple origination', async (done) => {
      const estimate = await LowAmountTez.estimate.originate({
        balance: "1",
        code: ligoSample,
        storage: 0,
      }, { includeRevealOperation: true })
      expect(estimate.gasLimit).toEqual(3751);
      expect(estimate.storageLimit).toEqual(571);
      expect(estimate.suggestedFeeMutez).toEqual(1085);
      expect(estimate.burnFeeMutez).toEqual(142750);
      expect(estimate.minimalFeeMutez).toEqual(985);
      expect(estimate.totalCost).toEqual(143735);
      expect(estimate.usingBaseFeeMutez).toEqual(985);
      expect(estimate.consumedMilligas).toEqual(3650621);
      done();
    });

    edonet('Estimate simple origination', async (done) => {
      const estimate = await LowAmountTez.estimate.originate({
        balance: "1",
        code: ligoSample,
        storage: 0,
      }, { includeRevealOperation: true })
      expect(estimate.gasLimit).toEqual(3751);
      expect(estimate.storageLimit).toEqual(571);
      expect(estimate.suggestedFeeMutez).toEqual(1085);
      expect(estimate.burnFeeMutez).toEqual(142750);
      expect(estimate.minimalFeeMutez).toEqual(985);
      expect(estimate.totalCost).toEqual(143735);
      expect(estimate.usingBaseFeeMutez).toEqual(985);
      expect(estimate.consumedMilligas).toEqual(3650621);
      done();
    });

    florencenet('Estimate setDelegate', async (done) => {
      const estimate = await LowAmountTez.estimate.setDelegate({
        delegate: knownBaker,
        source: await LowAmountTez.signer.publicKeyHash(),
      }, { includeRevealOperation: true })
      expect(estimate.gasLimit).toEqual(2100);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(623);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(523);
      expect(estimate.totalCost).toEqual(523);
      expect(estimate.usingBaseFeeMutez).toEqual(523);
      expect(estimate.consumedMilligas).toEqual(2000000);
      done();
    })

    edonet('Estimate setDelegate', async (done) => {
      const estimate = await LowAmountTez.estimate.setDelegate({
        delegate: knownBaker,
        source: await LowAmountTez.signer.publicKeyHash(),
      }, { includeRevealOperation: true })
      expect(estimate.gasLimit).toEqual(2100);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(623);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(523);
      expect(estimate.totalCost).toEqual(523);
      expect(estimate.usingBaseFeeMutez).toEqual(523);
      expect(estimate.consumedMilligas).toEqual(2000000);
      done();
    })

    florencenet('Estimate internal transfer to allocated implicit', async (done) => {
      const tx = contract.methods.do(MANAGER_LAMBDA.transferImplicit(knownBaker, 50)).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx, { includeRevealOperation: true })
      expect(estimate.gasLimit).toEqual(5936);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(1084);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(984);
      expect(estimate.totalCost).toEqual(984);
      expect(estimate.usingBaseFeeMutez).toEqual(984);
      expect(estimate.consumedMilligas).toEqual(5835751);
      done();
    })

    edonet('Estimate internal transfer to allocated implicit', async (done) => {
      const tx = contract.methods.do(MANAGER_LAMBDA.transferImplicit(knownBaker, 50)).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx, { includeRevealOperation: true })
      expect(estimate.gasLimit).toEqual(5939);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(1084);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(984);
      expect(estimate.totalCost).toEqual(984);
      expect(estimate.usingBaseFeeMutez).toEqual(984);
      expect(estimate.consumedMilligas).toEqual(5838226);
      done();
    })

    florencenet('Estimate to multiple internal transfer to unallocated account', async (done) => {
      const tx = contract.methods.do(transferImplicit2(
        await (await createAddress()).signer.publicKeyHash(),
        await (await createAddress()).signer.publicKeyHash(),
        50)
      ).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx, { includeRevealOperation: true })
      expect(estimate.gasLimit).toEqual(7522);
      expect(estimate.storageLimit).toEqual(514);
      expect(estimate.suggestedFeeMutez).toEqual(1302);
      expect(estimate.burnFeeMutez).toEqual(128500);
      expect(estimate.minimalFeeMutez).toEqual(1202);
      expect(estimate.totalCost).toEqual(129702);
      expect(estimate.usingBaseFeeMutez).toEqual(1202);
      expect(estimate.consumedMilligas).toEqual(7421121);
      done();
    })

    edonet('Estimate to multiple internal transfer to unallocated account', async (done) => {
      const tx = contract.methods.do(transferImplicit2(
        await (await createAddress()).signer.publicKeyHash(),
        await (await createAddress()).signer.publicKeyHash(),
        50)
      ).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx, { includeRevealOperation: true })
      expect(estimate.gasLimit).toEqual(7525);
      expect(estimate.storageLimit).toEqual(514);
      expect(estimate.suggestedFeeMutez).toEqual(1302);
      expect(estimate.burnFeeMutez).toEqual(128500);
      expect(estimate.minimalFeeMutez).toEqual(1202);
      expect(estimate.totalCost).toEqual(129702);
      expect(estimate.usingBaseFeeMutez).toEqual(1202);
      expect(estimate.consumedMilligas).toEqual(7424016);
      done();
    })

    florencenet('Estimate internal origination', async (done) => {
      const tx = contract.methods.do(originate()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx, { includeRevealOperation: true })
      expect(estimate.gasLimit).toEqual(6489);
      expect(estimate.storageLimit).toEqual(317);
      expect(estimate.suggestedFeeMutez).toEqual(1145);
      expect(estimate.burnFeeMutez).toEqual(79250);
      expect(estimate.minimalFeeMutez).toEqual(1045);
      expect(estimate.totalCost).toEqual(80295);
      expect(estimate.usingBaseFeeMutez).toEqual(1045);
      expect(estimate.consumedMilligas).toEqual(6388151);
      done();
    })

    edonet('Estimate internal origination', async (done) => {
      const tx = contract.methods.do(originate()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx, { includeRevealOperation: true })
      expect(estimate.gasLimit).toEqual(6491);
      expect(estimate.storageLimit).toEqual(317);
      expect(estimate.suggestedFeeMutez).toEqual(1146);
      expect(estimate.burnFeeMutez).toEqual(79250);
      expect(estimate.minimalFeeMutez).toEqual(1046);
      expect(estimate.totalCost).toEqual(80296);
      expect(estimate.usingBaseFeeMutez).toEqual(1046);
      expect(estimate.consumedMilligas).toEqual(6390686);
      done();
    })

    florencenet('Estimate multiple internal origination', async (done) => {
      const tx = contract.methods.do(originate2()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx, { includeRevealOperation: true })
      expect(estimate.gasLimit).toEqual(8626);
      expect(estimate.storageLimit).toEqual(634);
      expect(estimate.suggestedFeeMutez).toEqual(1424);
      expect(estimate.burnFeeMutez).toEqual(158500);
      expect(estimate.minimalFeeMutez).toEqual(1324);
      expect(estimate.totalCost).toEqual(159824);
      expect(estimate.usingBaseFeeMutez).toEqual(1324);
      expect(estimate.consumedMilligas).toEqual(8525921);
      // Do the actual operation
      const op2 = await contract.methods.do(originate2()).send();
      await op2.confirmation();
      done();
    })

    edonet('Estimate multiple internal origination', async (done) => {
      const tx = contract.methods.do(originate2()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx, { includeRevealOperation: true })
      expect(estimate.gasLimit).toEqual(8629);
      expect(estimate.storageLimit).toEqual(634);
      expect(estimate.suggestedFeeMutez).toEqual(1424);
      expect(estimate.burnFeeMutez).toEqual(158500);
      expect(estimate.minimalFeeMutez).toEqual(1324);
      expect(estimate.totalCost).toEqual(159824);
      expect(estimate.usingBaseFeeMutez).toEqual(1324);
      expect(estimate.consumedMilligas).toEqual(8528936);
      // Do the actual operation
      const op2 = await contract.methods.do(originate2()).send();
      await op2.confirmation();
      done();
    })
  })

  describe(`Estimate with very low balance using: ${rpc}`, () => {
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

    florencenet('Estimate transfer to regular address', async (done) => {
      let estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) }, { includeRevealOperation: true });
      expect(estimate.gasLimit).toEqual(2527);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(668);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(568);
      expect(estimate.totalCost).toEqual(568);
      expect(estimate.usingBaseFeeMutez).toEqual(568);
      expect(estimate.consumedMilligas).toEqual(2427000);
      done();
    });

    edonet('Estimate transfer to regular address', async (done) => {
      let estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) }, { includeRevealOperation: true });
      expect(estimate.gasLimit).toEqual(2527);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(668);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(568);
      expect(estimate.totalCost).toEqual(568);
      expect(estimate.usingBaseFeeMutez).toEqual(568);
      expect(estimate.consumedMilligas).toEqual(2427000);
      done();
    });

    it('Estimate transfer to regular address with a fixed fee', async (done) => {
      // fee, gasLimit and storage limit are not taken into account
      const params = { fee: 2000, to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) }

      await expect(LowAmountTez.estimate.transfer(params, { includeRevealOperation: true })).rejects.toEqual(
        expect.objectContaining({
          // Not sure if it is expected according to (https://tezos.gitlab.io/api/errors.html)
          message: expect.stringContaining('storage_error'),
        }));
      done();
    });

    it('Estimate transfer to regular address with insufficient balance', async (done) => {
      await expect(
        LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt }, { includeRevealOperation: true })
      ).rejects.toEqual(
        expect.objectContaining({
          message: expect.stringContaining('balance_too_low'),
        }));
      done();
    });

    it('Estimate transfer to regular address with insufficient balance to pay storage for allocation', async (done) => {
      await expect(
        LowAmountTez.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) }, { includeRevealOperation: true })
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
      }, { includeRevealOperation: true })).rejects.toEqual(
        expect.objectContaining({
          message: expect.stringContaining('storage_exhausted'),
        }));
      done();
    })
  });
})

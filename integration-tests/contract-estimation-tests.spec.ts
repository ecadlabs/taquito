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
      const estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 1.9 });
      expect(estimate.gasLimit).toEqual(1527);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(504);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(404);
      expect(estimate.totalCost).toEqual(404);
      expect(estimate.usingBaseFeeMutez).toEqual(404);
      expect(estimate.consumedMilligas).toEqual(1427000);
      done();
    })

    edonet('Estimate transfer with allocated destination', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 1.9 });
      expect(estimate.gasLimit).toEqual(1527);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(506);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(406);
      expect(estimate.totalCost).toEqual(406);
      expect(estimate.usingBaseFeeMutez).toEqual(406);
      expect(estimate.consumedMilligas).toEqual(1427000);
      done();
    })

    florencenet('Estimate transfer with unallocated destination', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), amount: 1.7 });
      expect(estimate.gasLimit).toEqual(1527);
      expect(estimate.storageLimit).toEqual(257);
      expect(estimate.suggestedFeeMutez).toEqual(504);
      expect(estimate.burnFeeMutez).toEqual(64250);
      expect(estimate.minimalFeeMutez).toEqual(404);
      expect(estimate.totalCost).toEqual(64654);
      expect(estimate.usingBaseFeeMutez).toEqual(404);
      expect(estimate.consumedMilligas).toEqual(1427000);
      done();
    });

    edonet('Estimate transfer with unallocated destination', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), amount: 1.7 });
      expect(estimate.gasLimit).toEqual(1527);
      expect(estimate.storageLimit).toEqual(257);
      expect(estimate.suggestedFeeMutez).toEqual(506);
      expect(estimate.burnFeeMutez).toEqual(64250);
      expect(estimate.minimalFeeMutez).toEqual(406);
      expect(estimate.totalCost).toEqual(64656);
      expect(estimate.usingBaseFeeMutez).toEqual(406);
      expect(estimate.consumedMilligas).toEqual(1427000);
      done();
    });

    florencenet('Estimate simple origination', async (done) => {
      const estimate = await LowAmountTez.estimate.originate({
        balance: "1",
        code: ligoSample,
        storage: 0,
      })
      expect(estimate.gasLimit).toEqual(2751);
      expect(estimate.storageLimit).toEqual(571);
      expect(estimate.suggestedFeeMutez).toEqual(919);
      expect(estimate.burnFeeMutez).toEqual(142750);
      expect(estimate.minimalFeeMutez).toEqual(819);
      expect(estimate.totalCost).toEqual(143569);
      expect(estimate.usingBaseFeeMutez).toEqual(819);
      expect(estimate.consumedMilligas).toEqual(2650621);
      done();
    });

    edonet('Estimate simple origination', async (done) => {
      const estimate = await LowAmountTez.estimate.originate({
        balance: "1",
        code: ligoSample,
        storage: 0,
      })
      expect(estimate.gasLimit).toEqual(2751);
      expect(estimate.storageLimit).toEqual(571);
      expect(estimate.suggestedFeeMutez).toEqual(921);
      expect(estimate.burnFeeMutez).toEqual(142750);
      expect(estimate.minimalFeeMutez).toEqual(821);
      expect(estimate.totalCost).toEqual(143571);
      expect(estimate.usingBaseFeeMutez).toEqual(821);
      expect(estimate.consumedMilligas).toEqual(2650621);
      done();
    });

    florencenet('Estimate setDelegate', async (done) => {
      const estimate = await LowAmountTez.estimate.setDelegate({
        delegate: knownBaker,
        source: await LowAmountTez.signer.publicKeyHash(),
      })
      expect(estimate.gasLimit).toEqual(1100);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(457);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(357);
      expect(estimate.totalCost).toEqual(357);
      expect(estimate.usingBaseFeeMutez).toEqual(357);
      expect(estimate.consumedMilligas).toEqual(1000000);
      done();
    })

    edonet('Estimate setDelegate', async (done) => {
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
      expect(estimate.consumedMilligas).toEqual(1000000);
      done();
    })

    florencenet('Estimate internal transfer to allocated implicit', async (done) => {
      const tx = contract.methods.do(MANAGER_LAMBDA.transferImplicit(knownBaker, 50)).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(4936);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(918);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(818);
      expect(estimate.totalCost).toEqual(818);
      expect(estimate.usingBaseFeeMutez).toEqual(818);
      expect(estimate.consumedMilligas).toEqual(4835751);
      done();
    })

    edonet('Estimate internal transfer to allocated implicit', async (done) => {
      const tx = contract.methods.do(MANAGER_LAMBDA.transferImplicit(knownBaker, 50)).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(4939);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(920);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(820);
      expect(estimate.totalCost).toEqual(820);
      expect(estimate.usingBaseFeeMutez).toEqual(820);
      expect(estimate.consumedMilligas).toEqual(4838226);
      done();
    })

    florencenet('Estimate to multiple internal transfer to unallocated account', async (done) => {
      const tx = contract.methods.do(transferImplicit2(
        await (await createAddress()).signer.publicKeyHash(),
        await (await createAddress()).signer.publicKeyHash(),
        50)
      ).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(6522);
      expect(estimate.storageLimit).toEqual(514);
      expect(estimate.suggestedFeeMutez).toEqual(1136);
      expect(estimate.burnFeeMutez).toEqual(128500);
      expect(estimate.minimalFeeMutez).toEqual(1036);
      expect(estimate.totalCost).toEqual(129536);
      expect(estimate.usingBaseFeeMutez).toEqual(1036);
      expect(estimate.consumedMilligas).toEqual(6421121);
      done();
    })

    edonet('Estimate to multiple internal transfer to unallocated account', async (done) => {
      const tx = contract.methods.do(transferImplicit2(
        await (await createAddress()).signer.publicKeyHash(),
        await (await createAddress()).signer.publicKeyHash(),
        50)
      ).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(6525);
      expect(estimate.storageLimit).toEqual(514);
      expect(estimate.suggestedFeeMutez).toEqual(1138);
      expect(estimate.burnFeeMutez).toEqual(128500);
      expect(estimate.minimalFeeMutez).toEqual(1038);
      expect(estimate.totalCost).toEqual(129538);
      expect(estimate.usingBaseFeeMutez).toEqual(1038);
      expect(estimate.consumedMilligas).toEqual(6424016);
      done();
    })

    florencenet('Estimate internal origination', async (done) => {
      const tx = contract.methods.do(originate()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(5489);
      expect(estimate.storageLimit).toEqual(317);
      expect(estimate.suggestedFeeMutez).toEqual(979);
      expect(estimate.burnFeeMutez).toEqual(79250);
      expect(estimate.minimalFeeMutez).toEqual(879);
      expect(estimate.totalCost).toEqual(80129);
      expect(estimate.usingBaseFeeMutez).toEqual(879);
      expect(estimate.consumedMilligas).toEqual(5388151);
      done();
    })

    edonet('Estimate internal origination', async (done) => {
      const tx = contract.methods.do(originate()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(5491);
      expect(estimate.storageLimit).toEqual(317);
      expect(estimate.suggestedFeeMutez).toEqual(982);
      expect(estimate.burnFeeMutez).toEqual(79250);
      expect(estimate.minimalFeeMutez).toEqual(882);
      expect(estimate.totalCost).toEqual(80132);
      expect(estimate.usingBaseFeeMutez).toEqual(882);
      expect(estimate.consumedMilligas).toEqual(5390686);
      done();
    })

    florencenet('Estimate multiple internal origination', async (done) => {
      const tx = contract.methods.do(originate2()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(7626);
      expect(estimate.storageLimit).toEqual(634);
      expect(estimate.suggestedFeeMutez).toEqual(1258);
      expect(estimate.burnFeeMutez).toEqual(158500);
      expect(estimate.minimalFeeMutez).toEqual(1158);
      expect(estimate.totalCost).toEqual(159658);
      expect(estimate.usingBaseFeeMutez).toEqual(1158);
      expect(estimate.consumedMilligas).toEqual(7525921);
      // Do the actual operation
      const op2 = await contract.methods.do(originate2()).send();
      await op2.confirmation();
      done();
    })

    edonet('Estimate multiple internal origination', async (done) => {
      const tx = contract.methods.do(originate2()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(7629);
      expect(estimate.storageLimit).toEqual(634);
      expect(estimate.suggestedFeeMutez).toEqual(1260);
      expect(estimate.burnFeeMutez).toEqual(158500);
      expect(estimate.minimalFeeMutez).toEqual(1160);
      expect(estimate.totalCost).toEqual(159660);
      expect(estimate.usingBaseFeeMutez).toEqual(1160);
      expect(estimate.consumedMilligas).toEqual(7528936);
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
      let estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) });
      expect(estimate.gasLimit).toEqual(1527);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(502);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(402);
      expect(estimate.totalCost).toEqual(402);
      expect(estimate.usingBaseFeeMutez).toEqual(402);
      expect(estimate.consumedMilligas).toEqual(1427000);
      done();
    });

    edonet('Estimate transfer to regular address', async (done) => {
      let estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) });
      expect(estimate.gasLimit).toEqual(1527);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(504);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(404);
      expect(estimate.totalCost).toEqual(404);
      expect(estimate.usingBaseFeeMutez).toEqual(404);
      expect(estimate.consumedMilligas).toEqual(1427000);
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

    it('Estimate transfer to regular address with insufficient balance', async (done) => {
      await expect(
        LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt })
      ).rejects.toEqual(
        expect.objectContaining({
          message: expect.stringContaining('balance_too_low'),
        }));
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
    })
  });
})

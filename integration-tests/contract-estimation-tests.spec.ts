import { DEFAULT_FEE, MANAGER_LAMBDA, TezosToolkit, Protocols, ChainIds } from "@taquito/taquito";
import { Contract } from "taquito/src/contract/contract";
import { CONFIGS } from "./config";
import { originate, originate2, transferImplicit2 } from "./data/lambda";
import { ligoSample } from "./data/ligo-simple-contract";
import { managerCode } from "./data/manager_code";

CONFIGS().forEach(({ lib, setup, knownBaker, createAddress, protocol,rpc }) => {
  const Tezos = lib;

  const florencenet = (protocol === Protocols.PsFLorena) ? test : test.skip;
  const granadanet = (protocol === Protocols.PtGRANADs) ? test : test.skip;
  const hangzhounet = (protocol === Protocols.PtHangz2) ? test : test.skip;

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
      catch (ex: any) {
        fail(ex.message)
      } finally {
        done()
      }
    })

    hangzhounet('Estimate transfer with allocated destination', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 1.9 });
      expect(estimate.gasLimit).toEqual(1520);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(505);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(405);
      expect(estimate.totalCost).toEqual(405);
      expect(estimate.usingBaseFeeMutez).toEqual(405);
      expect(estimate.consumedMilligas).toEqual(1420000);
      done();
    })

    granadanet('Estimate transfer with allocated destination', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 1.9 });
      expect(estimate.gasLimit).toEqual(1520);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(505);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(405);
      expect(estimate.totalCost).toEqual(405);
      expect(estimate.usingBaseFeeMutez).toEqual(405);
      expect(estimate.consumedMilligas).toEqual(1420000);
      done();
    })

    florencenet('Estimate transfer with allocated destination', async (done) => {
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

    hangzhounet('Estimate transfer with unallocated destination', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), amount: 1.7 });
      expect(estimate.gasLimit).toEqual(1520);
      expect(estimate.storageLimit).toEqual(257);
      expect(estimate.suggestedFeeMutez).toEqual(505);
      expect(estimate.burnFeeMutez).toEqual(64250);
      expect(estimate.minimalFeeMutez).toEqual(405);
      expect(estimate.totalCost).toEqual(64655);
      expect(estimate.usingBaseFeeMutez).toEqual(405);
      expect(estimate.consumedMilligas).toEqual(1420000);
      done();
    });

    granadanet('Estimate transfer with unallocated destination', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), amount: 1.7 });
      expect(estimate.gasLimit).toEqual(1520);
      expect(estimate.storageLimit).toEqual(257);
      expect(estimate.suggestedFeeMutez).toEqual(505);
      expect(estimate.burnFeeMutez).toEqual(64250);
      expect(estimate.minimalFeeMutez).toEqual(405);
      expect(estimate.totalCost).toEqual(64655);
      expect(estimate.usingBaseFeeMutez).toEqual(405);
      expect(estimate.consumedMilligas).toEqual(1420000);
      done();
    });

    florencenet('Estimate transfer with unallocated destination', async (done) => {
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

    hangzhounet('Estimate simple origination', async (done) => {
      const estimate = await LowAmountTez.estimate.originate({
        balance: "1",
        code: ligoSample,
        storage: 0,
      })
      expect(estimate.gasLimit).toEqual(1539);
      expect(estimate.storageLimit).toEqual(571);
      expect(estimate.suggestedFeeMutez).toEqual(799);
      expect(estimate.burnFeeMutez).toEqual(142750);
      expect(estimate.minimalFeeMutez).toEqual(699);
      expect(estimate.totalCost).toEqual(143449);
      expect(estimate.usingBaseFeeMutez).toEqual(699);
      expect(estimate.consumedMilligas).toEqual(1438103);
      done();
    });

    granadanet('Estimate simple origination', async (done) => {
      const estimate = await LowAmountTez.estimate.originate({
        balance: "1",
        code: ligoSample,
        storage: 0,
      })
      expect(estimate.gasLimit).toEqual(1526);
      expect(estimate.storageLimit).toEqual(571);
      expect(estimate.suggestedFeeMutez).toEqual(798);
      expect(estimate.burnFeeMutez).toEqual(142750);
      expect(estimate.minimalFeeMutez).toEqual(698);
      expect(estimate.totalCost).toEqual(143448);
      expect(estimate.usingBaseFeeMutez).toEqual(698);
      expect(estimate.consumedMilligas).toEqual(1425461);
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
      expect(estimate.suggestedFeeMutez).toEqual(921);
      expect(estimate.burnFeeMutez).toEqual(142750);
      expect(estimate.minimalFeeMutez).toEqual(821);
      expect(estimate.totalCost).toEqual(143571);
      expect(estimate.usingBaseFeeMutez).toEqual(821);
      expect(estimate.consumedMilligas).toEqual(2650621);
      done();
    });

    hangzhounet('Estimate setDelegate', async (done) => {
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

    granadanet('Estimate setDelegate', async (done) => {
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

    florencenet('Estimate setDelegate', async (done) => {
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

    hangzhounet('Estimate internal transfer to allocated implicit', async (done) => {
      const tx = contract.methods.do(MANAGER_LAMBDA.transferImplicit(knownBaker, 50)).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(3613);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(788);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(688);
      expect(estimate.totalCost).toEqual(688);
      expect(estimate.usingBaseFeeMutez).toEqual(688);
      expect(estimate.consumedMilligas).toEqual(3512283);
      done();
    })

    granadanet('Estimate internal transfer to allocated implicit', async (done) => {
      const tx = contract.methods.do(MANAGER_LAMBDA.transferImplicit(knownBaker, 50)).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(3807);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(807);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(707);
      expect(estimate.totalCost).toEqual(707);
      expect(estimate.usingBaseFeeMutez).toEqual(707);
      expect(estimate.consumedMilligas).toEqual(3706427);
      done();
    })

    florencenet('Estimate internal transfer to allocated implicit', async (done) => {
      const tx = contract.methods.do(MANAGER_LAMBDA.transferImplicit(knownBaker, 50)).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(4936);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(920);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(820);
      expect(estimate.totalCost).toEqual(820);
      expect(estimate.usingBaseFeeMutez).toEqual(820);
      expect(estimate.consumedMilligas).toEqual(4835751);
      done();
    })

    hangzhounet('Estimate to multiple internal transfer to unallocated account', async (done) => {
      const tx = contract.methods.do(transferImplicit2(
        await (await createAddress()).signer.publicKeyHash(),
        await (await createAddress()).signer.publicKeyHash(),
        50)
      ).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(5040);
      expect(estimate.storageLimit).toEqual(514);
      expect(estimate.suggestedFeeMutez).toEqual(989);
      expect(estimate.burnFeeMutez).toEqual(128500);
      expect(estimate.minimalFeeMutez).toEqual(889);
      expect(estimate.totalCost).toEqual(129389);
      expect(estimate.usingBaseFeeMutez).toEqual(889);
      expect(estimate.consumedMilligas).toEqual(4939404);
      done();
    })

    granadanet('Estimate to multiple internal transfer to unallocated account', async (done) => {
      const tx = contract.methods.do(transferImplicit2(
        await (await createAddress()).signer.publicKeyHash(),
        await (await createAddress()).signer.publicKeyHash(),
        50)
      ).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(5234);
      expect(estimate.storageLimit).toEqual(514);
      expect(estimate.suggestedFeeMutez).toEqual(1009);
      expect(estimate.burnFeeMutez).toEqual(128500);
      expect(estimate.minimalFeeMutez).toEqual(909);
      expect(estimate.totalCost).toEqual(129409);
      expect(estimate.usingBaseFeeMutez).toEqual(909);
      expect(estimate.consumedMilligas).toEqual(5133188);
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
      expect(estimate.suggestedFeeMutez).toEqual(1138);
      expect(estimate.burnFeeMutez).toEqual(128500);
      expect(estimate.minimalFeeMutez).toEqual(1038);
      expect(estimate.totalCost).toEqual(129538);
      expect(estimate.usingBaseFeeMutez).toEqual(1038);
      expect(estimate.consumedMilligas).toEqual(6421121);
      done();
    })

    hangzhounet('Estimate internal origination', async (done) => {
      const tx = contract.methods.do(originate()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(3606);
      expect(estimate.storageLimit).toEqual(317);
      expect(estimate.suggestedFeeMutez).toEqual(793);
      expect(estimate.burnFeeMutez).toEqual(79250);
      expect(estimate.minimalFeeMutez).toEqual(693);
      expect(estimate.totalCost).toEqual(79943);
      expect(estimate.usingBaseFeeMutez).toEqual(693);
      expect(estimate.consumedMilligas).toEqual(3505760);
      done();
    })

    granadanet('Estimate internal origination', async (done) => {
      const tx = contract.methods.do(originate()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(3794);
      expect(estimate.storageLimit).toEqual(317);
      expect(estimate.suggestedFeeMutez).toEqual(812);
      expect(estimate.burnFeeMutez).toEqual(79250);
      expect(estimate.minimalFeeMutez).toEqual(712);
      expect(estimate.totalCost).toEqual(79962);
      expect(estimate.usingBaseFeeMutez).toEqual(712);
      expect(estimate.consumedMilligas).toEqual(3693562);
      done();
    })

    florencenet('Estimate internal origination', async (done) => {
      const tx = contract.methods.do(originate()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(5489);
      expect(estimate.storageLimit).toEqual(317);
      expect(estimate.suggestedFeeMutez).toEqual(981);
      expect(estimate.burnFeeMutez).toEqual(79250);
      expect(estimate.minimalFeeMutez).toEqual(881);
      expect(estimate.totalCost).toEqual(80131);
      expect(estimate.usingBaseFeeMutez).toEqual(881);
      expect(estimate.consumedMilligas).toEqual(5388151);
      done();
    })

    hangzhounet('Estimate multiple internal origination', async (done) => {
      const tx = contract.methods.do(originate2()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(5027);
      expect(estimate.storageLimit).toEqual(634);
      expect(estimate.suggestedFeeMutez).toEqual(1000);
      expect(estimate.burnFeeMutez).toEqual(158500);
      expect(estimate.minimalFeeMutez).toEqual(900);
      expect(estimate.totalCost).toEqual(159400);
      expect(estimate.usingBaseFeeMutez).toEqual(900);
      expect(estimate.consumedMilligas).toEqual(4926358);
      // Do the actual operation
      const op2 = await contract.methods.do(originate2()).send();
      await op2.confirmation();
      done();
    })

    granadanet('Estimate multiple internal origination', async (done) => {
      const tx = contract.methods.do(originate2()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(5208);
      expect(estimate.storageLimit).toEqual(634);
      expect(estimate.suggestedFeeMutez).toEqual(1018);
      expect(estimate.burnFeeMutez).toEqual(158500);
      expect(estimate.minimalFeeMutez).toEqual(918);
      expect(estimate.totalCost).toEqual(159418);
      expect(estimate.usingBaseFeeMutez).toEqual(918);
      expect(estimate.consumedMilligas).toEqual(5107458);
      // Do the actual operation
      const op2 = await contract.methods.do(originate2()).send();
      await op2.confirmation();
      done();
    })

    florencenet('Estimate multiple internal origination', async (done) => {
      const tx = contract.methods.do(originate2()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(7626);
      expect(estimate.storageLimit).toEqual(634);
      expect(estimate.suggestedFeeMutez).toEqual(1260);
      expect(estimate.burnFeeMutez).toEqual(158500);
      expect(estimate.minimalFeeMutez).toEqual(1160);
      expect(estimate.totalCost).toEqual(159660);
      expect(estimate.usingBaseFeeMutez).toEqual(1160);
      expect(estimate.consumedMilligas).toEqual(7525921);
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

    hangzhounet('Estimate transfer to regular address', async (done) => {
      let estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) });
      expect(estimate.gasLimit).toEqual(1520);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(503);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(403);
      expect(estimate.totalCost).toEqual(403);
      expect(estimate.usingBaseFeeMutez).toEqual(403);
      expect(estimate.consumedMilligas).toEqual(1420000);
      done();
    });

    granadanet('Estimate transfer to regular address', async (done) => {
      let estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) });
      expect(estimate.gasLimit).toEqual(1520);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(503);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(403);
      expect(estimate.totalCost).toEqual(403);
      expect(estimate.usingBaseFeeMutez).toEqual(403);
      expect(estimate.consumedMilligas).toEqual(1420000);
      done();
    });

    florencenet('Estimate transfer to regular address', async (done) => {
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

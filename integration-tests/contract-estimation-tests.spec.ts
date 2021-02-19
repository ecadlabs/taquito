import { DEFAULT_FEE, MANAGER_LAMBDA, TezosToolkit, Protocols } from "@taquito/taquito";
import { Contract } from "taquito/src/contract/contract";
import { CONFIGS } from "./config";
import { originate, originate2, transferImplicit2 } from "./data/lambda";
import { ligoSample } from "./data/ligo-simple-contract";
import { managerCode } from "./data/manager_code";

CONFIGS().forEach(({ lib, setup, knownBaker, createAddress, protocol }) => {
  const Tezos = lib;

  const carthagenet = (protocol === Protocols.PsCARTHA) ? test : test.skip;
  const delphinet = (protocol === Protocols.PsDELPH1) ? test : test.skip;
  const edonet = (protocol === Protocols.PtEdo2Zk) ? test : test.skip;

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

    delphinet('Estimate transfer with allocated destination', async (done) => {
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

    carthagenet('Estimate transfer with allocated destination', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 1.9 });
      expect(estimate.gasLimit).toEqual(10307);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(1386);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(1286);
      expect(estimate.totalCost).toEqual(1286);
      expect(estimate.usingBaseFeeMutez).toEqual(1286);
      expect(estimate.consumedMilligas).toEqual(10207000);
      done();
    })

    edonet('Estimate transfer with allocated destination', async (done) => {
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

    delphinet('Estimate transfer with unallocated destination', async (done) => {
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

    carthagenet('Estimate transfer with unallocated destination', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), amount: 1.7 });
      expect(estimate.gasLimit).toEqual(10307);
      expect(estimate.storageLimit).toEqual(257);
      expect(estimate.suggestedFeeMutez).toEqual(1386);
      expect(estimate.burnFeeMutez).toEqual(257000);
      expect(estimate.minimalFeeMutez).toEqual(1286);
      expect(estimate.totalCost).toEqual(258286);
      expect(estimate.usingBaseFeeMutez).toEqual(1286);
      expect(estimate.consumedMilligas).toEqual(10207000);
      done();
    });

    edonet('Estimate transfer with unallocated destination', async (done) => {
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

    delphinet('Estimate simple origination', async (done) => {
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
      expect(estimate.consumedMilligas).toEqual(2674701);
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
      expect(estimate.suggestedFeeMutez).toEqual(919);
      expect(estimate.burnFeeMutez).toEqual(142750);
      expect(estimate.minimalFeeMutez).toEqual(819);
      expect(estimate.totalCost).toEqual(143569);
      expect(estimate.usingBaseFeeMutez).toEqual(819);
      expect(estimate.consumedMilligas).toEqual(2650621);
      done();
    });

    carthagenet('Estimate simple origination', async (done) => {
      const estimate = await LowAmountTez.estimate.originate({
        balance: "1",
        code: ligoSample,
        storage: 0,
      })
      expect(estimate.gasLimit).toEqual(17932);
      expect(estimate.storageLimit).toEqual(571);
      expect(estimate.suggestedFeeMutez).toEqual(2441);
      expect(estimate.burnFeeMutez).toEqual(571000);
      expect(estimate.minimalFeeMutez).toEqual(2341);
      expect(estimate.totalCost).toEqual(573341);
      expect(estimate.usingBaseFeeMutez).toEqual(2341);
      expect(estimate.consumedMilligas).toEqual(17832000);
      done();
    });

    delphinet('Estimate setDelegate', async (done) => {
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

    edonet('Estimate setDelegate', async (done) => {
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

    carthagenet('Estimate setDelegate', async (done) => {
      const estimate = await LowAmountTez.estimate.setDelegate({
        delegate: knownBaker,
        source: await LowAmountTez.signer.publicKeyHash(),
      })
      expect(estimate.gasLimit).toEqual(10100);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(1361);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(1261);
      expect(estimate.totalCost).toEqual(1261);
      expect(estimate.usingBaseFeeMutez).toEqual(1261);
      expect(estimate.consumedMilligas).toEqual(10000000);
      done();
    })

    delphinet('Estimate internal transfer to allocated implicit', async (done) => {
      const tx = contract.methods.do(MANAGER_LAMBDA.transferImplicit(knownBaker, 50)).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(4963);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(923);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(823);
      expect(estimate.totalCost).toEqual(823);
      expect(estimate.usingBaseFeeMutez).toEqual(823);
      expect(estimate.consumedMilligas).toEqual(4862546);
      done();
    })

    edonet('Estimate internal transfer to allocated implicit', async (done) => {
      const tx = contract.methods.do(MANAGER_LAMBDA.transferImplicit(knownBaker, 50)).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(4939);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(918);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(818);
      expect(estimate.totalCost).toEqual(818);
      expect(estimate.usingBaseFeeMutez).toEqual(818);
      expect(estimate.consumedMilligas).toEqual(4838226);
      done();
    })

    carthagenet('Estimate internal transfer to allocated implicit', async (done) => {
      const tx = contract.methods.do(MANAGER_LAMBDA.transferImplicit(knownBaker, 50)).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(26260);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(3054);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(2954);
      expect(estimate.totalCost).toEqual(2954);
      expect(estimate.usingBaseFeeMutez).toEqual(2954);
      expect(estimate.consumedMilligas).toEqual(26160000);
      done();
    })

    delphinet('Estimate to multiple internal transfer to unallocated account', async (done) => {
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
      expect(estimate.consumedMilligas).toEqual(6448336);
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
      expect(estimate.suggestedFeeMutez).toEqual(1136);
      expect(estimate.burnFeeMutez).toEqual(128500);
      expect(estimate.minimalFeeMutez).toEqual(1036);
      expect(estimate.totalCost).toEqual(129536);
      expect(estimate.usingBaseFeeMutez).toEqual(1036);
      expect(estimate.consumedMilligas).toEqual(6424016);
      done();
    })

    carthagenet('Estimate to multiple internal transfer to unallocated account', async (done) => {
      const tx = contract.methods.do(transferImplicit2(
        await (await createAddress()).signer.publicKeyHash(),
        await (await createAddress()).signer.publicKeyHash(),
        50)
      ).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(36875);
      expect(estimate.storageLimit).toEqual(514);
      expect(estimate.suggestedFeeMutez).toEqual(4175);
      expect(estimate.burnFeeMutez).toEqual(514000);
      expect(estimate.minimalFeeMutez).toEqual(4075);
      expect(estimate.totalCost).toEqual(518075);
      expect(estimate.usingBaseFeeMutez).toEqual(4075);
      expect(estimate.consumedMilligas).toEqual(36775000);
      done();
    })

    delphinet('Estimate internal origination', async (done) => {
      const tx = contract.methods.do(originate()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(5568);
      expect(estimate.storageLimit).toEqual(317);
      expect(estimate.suggestedFeeMutez).toEqual(989);
      expect(estimate.burnFeeMutez).toEqual(79250);
      expect(estimate.minimalFeeMutez).toEqual(889);
      expect(estimate.totalCost).toEqual(80139);
      expect(estimate.usingBaseFeeMutez).toEqual(889);
      expect(estimate.consumedMilligas).toEqual(5467006);
      done();
    })

    edonet('Estimate internal origination', async (done) => {
      const tx = contract.methods.do(originate()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(5491);
      expect(estimate.storageLimit).toEqual(317);
      expect(estimate.suggestedFeeMutez).toEqual(980);
      expect(estimate.burnFeeMutez).toEqual(79250);
      expect(estimate.minimalFeeMutez).toEqual(880);
      expect(estimate.totalCost).toEqual(80130);
      expect(estimate.usingBaseFeeMutez).toEqual(880);
      expect(estimate.consumedMilligas).toEqual(5390686);
      done();
    })

    carthagenet('Estimate internal origination', async (done) => {
      const tx = contract.methods.do(originate()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(28286);
      expect(estimate.storageLimit).toEqual(317);
      expect(estimate.suggestedFeeMutez).toEqual(3263);
      expect(estimate.burnFeeMutez).toEqual(317000);
      expect(estimate.minimalFeeMutez).toEqual(3163);
      expect(estimate.totalCost).toEqual(320163);
      expect(estimate.usingBaseFeeMutez).toEqual(3163);
      expect(estimate.consumedMilligas).toEqual(28186000);
      done();
    })

    delphinet('Estimate multiple internal origination', async (done) => {
      const tx = contract.methods.do(originate2()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(7758);
      expect(estimate.storageLimit).toEqual(634);
      expect(estimate.suggestedFeeMutez).toEqual(1273);
      expect(estimate.burnFeeMutez).toEqual(158500);
      expect(estimate.minimalFeeMutez).toEqual(1173);
      expect(estimate.totalCost).toEqual(159673);
      expect(estimate.usingBaseFeeMutez).toEqual(1173);
      expect(estimate.consumedMilligas).toEqual(7657256);
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
      expect(estimate.suggestedFeeMutez).toEqual(1258);
      expect(estimate.burnFeeMutez).toEqual(158500);
      expect(estimate.minimalFeeMutez).toEqual(1158);
      expect(estimate.totalCost).toEqual(159658);
      expect(estimate.usingBaseFeeMutez).toEqual(1158);
      expect(estimate.consumedMilligas).toEqual(7528936);
      // Do the actual operation
      const op2 = await contract.methods.do(originate2()).send();
      await op2.confirmation();
      done();
    })

    carthagenet('Estimate multiple internal origination', async (done) => {
      const tx = contract.methods.do(originate2()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(40928);
      expect(estimate.storageLimit).toEqual(634);
      expect(estimate.suggestedFeeMutez).toEqual(4592);
      expect(estimate.burnFeeMutez).toEqual(634000);
      expect(estimate.minimalFeeMutez).toEqual(4492);
      expect(estimate.totalCost).toEqual(638492);
      expect(estimate.usingBaseFeeMutez).toEqual(4492);
      expect(estimate.consumedMilligas).toEqual(40828000);
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

    delphinet('Estimate transfer to regular address', async (done) => {
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

    carthagenet('Estimate transfer to regular address', async (done) => {
      let estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) });
      expect(estimate.gasLimit).toEqual(10307);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(1384);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(1284);
      expect(estimate.totalCost).toEqual(1284);
      expect(estimate.usingBaseFeeMutez).toEqual(1284);
      expect(estimate.consumedMilligas).toEqual(10207000);
      done();
    });

    edonet('Estimate transfer to regular address', async (done) => {
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
})

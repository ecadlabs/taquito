import { DEFAULT_FEE, MANAGER_LAMBDA, TezosToolkit, Protocols, ChainIds } from "@taquito/taquito";
import { Contract } from "taquito/src/contract/contract";
import { CONFIGS } from "./config";
import { originate, originate2, transferImplicit2 } from "./data/lambda";
import { ligoSample } from "./data/ligo-simple-contract";
import { managerCode } from "./data/manager_code";

CONFIGS().forEach(({ lib, setup, knownBaker, createAddress, protocol, rpc }) => {
  const Tezos = lib;
  const jakartanet = (protocol === Protocols.PtJakart2) ? test : test.skip;
  const ithacanet = (protocol === Protocols.Psithaca2) ? test : test.skip;

  describe(`Test estimate scenarios through contract api using: ${rpc}`, () => {
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

<<<<<<< HEAD
    hangzhounet('Verify .estimate.transfer with allocated destination result on hangzhounet', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 1.9 });
      expect(estimate.gasLimit).toEqual(1520);
=======
    jakartanet('Estimate transfer with allocated destination', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 0.019 });
      expect(estimate.gasLimit).toEqual(1551);
>>>>>>> master
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(509);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(409);
      expect(estimate.totalCost).toEqual(409);
      expect(estimate.usingBaseFeeMutez).toEqual(409);
      expect(estimate.consumedMilligas).toEqual(1450040);
      done();
    })

<<<<<<< HEAD
    granadanet('Verify .estimate.transfer with allocated destination result on granadanet', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 1.9 });
      expect(estimate.gasLimit).toEqual(1520);
=======
    ithacanet('Estimate transfer with allocated destination', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 0.019 });
      expect(estimate.gasLimit).toEqual(1521);
>>>>>>> master
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(508);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(408);
      expect(estimate.totalCost).toEqual(408);
      expect(estimate.usingBaseFeeMutez).toEqual(408);
      expect(estimate.consumedMilligas).toEqual(1420040);
      done();
    })

<<<<<<< HEAD
    florencenet('Verify .estimate.transfer with allocated destination result on florencenet', async (done) => {
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

    hangzhounet('Verify .estimate.transfer with unallocated destination result for hangzhounet', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), amount: 1.7 });
      expect(estimate.gasLimit).toEqual(1520);
=======
    jakartanet('Estimate transfer with unallocated destination', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), amount: 0.017 });
      expect(estimate.gasLimit).toEqual(1551);
>>>>>>> master
      expect(estimate.storageLimit).toEqual(257);
      expect(estimate.suggestedFeeMutez).toEqual(509);
      expect(estimate.burnFeeMutez).toEqual(64250);
      expect(estimate.minimalFeeMutez).toEqual(409);
      expect(estimate.totalCost).toEqual(64659);
      expect(estimate.usingBaseFeeMutez).toEqual(409);
      expect(estimate.consumedMilligas).toEqual(1450040);
      done();
    });

<<<<<<< HEAD
    granadanet('Verify .estimate.transfer with unallocated destination result for granadanet', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), amount: 1.7 });
      expect(estimate.gasLimit).toEqual(1520);
=======
    ithacanet('Estimate transfer with unallocated destination', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), amount: 0.017 });
      expect(estimate.gasLimit).toEqual(1521);
>>>>>>> master
      expect(estimate.storageLimit).toEqual(257);
      expect(estimate.suggestedFeeMutez).toEqual(508);
      expect(estimate.burnFeeMutez).toEqual(64250);
      expect(estimate.minimalFeeMutez).toEqual(408);
      expect(estimate.totalCost).toEqual(64658);
      expect(estimate.usingBaseFeeMutez).toEqual(408);
      expect(estimate.consumedMilligas).toEqual(1420040);
      done();
    });

<<<<<<< HEAD
    florencenet('Verify .estimate.transfer with unallocated destination result for florencenet', async (done) => {
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

    hangzhounet('Verify .estimate.originate simple contract result for hangzhounet', async (done) => {
=======
    jakartanet('Estimate simple origination', async (done) => {
>>>>>>> master
      const estimate = await LowAmountTez.estimate.originate({
        balance: "1",
        code: ligoSample,
        storage: 0,
      })
      expect(estimate.gasLimit).toEqual(1570);
      expect(estimate.storageLimit).toEqual(571);
      expect(estimate.suggestedFeeMutez).toEqual(802);
      expect(estimate.burnFeeMutez).toEqual(142750);
      expect(estimate.minimalFeeMutez).toEqual(702);
      expect(estimate.totalCost).toEqual(143452);
      expect(estimate.usingBaseFeeMutez).toEqual(702);
      expect(estimate.consumedMilligas).toEqual(1469767);
      done();
    });

<<<<<<< HEAD
    granadanet('Verify .estimate.originate simple contract result for granadanet', async (done) => {
=======
    ithacanet('Estimate simple origination', async (done) => {
>>>>>>> master
      const estimate = await LowAmountTez.estimate.originate({
        balance: "1",
        code: ligoSample,
        storage: 0,
      })
      expect(estimate.gasLimit).toEqual(1545);
      expect(estimate.storageLimit).toEqual(571);
      expect(estimate.suggestedFeeMutez).toEqual(802);
      expect(estimate.burnFeeMutez).toEqual(142750);
      expect(estimate.minimalFeeMutez).toEqual(702);
      expect(estimate.totalCost).toEqual(143452);
      expect(estimate.usingBaseFeeMutez).toEqual(702);
      expect(estimate.consumedMilligas).toEqual(1444223);
      done();
    });

<<<<<<< HEAD
    florencenet('Verify .estimate.originate simple contract result for florencenet', async (done) => {
      const estimate = await LowAmountTez.estimate.originate({
        balance: "1",
        code: ligoSample,
        storage: 0,
=======
    jakartanet('Estimate setDelegate', async (done) => {
      const estimate = await LowAmountTez.estimate.setDelegate({
        delegate: knownBaker,
        source: await LowAmountTez.signer.publicKeyHash(),
>>>>>>> master
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

<<<<<<< HEAD
    hangzhounet('Verify .estimate.setDelegate result for hangzhounet', async (done) => {
=======
    ithacanet('Estimate setDelegate', async (done) => {
>>>>>>> master
      const estimate = await LowAmountTez.estimate.setDelegate({
        delegate: knownBaker,
        source: await LowAmountTez.signer.publicKeyHash(),
      })
      expect(estimate.gasLimit).toEqual(1100);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(461);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(361);
      expect(estimate.totalCost).toEqual(361);
      expect(estimate.usingBaseFeeMutez).toEqual(361);
      expect(estimate.consumedMilligas).toEqual(1000000);
      done();
    })

<<<<<<< HEAD
    granadanet('Verify .estimate.setDelegate result for hangzhounet granadanet', async (done) => {
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

    florencenet('Verify .estimate.setDelegate result for hangzhounet florencenet', async (done) => {
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

    hangzhounet('Verify .estimate.transfer for internal transfer to allocated implicit for hangzhounet', async (done) => {
      const tx = contract.methods.do(MANAGER_LAMBDA.transferImplicit(knownBaker, 50)).toTransferParams();
=======
    jakartanet('Estimate internal transfer to allocated implicit', async (done) => {
      const tx = contract.methods.do(MANAGER_LAMBDA.transferImplicit(knownBaker, 5)).toTransferParams();
>>>>>>> master
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(3702);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(797);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(697);
      expect(estimate.totalCost).toEqual(697);
      expect(estimate.usingBaseFeeMutez).toEqual(697);
      expect(estimate.consumedMilligas).toEqual(3601019);
      done();
    })

    ithacanet('Estimate internal transfer to allocated implicit', async (done) => {
      const tx = contract.methods.do(MANAGER_LAMBDA.transferImplicit(knownBaker, 5)).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(3614);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(790);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(690);
      expect(estimate.totalCost).toEqual(690);
      expect(estimate.usingBaseFeeMutez).toEqual(690);
      expect(estimate.consumedMilligas).toEqual(3513987);
      done();
    })

<<<<<<< HEAD
    granadanet('Verify .estimate.transfer for internal transfer to allocated implicit for granadanet', async (done) => {
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

    florencenet('Verify .estimate.transfer for internal transfer to allocated implicit for florencenet', async (done) => {
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

    hangzhounet('Verify .estimate.transfer for multiple internal transfers to unallocated account for hangzhounet', async (done) => {
=======
    jakartanet('Estimate to multiple internal transfer to unallocated account', async (done) => {
>>>>>>> master
      const tx = contract.methods.do(transferImplicit2(
        await (await createAddress()).signer.publicKeyHash(),
        await (await createAddress()).signer.publicKeyHash(),
        50)
      ).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(5160);
      expect(estimate.storageLimit).toEqual(514);
      expect(estimate.suggestedFeeMutez).toEqual(1001);
      expect(estimate.burnFeeMutez).toEqual(128500);
      expect(estimate.minimalFeeMutez).toEqual(901);
      expect(estimate.totalCost).toEqual(129401);
      expect(estimate.usingBaseFeeMutez).toEqual(901);
      expect(estimate.consumedMilligas).toEqual(5059195);
      done();
    })

<<<<<<< HEAD
    granadanet('Verify .estimate.transfer for multiple internal transfers to unallocated account for granadanet', async (done) => {
=======
    ithacanet('Estimate to multiple internal transfer to unallocated account', async (done) => {
>>>>>>> master
      const tx = contract.methods.do(transferImplicit2(
        await (await createAddress()).signer.publicKeyHash(),
        await (await createAddress()).signer.publicKeyHash(),
        50)
      ).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(5043);
      expect(estimate.storageLimit).toEqual(514);
      expect(estimate.suggestedFeeMutez).toEqual(992);
      expect(estimate.burnFeeMutez).toEqual(128500);
      expect(estimate.minimalFeeMutez).toEqual(892);
      expect(estimate.totalCost).toEqual(129392);
      expect(estimate.usingBaseFeeMutez).toEqual(892);
      expect(estimate.consumedMilligas).toEqual(4942488);
      done();
    })

<<<<<<< HEAD
    florencenet('Verify .estimate.transfer for multiple internal transfers to unallocated account for florencenet', async (done) => {
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

    hangzhounet('Verify .estimate.transfer for internal origination for hangzhounet', async (done) => {
=======
    jakartanet('Estimate internal origination', async (done) => {
>>>>>>> master
      const tx = contract.methods.do(originate()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(3659);
      expect(estimate.storageLimit).toEqual(317);
      expect(estimate.suggestedFeeMutez).toEqual(798);
      expect(estimate.burnFeeMutez).toEqual(79250);
      expect(estimate.minimalFeeMutez).toEqual(698);
      expect(estimate.totalCost).toEqual(79948);
      expect(estimate.usingBaseFeeMutez).toEqual(698);
      expect(estimate.consumedMilligas).toEqual(3558788);
      done();
    })

    ithacanet('Estimate internal origination', async (done) => {
      const tx = contract.methods.do(originate()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(3608);
      expect(estimate.storageLimit).toEqual(317);
      expect(estimate.suggestedFeeMutez).toEqual(795);
      expect(estimate.burnFeeMutez).toEqual(79250);
      expect(estimate.minimalFeeMutez).toEqual(695);
      expect(estimate.totalCost).toEqual(79945);
      expect(estimate.usingBaseFeeMutez).toEqual(695);
      expect(estimate.consumedMilligas).toEqual(3507384);
      done();
    })

<<<<<<< HEAD
    granadanet('Verify .estimate.transfer for internal origination for granadanet', async (done) => {
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

    florencenet('Verify .estimate.transfer for internal origination for florencenet', async (done) => {
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

    hangzhounet('Verify .estimate.transfer for multiple internal originations for hangzhounet', async (done) => {
=======
    jakartanet('Estimate multiple internal origination', async (done) => {
>>>>>>> master
      const tx = contract.methods.do(originate2()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(5075);
      expect(estimate.storageLimit).toEqual(634);
      expect(estimate.suggestedFeeMutez).toEqual(1005);
      expect(estimate.burnFeeMutez).toEqual(158500);
      expect(estimate.minimalFeeMutez).toEqual(905);
      expect(estimate.totalCost).toEqual(159405);
      expect(estimate.usingBaseFeeMutez).toEqual(905);
      expect(estimate.consumedMilligas).toEqual(4974733);
      // Do the actual operation
      const op2 = await contract.methods.do(originate2()).send();
      await op2.confirmation();
      done();
    })

    ithacanet('Estimate multiple internal origination', async (done) => {
      const tx = contract.methods.do(originate2()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(5030);
      expect(estimate.storageLimit).toEqual(634);
      expect(estimate.suggestedFeeMutez).toEqual(1002);
      expect(estimate.burnFeeMutez).toEqual(158500);
      expect(estimate.minimalFeeMutez).toEqual(902);
      expect(estimate.totalCost).toEqual(159402);
      expect(estimate.usingBaseFeeMutez).toEqual(902);
<<<<<<< HEAD
      expect(estimate.consumedMilligas).toEqual(4926472);
      // Do the actual operation
      const op2 = await contract.methods.do(originate2()).send();
      await op2.confirmation();
      done();
    })

    granadanet('Verify .estimate.transfer for multiple internal originations for granadanet', async (done) => {
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

    florencenet('Verify .estimate.transfer for multiple internal originations for florencenet', async (done) => {
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
=======
      expect(estimate.consumedMilligas).toEqual(4929282);
>>>>>>> master
      // Do the actual operation
      const op2 = await contract.methods.do(originate2()).send();
      await op2.confirmation();
      done();
    })
  })

  describe(`Test estimate scenarios with very low balance using: ${rpc}`, () => {
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

<<<<<<< HEAD
    hangzhounet('Verify .estimate.transfer to regular address for hangzhounet', async (done) => {
=======
    jakartanet('Estimate transfer to regular address', async (done) => {
>>>>>>> master
      let estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) });
      expect(estimate.gasLimit).toEqual(1551);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(507);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(407);
      expect(estimate.totalCost).toEqual(407);
      expect(estimate.usingBaseFeeMutez).toEqual(407);
      expect(estimate.consumedMilligas).toEqual(1450040);
      done();
    });

<<<<<<< HEAD
    granadanet('Verify .estimate.transfer to regular address for granadanet', async (done) => {
=======
    ithacanet('Estimate transfer to regular address', async (done) => {
>>>>>>> master
      let estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) });
      expect(estimate.gasLimit).toEqual(1521);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(506);
      expect(estimate.burnFeeMutez).toEqual(0);
<<<<<<< HEAD
      expect(estimate.minimalFeeMutez).toEqual(403);
      expect(estimate.totalCost).toEqual(403);
      expect(estimate.usingBaseFeeMutez).toEqual(403);
      expect(estimate.consumedMilligas).toEqual(1420000);
      done();
    });

    florencenet('Verify .estimate.transfer to regular address for florencenet', async (done) => {
      let estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) });
      expect(estimate.gasLimit).toEqual(1527);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(504);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(404);
      expect(estimate.totalCost).toEqual(404);
      expect(estimate.usingBaseFeeMutez).toEqual(404);
      expect(estimate.consumedMilligas).toEqual(1427000);
=======
      expect(estimate.minimalFeeMutez).toEqual(406);
      expect(estimate.totalCost).toEqual(406);
      expect(estimate.usingBaseFeeMutez).toEqual(406);
      expect(estimate.consumedMilligas).toEqual(1420040);
>>>>>>> master
      done();
    });

    it('Verify .estimate.transfer to regular address with a fixed fee', async (done) => {
      // fee, gasLimit and storage limit are not taken into account
      const params = { fee: 2000, to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) }

      await expect(LowAmountTez.estimate.transfer(params)).rejects.toEqual(
        expect.objectContaining({
          message: expect.stringContaining('balance_too_low'),
        }));

      done();
    });

    it('Verify .estimate.transfer to regular address with insufficient balance', async (done) => {
      await expect(
        LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt })
      ).rejects.toEqual(
        expect.objectContaining({
          message: expect.stringContaining('balance_too_low'),
        }));
      done();
    });

    it('Verify .estimate.transfer to regular address with insufficient balance to pay storage for allocation', async (done) => {
      await expect(
        LowAmountTez.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) })
      ).rejects.toEqual(
        expect.objectContaining({
          message: expect.stringContaining('storage_exhausted'),
        }));
      done();
    });

    it('Verify .estimate.transfer for origination with influence balance to pay storage', async (done) => {
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

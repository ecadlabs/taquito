import { DEFAULT_FEE, MANAGER_LAMBDA, TezosToolkit, Protocols  } from "@taquito/taquito";
import { Contract } from "taquito/src/contract/contract";
import { CONFIGS } from "./config";
import { originate, originate2, transferImplicit2 } from "./data/lambda";
import { ligoSample } from "./data/ligo-simple-contract";
import { managerCode } from "./data/manager_code";

CONFIGS().forEach(({ lib, setup, knownBaker, createAddress, protocol, rpc }) => {
  const Tezos = lib;
  const jakartanet = (protocol === Protocols.PtJakart2) ? test : test.skip;
  const mondaynet = (protocol === Protocols.ProtoALpha) ? test : test.skip;
  const kathmandunet = (protocol === Protocols.PtKathman) ? test : test.skip;

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

    jakartanet('Estimate transfer with allocated destination', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 0.019 });
      expect(estimate.gasLimit).toEqual(1551);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(509);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(409);
      expect(estimate.totalCost).toEqual(409);
      expect(estimate.usingBaseFeeMutez).toEqual(409);
      expect(estimate.consumedMilligas).toEqual(1450040);
      done();
    })

    kathmandunet('Estimate transfer with allocated destination', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 0.019 });
      expect(estimate.gasLimit).toEqual(1101);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(462);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(362);
      expect(estimate.totalCost).toEqual(362);
      expect(estimate.usingBaseFeeMutez).toEqual(362);
      expect(estimate.consumedMilligas).toEqual(1000040);
      done();
    })

    mondaynet('Estimate transfer with allocated destination', async (done) => {
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
    })

    jakartanet('Estimate transfer with unallocated destination', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), amount: 0.017 });
      expect(estimate.gasLimit).toEqual(1551);
      expect(estimate.storageLimit).toEqual(257);
      expect(estimate.suggestedFeeMutez).toEqual(509);
      expect(estimate.burnFeeMutez).toEqual(64250);
      expect(estimate.minimalFeeMutez).toEqual(409);
      expect(estimate.totalCost).toEqual(64659);
      expect(estimate.usingBaseFeeMutez).toEqual(409);
      expect(estimate.consumedMilligas).toEqual(1450040);
      done();
    });

    kathmandunet('Estimate transfer with unallocated destination', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), amount: 0.017 });
      expect(estimate.gasLimit).toEqual(1101);
      expect(estimate.storageLimit).toEqual(257);
      expect(estimate.suggestedFeeMutez).toEqual(462);
      expect(estimate.burnFeeMutez).toEqual(64250);
      expect(estimate.minimalFeeMutez).toEqual(362);
      expect(estimate.totalCost).toEqual(64612);
      expect(estimate.usingBaseFeeMutez).toEqual(362);
      expect(estimate.consumedMilligas).toEqual(1000040);
      done();
    });

    mondaynet('Estimate transfer with unallocated destination', async (done) => {
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

    jakartanet('Estimate simple origination', async (done) => {
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

    kathmandunet('Estimate simple origination', async (done) => {
      const estimate = await LowAmountTez.estimate.originate({
        balance: "1",
        code: ligoSample,
        storage: 0,
      })
      expect(estimate.gasLimit).toEqual(1569);
      expect(estimate.storageLimit).toEqual(571);
      expect(estimate.suggestedFeeMutez).toEqual(800);
      expect(estimate.burnFeeMutez).toEqual(142750);
      expect(estimate.minimalFeeMutez).toEqual(700);
      expect(estimate.totalCost).toEqual(143450);
      expect(estimate.usingBaseFeeMutez).toEqual(700);
      expect(estimate.consumedMilligas).toEqual(1468957);
      done();
    });

    mondaynet('Estimate simple origination', async (done) => {
      const estimate = await LowAmountTez.estimate.originate({
        balance: "1",
        code: ligoSample,
        storage: 0,
      })
      expect(estimate.gasLimit).toEqual(1569);
      expect(estimate.storageLimit).toEqual(571);
      expect(estimate.suggestedFeeMutez).toEqual(802);
      expect(estimate.burnFeeMutez).toEqual(142750);
      expect(estimate.minimalFeeMutez).toEqual(702);
      expect(estimate.totalCost).toEqual(143452);
      expect(estimate.usingBaseFeeMutez).toEqual(702);
      expect(estimate.consumedMilligas).toEqual(1468957);
      done();
    });

    jakartanet('Estimate setDelegate', async (done) => {
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

    kathmandunet('Estimate setDelegate', async (done) => {
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

    mondaynet('Estimate setDelegate', async (done) => {
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

    jakartanet('Estimate internal transfer to allocated implicit', async (done) => {
      const tx = contract.methods.do(MANAGER_LAMBDA.transferImplicit(knownBaker, 5)).toTransferParams();
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

    kathmandunet('Estimate internal transfer to allocated implicit', async (done) => {
      const tx = contract.methods.do(MANAGER_LAMBDA.transferImplicit(knownBaker, 5)).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(3250);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(749);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(649);
      expect(estimate.totalCost).toEqual(649);
      expect(estimate.usingBaseFeeMutez).toEqual(649);
      expect(estimate.consumedMilligas).toEqual(3149370);
      done();
    })

    jakartanet('Estimate to multiple internal transfer to unallocated account', async (done) => {
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

    kathmandunet('Estimate to multiple internal transfer to unallocated account', async (done) => {
      const tx = contract.methods.do(transferImplicit2(
        await (await createAddress()).signer.publicKeyHash(),
        await (await createAddress()).signer.publicKeyHash(),
        50)
      ).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(4258);
      expect(estimate.storageLimit).toEqual(514);
      expect(estimate.suggestedFeeMutez).toEqual(909);
      expect(estimate.burnFeeMutez).toEqual(128500);
      expect(estimate.minimalFeeMutez).toEqual(809);
      expect(estimate.totalCost).toEqual(129309);
      expect(estimate.usingBaseFeeMutez).toEqual(809);
      expect(estimate.consumedMilligas).toEqual(4157546);
      done();
    })

    jakartanet('Estimate internal origination', async (done) => {
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

    kathmandunet('Estimate internal origination', async (done) => {
      const tx = contract.methods.do(originate()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(3658);
      expect(estimate.storageLimit).toEqual(317);
      expect(estimate.suggestedFeeMutez).toEqual(796);
      expect(estimate.burnFeeMutez).toEqual(79250);
      expect(estimate.minimalFeeMutez).toEqual(696);
      expect(estimate.totalCost).toEqual(79946);
      expect(estimate.usingBaseFeeMutez).toEqual(696);
      expect(estimate.consumedMilligas).toEqual(3557159);
      done();
    })

    jakartanet('Estimate multiple internal origination', async (done) => {
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

    kathmandunet('Estimate multiple internal origination', async (done) => {
      const tx = contract.methods.do(originate2()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate.gasLimit).toEqual(5074);
      expect(estimate.storageLimit).toEqual(634);
      expect(estimate.suggestedFeeMutez).toEqual(1003);
      expect(estimate.burnFeeMutez).toEqual(158500);
      expect(estimate.minimalFeeMutez).toEqual(903);
      expect(estimate.totalCost).toEqual(159403);
      expect(estimate.usingBaseFeeMutez).toEqual(903);
      expect(estimate.consumedMilligas).toEqual(4973124);
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

    jakartanet('Estimate transfer to regular address', async (done) => {
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

    jakartanet('Estimate transfer to regular address with a fixed fee', async (done) => {

        const params = { fee: 2000, to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) }
        await expect(LowAmountTez.estimate.transfer(params)).rejects.toEqual(
          expect.objectContaining({
            message: expect.stringContaining('balance_too_low'),
          }));
        done();
      }
    );

    jakartanet('Estimate transfer to regular address with insufficient balance', async (done) => {
      await expect(
        LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt })
      ).rejects.toEqual(
        expect.objectContaining({
          message: expect.stringContaining('balance_too_low'),
        }));
      done();
    });

    kathmandunet('Estimate transfer to regular address', async (done) => {
      let estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) });
      expect(estimate.gasLimit).toEqual(1101);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(460);
      expect(estimate.burnFeeMutez).toEqual(0);
      expect(estimate.minimalFeeMutez).toEqual(360);
      expect(estimate.totalCost).toEqual(360);
      expect(estimate.usingBaseFeeMutez).toEqual(360);
      expect(estimate.consumedMilligas).toEqual(1000040);
      done();
    });

    /** Explanation of the change from J to K in the test 'Estimate transfer to regular address with a fixed fee' **
     * 
     *  The initial balance of the account is 2374 mutez. We do a batch made of a reveal and a transaction.
     *  In this test we set a fee for the transaction. The reveal required a fee of 374.
     * 
     *  The critical values for the transaction fee in this context are 2000, 1999, and 2001.
     *  Each results in a different error.
     * 
     *  In J all three values evoked the 'balance_too_low' error. In K only 2001 gets 'balance_too_low'. 
     */

     kathmandunet('Estimate transfer to regular address with a fixed fee of 2000 gets empty_implicit_contract', async (done) => {
      /** In K, they first validate if the account has enough balance to cover the fees of all op in the batch. 
      *   The total fees of 2000+374 is equal to the balance of the account which is enough but will drain the account.
      *   The reveal fails with empty_implicit error because the balance is 0 
      *   The transaction is skipped because of the precedent operation (reveal has failed)
      */
      const params = { fee: 2000, to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) }
        await expect(LowAmountTez.estimate.transfer(params)).rejects.toEqual(
          expect.objectContaining({
            message: expect.stringContaining('implicit.empty_implicit_contract'),
          }));
        done();
      });

    kathmandunet('Estimate transfer to regular address with a fixed fee of 1999 gets subtraction_underflow', async (done) => {
      /** If we set the fee to 1999:
      *    The account has enough balance to cover the total fees (1999+374=2373). there will be 1 mutez remaining in the account.
      *    The reveal op is valid.
      *    The transaction fails with balance_too_low, subtraction_underflow because we try to transfer 618 mutez will the remaining balance is only 1 mutez.
      *    The reveal is backtracked because the transaction failed.
      */
      const params = { fee: 1999, to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) }
        await expect(LowAmountTez.estimate.transfer(params)).rejects.toEqual(
          expect.objectContaining({
            message: expect.stringContaining('tez.subtraction_underflow'),
          }));
        done();
      });
  
      kathmandunet('Estimate transfer to regular address with a fixed fee of 2001 gets balance_too_low', async (done) => {
        /** If we set the fee to 2001:
         *   The account doesn't have enough balance to cover the total fees (2001+374=2375). 
         *   It fails with balance_too_low, subtraction_underflow
         */
        const params = { fee: 2001, to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) }
          await expect(LowAmountTez.estimate.transfer(params)).rejects.toEqual(
            expect.objectContaining({
              message: expect.stringContaining('balance_too_low'),
            }));
          done();
        });
  
      kathmandunet('Estimate transfer to regular address with insufficient balance', async (done) => {
        await expect(
          LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt })
         ).rejects.toMatchObject({
          errors: [
            {
              kind: 'temporary',
              id: 'proto.014-PtKathma.contract.balance_too_low',
            },
            {
              kind: 'temporary',
              id: 'proto.014-PtKathma.tez.subtraction_underflow',
            },
          ],
          name: 'TezosOperationError',
          id: 'proto.014-PtKathma.tez.subtraction_underflow',
          kind: 'temporary',
          message: '(temporary) proto.014-PtKathma.tez.subtraction_underflow',
        });
        done();
      });
  });
})

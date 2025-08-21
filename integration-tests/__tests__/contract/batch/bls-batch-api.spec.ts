import { ProtoGreaterOrEqual } from "@taquito/michel-codec";
import { CONFIGS } from "../../../config";
import { ligoSample, ligoSampleMichelson } from "../../../data/ligo-simple-contract";
import { managerCode } from "../../../data/manager_code";
import { MANAGER_LAMBDA, OpKind, Protocols } from "@taquito/taquito";
import { TezosToolkit } from '@taquito/taquito';
import { PrefixV2 } from '@taquito/utils';

CONFIGS().forEach(({ lib, rpc, setup, knownBaker, protocol, createAddress }) => {
  const Tezos = lib;
  let Bls: TezosToolkit
  const seoulnetAndAlpha = ProtoGreaterOrEqual(protocol, Protocols.PtSeouLou) ? test : test.skip;
  describe(`Test the Taquito batch api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup()
      try {
        Bls = await createAddress(PrefixV2.BLS12_381SecretKey)
        let transferOp = await Tezos.contract.transfer({ to: await Bls.signer.publicKeyHash(), amount: 5 })
        await transferOp.confirmation()
      } catch (e) {
        console.log('beforeAll transferOp error', e)
      }
    })

    seoulnetAndAlpha('Verify simple batch transfers with origination', async () => {
      const batch = await Bls.contract.batch()
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
        .withOrigination({
          balance: "1",
          code: ligoSample,
          storage: 0,
        })

      const op = await batch.send();
      await op.confirmation();
      expect(op.status).toEqual('applied')
    })

    seoulnetAndAlpha('Verify a batch of transfers and origination operations using a combination of the two notations (array of operation with kind mixed with withTransfer method)', async () => {
      /** Tests the usage of a mix of the 2 possible notations for batched operations
       *  See for details on the 2 notations:
       *  https://taquito.io/docs/batch_API#--the-array-of-transactions-method
       *  https://taquito.io/docs/batch_API#--the-withtransfer-method
       */
      const op = await Bls.contract.batch([
        {
          kind: OpKind.TRANSACTION,
          to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
          amount: 0.02
        },
        {
          kind: OpKind.ORIGINATION,
          balance: "1",
          code: ligoSample,
          storage: 0,
        }
      ])
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
        .send();
      await op.confirmation();
      expect(op.status).toEqual('applied')
    })

    seoulnetAndAlpha('Verify simple batch transfer with origination fails when storage_exhausted', async () => {
      expect.assertions(1);
      try {
        await Bls.contract.batch()
          .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
          .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
          .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
          .withOrigination({
            balance: "1",
            code: ligoSample,
            storage: 0,
            storageLimit: 0,
          })
          .send();
      } catch (ex) {
        expect(ex).toEqual(expect.objectContaining({
          message: expect.stringContaining('storage_exhausted.operation')
        }))
      }
    })

    seoulnetAndAlpha('Verify batch transfer and origination from an account with a low balance', async () => {
      const LocalTez = await createAddress(PrefixV2.BLS12_381SecretKey);
      const op = await Tezos.contract.transfer({ to: await LocalTez.signer.publicKeyHash(), amount: 2 });
      await op.confirmation();
      const batchOp = await LocalTez.contract.batch([
        {
          kind: OpKind.TRANSACTION,
          to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
          amount: 1,
          fee: 800
        },
        {
          kind: OpKind.ORIGINATION,
          balance: "0",
          code: ligoSample,
          storage: 0,
          fee: 700
        }
      ]).send()
      await batchOp.confirmation();
      expect(op.status).toEqual('applied')
    })

    // TODO: need to optimize for bls keys fee for originating managerCode smart contract
    seoulnetAndAlpha.skip('Verify batch transfer with chained contract calls', async () => {
      const op = await Bls.contract.originate({
        balance: "3",
        fee: 1100, // taquito estimate too low
        code: managerCode,
        init: { "string": await Tezos.signer.publicKeyHash() },
      })
      await op.confirmation();
      const contract = await op.contract();
      expect(op.status).toEqual('applied')
      const batch = Bls.contract.batch()
        .withTransfer({ to: contract.address, amount: 1 })
        .withContractCall(contract.methodsObject.do(MANAGER_LAMBDA.transferImplicit("tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh", 5)))
        .withContractCall(contract.methodsObject.do(MANAGER_LAMBDA.setDelegate(knownBaker)))
        .withContractCall(contract.methodsObject.do(MANAGER_LAMBDA.removeDelegate()))
      const batchOp = await batch.send();
      await batchOp.confirmation();
      expect(batchOp.status).toEqual('applied')


    });

    // TODO: need to optimize for bls keys fee for originating managerCode smart contract
    seoulnetAndAlpha.skip('Verify batch transfer with chained contract calls using the `methodsObject` method', async () => {
      const op = await Bls.contract.originate({
        balance: "1",
        fee: 1100, // taquito estimate too low
        code: managerCode,
        init: { "string": await Tezos.signer.publicKeyHash() },
      })
      await op.confirmation();
      const contract = await op.contract();
      expect(op.status).toEqual('applied')
      const batch = Bls.contract.batch()
        .withTransfer({ to: contract.address, amount: 1 })
        .withContractCall(contract.methodsObject.do(MANAGER_LAMBDA.transferImplicit("tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh", 5)))
        .withContractCall(contract.methodsObject.do(MANAGER_LAMBDA.setDelegate(knownBaker)))
        .withContractCall(contract.methodsObject.do(MANAGER_LAMBDA.removeDelegate()))
      const batchOp = await batch.send();
      await batchOp.confirmation();
      expect(batchOp.status).toEqual('applied')
    });

    seoulnetAndAlpha('Verify simple batch transfers with origination from code in Michelson format', async () => {
      const batch = Bls.contract.batch()
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
        .withOrigination({
          balance: "1",
          code: ligoSampleMichelson,
          storage: 0,
        })

      const op = await batch.send();
      await op.confirmation();
      expect(op.status).toEqual('applied')
    })
  });
})

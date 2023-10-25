import { CONFIGS } from './config';
import { OpKind } from '@taquito/taquito';
import { ligoSample } from './data/ligo-simple-contract';
import stringify from 'json-stringify-safe';

CONFIGS().forEach(({ lib, rpc, setup }) => {

  const Tezos = lib;
  let simpleContractAddress: string;
  describe(`Test Increase Paid Storage using: ${rpc}`, () => {
    beforeAll(async () => {
      await setup(true);

      try {
        const op = await Tezos.contract.originate({
          balance: "1",
          code: `parameter string;
          storage string;
          code {CAR;
                PUSH string "Hello ";
                CONCAT;
                NIL operation; PAIR};
          `,
          init: `"test"`
        });

        await op.confirmation();

        simpleContractAddress = op.contractAddress!;
        console.log(simpleContractAddress)
      } catch (e) {
        console.log(stringify(e));
      }
    });

    it(`should be able to increase the paid storage of a contract successfully: ${rpc}`, async () => {
      const paidSpaceBefore = await Tezos.rpc.getStoragePaidSpace(simpleContractAddress);

      const op = await Tezos.contract.increasePaidStorage({
        amount: 1,
        destination: simpleContractAddress
      });

      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.status).toEqual('applied');

      const paidSpaceAfter = await Tezos.rpc.getStoragePaidSpace(simpleContractAddress);

      expect(parseInt(paidSpaceAfter)).toEqual(parseInt(paidSpaceBefore) + 1);
    });

    it(`should be able to include increasePaidStorage operation in a batch: ${rpc}`, async () => {
      const paidSpaceBefore = await Tezos.rpc.getStoragePaidSpace(simpleContractAddress);

      const op = await Tezos.contract
        .batch()
        .withOrigination({
          balance: "1",
          code: `parameter string;
          storage string;
          code {CAR;
                PUSH string "Hello ";
                CONCAT;
                NIL operation; PAIR};
          `,
          init: `"test"`
        })
        .withIncreasePaidStorage({
          amount: 1,
          destination: simpleContractAddress
        })
        .send();
      await op.confirmation();
      expect(op.status).toEqual('applied');

      const paidSpaceAfter = await Tezos.rpc.getStoragePaidSpace(simpleContractAddress);

      expect(parseInt(paidSpaceAfter)).toEqual(parseInt(paidSpaceBefore) + 1);
    });

    it(`should be able to include increasePaidStorage operation in a batch (different batch syntax): ${rpc}`, async () => {
      const paidSpaceBefore = await Tezos.rpc.getStoragePaidSpace(simpleContractAddress);

      const op = await Tezos.contract.batch([
        {
          kind: OpKind.ORIGINATION,
          balance: '1',
          code: ligoSample,
          storage: 0
        },
        {
          kind: OpKind.INCREASE_PAID_STORAGE,
          amount: 1,
          destination: simpleContractAddress
        }
      ])
        .send();

      await op.confirmation();
      expect(op.status).toEqual('applied');

      const paidSpaceAfter = await Tezos.rpc.getStoragePaidSpace(simpleContractAddress);

      expect(parseInt(paidSpaceAfter)).toEqual(parseInt(paidSpaceBefore) + 1);
    });

    it('should return error when destination contract address is invalid', async () => {
      expect(async () => {
        const op = await Tezos.contract.increasePaidStorage({
          amount: 1,
          destination: 'invalid_address'
        });
      }).rejects.toThrow();
    });
  });
});

import { CONFIGS } from './config';
import { OpKind, Protocols } from '@taquito/taquito';
import { ligoSample } from './data/ligo-simple-contract';

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const kathmandunet = (protocol === Protocols.PtKathman) ? test : test.skip;
  const limanetAndAlpha = (protocol === Protocols.PtLimaPtL || protocol === Protocols.ProtoALpha) ? test : test.skip;
  
  const Tezos = lib;
  let simpleContractAddress: string;
  describe(`Test Increase Paid Storage using: ${rpc}`, () => {
    beforeAll(async (done) => {
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
      } catch(e) {
        console.log(JSON.stringify(e));
      }
      done();
    });

    kathmandunet(`should be able to increase the paid storage of a contract successfully: ${rpc}`, async (done) => {
      const op = await Tezos.contract.increasePaidStorage({
        amount: 1,
        destination: simpleContractAddress
      });

      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.status).toEqual('applied');
      done();
    });
    
    limanetAndAlpha(`should be able to increase the paid storage of a contract successfully: ${rpc}`, async (done) => {
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
      done();
    });
    
    kathmandunet(`should be able to include increasePaidStorage operation in a batch: ${rpc}`, async (done) => {
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
      done();
    });

    limanetAndAlpha(`should be able to include increasePaidStorage operation in a batch: ${rpc}`, async (done) => {
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
      done();
    });

    kathmandunet(`should be able to include increasePaidStorage operation in a batch (different batch syntax): ${rpc}`, async (done) => {
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
      done();
    });

    limanetAndAlpha(`should be able to include increasePaidStorage operation in a batch (different batch syntax): ${rpc}`, async (done) => {
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
      done();
    });

    it('should return error when destination contract address is invalid', async (done) => {
      expect(async () => {
        const op = await Tezos.contract.increasePaidStorage({
          amount: 1,
          destination: 'invalid_address'
        });
      }).rejects.toThrow();
      done();
    });
  });
});
import { CONFIGS } from './config';
import { OpKind, Protocols } from '@taquito/taquito';
import { ligoSample } from './data/ligo-simple-contract';

CONFIGS().forEach(({ lib, rpc, setup, protocol, knownContract }) => {
  const kathmandunetAndAlpha = (protocol === Protocols.PtKathman || protocol === Protocols.ProtoALpha) ? test : test.skip;
  const Tezos = lib;

  describe(`Test Increase Paid Storage using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup(true);
      done();
    });

    kathmandunetAndAlpha('should be able to increase the paid storage of a contract successfully', async (done) => {
      const op = await Tezos.contract.increasePaidStorage({
        amount: 1,
        destination: knownContract
      });

      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.status).toEqual('applied');
      done();
    });

    kathmandunetAndAlpha('should be able to include increasePaidStorage operation in a batch', async (done) => {
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
          destination: knownContract
        })
        .send();
      await op.confirmation();
      expect(op.status).toEqual('applied');
      done();
    });

    kathmandunetAndAlpha('should be able to include increasePaidStorage operation in a batch (different batch syntax)', async (done) => {
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
          destination: knownContract 
        } 
      ])
      .send();

      await op.confirmation();
      expect(op.status).toEqual('applied');
      done();
    });

    kathmandunetAndAlpha('should return error when destination contract address is invalid', async (done) => {
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
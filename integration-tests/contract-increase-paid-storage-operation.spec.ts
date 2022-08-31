import { CONFIGS } from './config';
import { Protocols } from '@taquito/taquito';

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const kathmandunet = (protocol === Protocols.PtKathman) ? it : it.skip;
  const Tezos = lib;

  describe(`Test Increase Paid Storage using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup(true);
      done();
    });

    kathmandunet('should be able to increase the paid storage of a contract successfully', async (done) => {
      const op = await Tezos.contract.increasePaidStorage({
        amount: 1,
        destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W'
      });

      await op.confirmation();

      expect(op.hash).toBeDefined();
      expect(op.status).toEqual('applied');
      done();
    });

    kathmandunet('should be able to include increasePaidStorage operation in a batch', async (done) => {
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
          destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W'
        })
        .send();
      await op.confirmation();
      expect(op.status).toEqual('applied');
      done();
    })

  });
})
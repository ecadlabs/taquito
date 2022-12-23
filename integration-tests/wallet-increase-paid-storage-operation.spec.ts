import { CONFIGS } from './config';
import { OpKind, Protocols } from '@taquito/taquito';
import { ligoSample } from './data/ligo-simple-contract';

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const limanetAndAlpha = (protocol === Protocols.PtLimaPtL || protocol === Protocols.ProtoALpha) ? test : test.skip;

  const Tezos = lib;
  let simpleContractAddress: string;
  describe(`Test Increase Paid Storage using: ${rpc}`, () => {
    beforeAll(async (done) => {
      await setup(true);

      try {
        const op = await Tezos.wallet.originate({
          balance: "1",
          code: `parameter string;
          storage string;
          code {CAR;
                PUSH string "Hello ";
                CONCAT;
                NIL operation; PAIR};
          `,
          init: `"test"`
        }).send();

        await op.confirmation();

        simpleContractAddress = (await op.contract()).address
      } catch(e) {
        console.log(JSON.stringify(e));
      }
      done();
    });
    limanetAndAlpha(`should be able to increase the paid storage of a contract successfully: ${rpc}`, async (done) => {
      const paidSpaceBefore = await Tezos.rpc.getStoragePaidSpace(simpleContractAddress);

      const op = await Tezos.wallet.increasePaidStorage({
        amount: 1,
        destination: simpleContractAddress
      }).send();

      await op.confirmation();
      expect(op.opHash).toBeDefined();
      expect(op.status).toBeTruthy();

      const paidSpaceAfter = await Tezos.rpc.getStoragePaidSpace(simpleContractAddress);

      expect(parseInt(paidSpaceAfter)).toEqual(parseInt(paidSpaceBefore) + 1);
      done();
    });
  });
});

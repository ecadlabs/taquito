import { CONFIGS, isSandbox } from "./config";

CONFIGS().forEach(({ lib, rpc, setup }) => {
    const Tezos = lib;
    describe(`Test staking through contract API using: ${rpc}`, () => {
      const flextesaNet = isSandbox({rpc}) ? test : test.skip;
      beforeEach(async (done) => {
          await setup(true)
          done()
        });
        flextesaNet('Should be able to stake', async (done) => {
          const op = await Tezos.contract.stake({
            amount: 0.1,
          });
          await op.confirmation()
          expect(op.hash).toBeDefined();
          done();
        });
        flextesaNet('Should be able to unstake', async (done) => {
          const op = await Tezos.contract.unstake({
            amount: 0.1,
          });
          await op.confirmation()
          expect(op.hash).toBeDefined();
          done();
        });
        flextesaNet('Should be able to finalizeUnstake', async (done) => {
          const op = await Tezos.contract.finalizeUnstake({});
          await op.confirmation()
          expect(op.hash).toBeDefined();
          done();
        });
    });
});

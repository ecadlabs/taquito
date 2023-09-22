import { Protocols } from "@taquito/taquito";
import { CONFIGS, isSandbox, sleep } from "./config";

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
    const Tezos = lib;
    describe(`Test staking through contract API using: ${rpc}`, () => {
      const flextesaOxford = isSandbox({rpc}) && protocol === Protocols.Proxford ? test : test.skip;
      beforeEach(async (done) => {
          await setup(true)
          done()
        });
        flextesaOxford('Should be able to stake', async (done) => {
          const op = await Tezos.contract.stake({
            amount: 100,
          });
          await op.confirmation()
          expect(op.hash).toBeDefined();
          
          const constants = await Tezos.rpc.getConstants();
          await sleep(((constants.preserved_cycles + 2) * constants.blocks_per_cycle * (constants.minimal_block_delay!.toNumber())) * 1000);
          
          done();
        });
        flextesaOxford('Should be able to unstake', async (done) => {
          const op = await Tezos.contract.unstake({
            amount: 100,
          });
          await op.confirmation()
          expect(op.hash).toBeDefined();

          const constants = await Tezos.rpc.getConstants();
          await sleep(((constants.preserved_cycles + 2) * constants.blocks_per_cycle * (constants.minimal_block_delay!.toNumber())) * 1000);

          done();
        });
        flextesaOxford('Should be able to finalizeUnstake', async (done) => {
          const op = await Tezos.contract.finalizeUnstake({});
          await op.confirmation()
          expect(op.hash).toBeDefined();
          done();
        });
    });
});

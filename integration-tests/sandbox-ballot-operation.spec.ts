import { CONFIGS, sleep } from './config';

CONFIGS().forEach(async ({ lib, protocol, setup }) => {
  const Tezos = lib;

  describe(`Ballot operation test (${protocol})`, () => {
    beforeAll(async () => {
      await setup();
    });

    it('Submit a proposal and inject ballot vote', async (done) => {
      const period = await Tezos.rpc.getCurrentPeriod();

      if (period.voting_period.kind === 'proposal') {
        const proposalsOp = await Tezos.contract.proposals({
          proposals: ['ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK']
        });
        await proposalsOp.confirmation();
      }

      let check_period;
      for (let i = 0; i < 4; i++) {
        check_period = await Tezos.rpc.getCurrentPeriod();
        await sleep(10000);
      }

      const confirm_period = await Tezos.rpc.getCurrentPeriod();
      expect(confirm_period.voting_period.kind).toBe('exploration');

      const op = await Tezos.contract.ballot({
        proposal: 'ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK',
        ballot: 'yay'
      });

      await op.confirmation();

      expect(op.operationResults).toBeDefined();
      expect(op.operationResults?.proposal).toEqual('ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK');
      expect(op.operationResults?.ballot).toEqual('yay');
      expect(op.includedInBlock).toBeDefined();
      expect(op.hash).toBeDefined();

      done();
    });
  });
});
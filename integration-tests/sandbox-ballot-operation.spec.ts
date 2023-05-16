import { CONFIGS, sleep } from './config';

CONFIGS().forEach(async ({ lib, protocol, setup }) => {
  const Funder = lib;

  describe(`Ballot operation test (${protocol})`, () => {
    beforeAll(async () => {
      await setup();
    });

    it('Submit a proposal and inject ballot vote', async (done) => {

      const delegatePkh = "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb"
      while (true) {
        await sleep(10000);
        const proposal_period = await Funder.rpc.getCurrentPeriod();
        if (proposal_period.voting_period.kind === 'proposal') {
          const proposalsOp = await Funder.contract.proposals({
            proposals: ['ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK']
          });
          await proposalsOp.confirmation();
          break;
        }
      }

      while (true) {
        await sleep(10000);
        const exploration_period = await Funder.rpc.getCurrentPeriod();
        if (exploration_period.voting_period.kind === 'exploration') {
          const op = await Funder.contract.ballot({
            proposal: 'ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK',
            ballot: 'yay'
          });

          await op.confirmation();

          expect(op.operationResults).toBeDefined();
          expect(op.operationResults?.proposal).toEqual('ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK');
          expect(op.operationResults?.ballot).toEqual('yay');
          expect(op.includedInBlock).toBeDefined();
          expect(op.hash).toBeDefined();
          break;
        }
      }

      done();
    });
  });
});
import { CONFIGS, sleep } from './config';

CONFIGS().forEach(async ({ lib, protocol, setup }) => {
  const Tezos = lib;

  describe(`Ballot operation test (${protocol})`, () => {
    beforeAll(async (done) => {
      await setup();

      try {
        const period = await Tezos.rpc.getCurrentPeriod();
        await sleep((period.remaining + 5)  * 1000);

        const proposalsOp = await Tezos.contract.proposals({
          proposals: ['ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK']
        });

        await proposalsOp.confirmation();
      } catch(e) {
        console.log(e);
      }
      done();
    });

    // TODO: Fix timing issues in regards to different block times in different sandboxes
    it.skip('Submit a proposal and inject ballot vote', async (done) => {
      const period = await Tezos.rpc.getCurrentPeriod();

      if (period.voting_period.kind === 'proposal') {
        await sleep((period.remaining + 5) * 1000);
      }
      
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
  })
})
import { CONFIGS, sleep } from './config';

CONFIGS().forEach(async ({ lib, protocol, setup, rpc }) => {
  const Tezos = lib;
  const flextesanet = (rpc === 'http://0.0.0.0:20000') ? it : it.skip;

  Tezos.setRpcProvider(rpc);

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

    flextesanet('Submit a proposal and inject ballot vote', async (done) => {
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
  
      done();
    });
  })
})
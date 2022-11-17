import { CONFIGS, sleep } from './config';


CONFIGS().forEach(async ({ lib, protocol, setup, rpc }) => {
  const Tezos = lib;
  const flextesanet = (rpc === 'http://0.0.0.0:20000') ? it : it.skip;
  
  Tezos.setRpcProvider(rpc);

  describe(`Ballot operation test (${protocol})`, () => {
    beforeAll(async (done) => {
      await setup();
      done();
    });

    flextesanet('Submit a proposal and inject ballot vote', async (done) => {
      
      const period = await Tezos.rpc.getCurrentPeriod();
      const sleepTime = period.remaining * 1000;
      await sleep(sleepTime);
      
      const proposalsOp = await Tezos.contract.proposals({
        proposals: ['ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK']
      });

      await proposalsOp.confirmation();

      expect(proposalsOp.operationResults).toBeDefined();
      expect(proposalsOp.operationResults?.proposals).toEqual(['ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK']);
      expect(proposalsOp.includedInBlock).toBeDefined();


      const proposal = await Tezos.rpc.getCurrentProposal();
      if (proposal !== 'ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK') {
        console.log('WRONG PROPOSAL');
      }

      const period2 = await Tezos.rpc.getCurrentPeriod();
      console.log(JSON.stringify(period2));


      if (period2.voting_period.kind === 'proposal') {
        await sleep(period2.remaining * 1000);
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
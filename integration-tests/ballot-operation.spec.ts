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
      await sleep(20000);

      const period = await Tezos.rpc.getCurrentPeriod();
      if (period.voting_period.kind !== 'exploration') {
        await sleep(5000);
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
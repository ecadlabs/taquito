import { CONFIGS, sleep } from './config';

CONFIGS().forEach(async ({ lib, rpc, setup }) => {
  const Funder = lib;
  const flextesanet = rpc === 'http://localhost:20000' ? test : test.skip;

  describe(`Ballot operation test ${rpc}`, () => {
    beforeAll(async (done) => {
      await setup();
      try {
        const proposal_period = await Funder.rpc.getCurrentPeriod();
        const constants = await Funder.rpc.getConstants();
        let proposalsOp

        switch (proposal_period.voting_period.kind) {
          case 'proposal':
            proposalsOp = await Funder.contract.proposals({
              proposals: ['ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK']
            });
            await proposalsOp.confirmation();
            await sleep(((proposal_period.remaining + 1) * constants.minimal_block_delay!.toNumber()) * 1000)
            break;
          case 'exploration':
            await sleep(((proposal_period.remaining + 1 + (constants.blocks_per_cycle * constants.cycles_per_voting_period! * 3)) * constants.minimal_block_delay!.toNumber()) * 1000)
            proposalsOp = await Funder.contract.proposals({
              proposals: ['ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK']
            });
            await proposalsOp.confirmation();
            break;
          case 'cooldown':
            await sleep(((proposal_period.remaining + 1 + (constants.blocks_per_commitment * constants.cycles_per_voting_period! * 2)) * constants.minimal_block_delay!.toNumber()) * 1000)
            proposalsOp = await Funder.contract.proposals({
              proposals: ['ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK']
            });
            await proposalsOp.confirmation();
            break;
          case 'promotion':
            await sleep(((proposal_period.remaining + 1 + (constants.blocks_per_commitment * constants.cycles_per_voting_period! * 1)) * constants.minimal_block_delay!.toNumber()) * 1000)
            proposalsOp = await Funder.contract.proposals({
              proposals: ['ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK']
            });
            await proposalsOp.confirmation();
            break;
          case 'adoption':
            await sleep(((proposal_period.remaining + 1 + (constants.blocks_per_commitment * constants.cycles_per_voting_period! * 0)) * constants.minimal_block_delay!.toNumber()) * 1000)
            proposalsOp = await Funder.contract.proposals({
              proposals: ['ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK']
            });
            await proposalsOp.confirmation();
            break;
        }

      } catch (e) {
        console.log(JSON.stringify(e));
      }
      done()
    });

    flextesanet('Inject ballot vote', async (done) => {
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
      }
      done();
    });
  });
});
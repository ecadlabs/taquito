
import { VotingPeriodBlockResult } from '@taquito/rpc';
import { CONFIGS, sleep } from './config';

CONFIGS().forEach(async ({ lib, rpc, protocol, setup }) => {
  const Funder = lib;
  const flextesanet = rpc === 'http://localhost:20000' ? test : test.skip;
  let blocksPerVotingPeriod: number
  let blockTime: number
  let currentPeriod: VotingPeriodBlockResult

  describe(`Test Proposal and Ballot operation in ${protocol.substring(0, 8)} with flextesa`, () => {
    beforeAll(async (done) => {
      await setup();
      let constants = await Funder.rpc.getConstants();
      blocksPerVotingPeriod = constants.blocks_per_cycle * constants.cycles_per_voting_period!
      blockTime = constants.minimal_block_delay!.toNumber()
      console.log(await Funder.signer.publicKeyHash())
      // checking what period it's in and sleep until next proposal period (sleep time calculation written explicitly for readability)
      currentPeriod = await Funder.rpc.getCurrentPeriod();
      switch (currentPeriod.voting_period.kind) {
        case 'proposal':
          break;
        case 'exploration':
          await sleep(((currentPeriod.remaining + (blocksPerVotingPeriod * 3) + 1) * constants.minimal_block_delay!.toNumber()) * 1000)
          console.log(await Funder.rpc.getConstants())
          break;
        case 'cooldown':
          await sleep(((currentPeriod.remaining + (blocksPerVotingPeriod * 2) + 1) * constants.minimal_block_delay!.toNumber()) * 1000)
          console.log(await Funder.rpc.getConstants())
          break;
        case 'promotion':
          await sleep(((currentPeriod.remaining + (blocksPerVotingPeriod * 1) + 1) * constants.minimal_block_delay!.toNumber()) * 1000)
          console.log(await Funder.rpc.getConstants())
          break;
        case 'adoption':
          await sleep(((currentPeriod.remaining + (blocksPerVotingPeriod * 0) + 1) * constants.minimal_block_delay!.toNumber()) * 1000)
          console.log(await Funder.rpc.getConstants())
          break;
      }
      done()
    });

    flextesanet('Should be able to inject proposal operation in proposal period', async (done) => {
      // double check if it's proposal period so that we can inject proposal operation
      currentPeriod = await Funder.rpc.getCurrentPeriod();
      if (currentPeriod.voting_period.kind === 'proposal') {

        const proposalsOp = await Funder.contract.proposals({
          proposals: ['ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK']
        });
        await proposalsOp.confirmation();
        console.log(await Funder.rpc.getCurrentPeriod())
        expect(proposalsOp.operationResults).toBeDefined();
        expect(proposalsOp.operationResults?.kind).toEqual('proposals');
        expect(proposalsOp.operationResults?.proposals).toEqual(['ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK']);
        expect(proposalsOp.includedInBlock).toBeDefined();
        expect(proposalsOp.hash).toBeDefined();
        done();
      }
    });

    flextesanet('Should be able to inject ballot operation in exploration period', async (done) => {
      // make the test sleep passed proposal period to get into exploration period to inject ballot operation
      currentPeriod = await Funder.rpc.getCurrentPeriod();
      if (currentPeriod.voting_period.kind === 'proposal') {
        console.log(await Funder.rpc.getCurrentPeriod())
        await sleep(((currentPeriod.remaining + 1) * blockTime) * 1000)
        console.log(await Funder.rpc.getCurrentPeriod())
      }
      currentPeriod = await Funder.rpc.getCurrentPeriod();
      if (currentPeriod.voting_period.kind === 'exploration') {
        console.log(await Funder.rpc.getCurrentPeriod())
        const explorationBallotOp = await Funder.contract.ballot({
          proposal: 'ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK',
          ballot: 'yay'
        });
        await explorationBallotOp.confirmation();
        console.log(await Funder.rpc.getCurrentPeriod())

        expect(explorationBallotOp.operationResults).toBeDefined();
        expect(explorationBallotOp.operationResults?.kind).toEqual('ballot');
        expect(explorationBallotOp.operationResults?.proposal).toEqual('ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK');
        expect(explorationBallotOp.operationResults?.ballot).toEqual('yay');
        expect(explorationBallotOp.includedInBlock).toBeDefined();
        expect(explorationBallotOp.hash).toBeDefined();
        done();
      }
    });
  });
});

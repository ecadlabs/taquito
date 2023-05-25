// limitation of this test is that it can only run once since it's a dummy protocol hash to test once it reaches the last block of adoption period it doesn't produce new block anymore
// two concerns, one is that it cann't be ran on the same chain more than once, second is that after this test the chain froze on the last block of adoption period which will affect other tests ran against flextesa in ci
import { ConstantsResponse, VotingPeriodBlockResult } from '@taquito/rpc';
import { CONFIGS, sleep } from './config';

CONFIGS().forEach(async ({ lib, rpc, protocol, setup }) => {
  const Funder = lib;
  const flextesanet = rpc === 'http://localhost:20000' ? test : test.skip;
  let blocksPerVotingPeriod: number
  let blockTime: number
  let currentPeriod: VotingPeriodBlockResult

  describe(`Test Proposal and Ballot operation in ${protocol.substring(0, 7)} with flextesa`, () => {
    beforeAll(async (done) => {
      await setup();
      let constants = await Funder.rpc.getConstants();
      blocksPerVotingPeriod = constants.blocks_per_cycle * constants.cycles_per_voting_period!
      blockTime = constants.minimal_block_delay!.toNumber()
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

        console.log('proposals', proposalsOp.operationResults)
        expect(proposalsOp.operationResults).toBeDefined();
        expect(proposalsOp.operationResults?.kind).toEqual('proposals');
        expect(proposalsOp.operationResults?.proposals).toEqual(['ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK']);
        expect(proposalsOp.includedInBlock).toBeDefined();
        expect(proposalsOp.hash).toBeDefined();
        done();
      }
    });

    flextesanet('Inject ballot vote in expoloration period', async (done) => {
      // make the test sleep passed proposal period to get into expoloration period to inject ballot operation
      currentPeriod = await Funder.rpc.getCurrentPeriod();
      if (currentPeriod.voting_period.kind === 'proposal') {
        await sleep(((currentPeriod.remaining + 1) * blockTime) * 1000)
      }
      currentPeriod = await Funder.rpc.getCurrentPeriod();
      if (currentPeriod.voting_period.kind === 'exploration') {
        const explorationBallotOp = await Funder.contract.ballot({
          proposal: 'ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK',
          ballot: 'yay'
        });
        await explorationBallotOp.confirmation();

        console.log('exploration', explorationBallotOp.operationResults)
        expect(explorationBallotOp.operationResults).toBeDefined();
        expect(explorationBallotOp.operationResults?.kind).toEqual('ballot');
        expect(explorationBallotOp.operationResults?.proposal).toEqual('ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK');
        expect(explorationBallotOp.operationResults?.ballot).toEqual('yay');
        expect(explorationBallotOp.includedInBlock).toBeDefined();
        expect(explorationBallotOp.hash).toBeDefined();
        done();
      }
    });

    flextesanet('Inject ballot vote in promotion period', async (done) => {
      // make the test sleep passed exploration and cooldown period to get into promotion period to inject ballot operation
      currentPeriod = await Funder.rpc.getCurrentPeriod();
      if (currentPeriod.voting_period.kind === 'exploration') {
        await sleep(((currentPeriod.remaining + 1 + blocksPerVotingPeriod) * blockTime) * 1000)
      }
      currentPeriod = await Funder.rpc.getCurrentPeriod();
      if (currentPeriod.voting_period.kind === 'promotion') {
        const promotionBallotOp = await Funder.contract.ballot({
          proposal: 'ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK',
          ballot: 'yay'
        });

        await promotionBallotOp.confirmation();

        console.log('promotion', promotionBallotOp.operationResults)
        expect(promotionBallotOp.operationResults).toBeDefined();
        expect(promotionBallotOp.operationResults?.kind).toEqual('ballot');
        expect(promotionBallotOp.operationResults?.proposal).toEqual('ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK');
        expect(promotionBallotOp.operationResults?.ballot).toEqual('yay');
        expect(promotionBallotOp.includedInBlock).toBeDefined();
        expect(promotionBallotOp.hash).toBeDefined();
        done();
      }
    });
  });
});

import { VotingPeriodBlockResult } from '@taquito/rpc';
import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from '@taquito/taquito';
import { CONFIGS, sleep } from './config';

CONFIGS().forEach(async ({ lib, rpc, protocol, setup }) => {
  const Alice = lib;
  const Bob = new TezosToolkit(rpc)
  Bob.setSignerProvider(new InMemorySigner('edsk3RFfvaFaxbHx8BMtEW1rKQcPtDML3LXjNqMNLCzC3wLC1bWbAt'))
  const Charlie = new TezosToolkit(rpc)
  Charlie.setSignerProvider(new InMemorySigner('edsk3RgWvbKKA1atEUcaGwivge7QtckHkTL9nQJUXQKY5r8WKp4pF4'))
  const flextesanet = rpc === 'http://localhost:20000' ? test : test.skip;
  let blocksPerVotingPeriod: number
  let blockTime: number
  let currentPeriod: VotingPeriodBlockResult

  describe(`Test Proposal and Ballot operation in ${protocol.substring(0, 8)} with flextesa`, () => {
    beforeAll(async (done) => {
      await setup();
      let constants = await Alice.rpc.getConstants();
      blocksPerVotingPeriod = constants.blocks_per_cycle * constants.cycles_per_voting_period!
      blockTime = constants.minimal_block_delay!.toNumber()

      // checking what period it's in and sleep until next proposal period (sleep time calculation written explicitly for readability)
      currentPeriod = await Alice.rpc.getCurrentPeriod();
      switch (currentPeriod.voting_period.kind) {
        case 'proposal':
          break;
        case 'exploration':
          await sleep(((currentPeriod.remaining + (blocksPerVotingPeriod * 3) + 1) * constants.minimal_block_delay!.toNumber()) * 1000)
          break;
        case 'cooldown':
          await sleep(((currentPeriod.remaining + (blocksPerVotingPeriod * 2) + 1) * constants.minimal_block_delay!.toNumber()) * 1000)
          break;
        case 'promotion':
          await sleep(((currentPeriod.remaining + (blocksPerVotingPeriod * 1) + 1) * constants.minimal_block_delay!.toNumber()) * 1000)
          break;
        case 'adoption':
          await sleep(((currentPeriod.remaining + (blocksPerVotingPeriod * 0) + 1) * constants.minimal_block_delay!.toNumber()) * 1000)
          break;
      }
      done()
    });

    flextesanet('Should be able to inject proposal operation in proposal period', async (done) => {
      // double check if it's proposal period so that we can inject proposal operation
      currentPeriod = await Alice.rpc.getCurrentPeriod();
      if (currentPeriod.voting_period.kind === 'proposal') {
        const proposalsOp = await Alice.contract.proposals({
          proposals: ['ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK']
        });
        await proposalsOp.confirmation();
        expect(proposalsOp.operationResults).toBeDefined();
        expect(proposalsOp.operationResults?.kind).toEqual('proposals');
        expect(proposalsOp.operationResults?.proposals).toEqual(['ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK']);
        expect(proposalsOp.includedInBlock).toBeDefined();
        expect(proposalsOp.hash).toBeDefined();
        const BobOp = await Bob.contract.proposals({
          proposals: ['ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK']
        });
        await BobOp.confirmation();
        const CharlieOp = await Charlie.contract.proposals({
          proposals: ['ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK']
        });
        await CharlieOp.confirmation();
        console.log(await Alice.rpc.getProposals())
        done();
      }
    });

    flextesanet('Should be able to inject ballot operation in exploration period', async (done) => {
      // make the test sleep passed proposal period to get into exploration period to inject ballot operation
      currentPeriod = await Alice.rpc.getCurrentPeriod();
      if (currentPeriod.voting_period.kind === 'proposal') {
        console.log(await Alice.rpc.getCurrentPeriod())
        console.log('before block level: ', (await Alice.rpc.getBlockHeader({ block: 'head' })).level)
        console.log('wait ', (currentPeriod.remaining + 1), 'blocks')
        await sleep(((currentPeriod.remaining + 1) * blockTime) * 1000)
        console.log('after block level: ', (await Alice.rpc.getBlockHeader({ block: 'head' })).level)
        console.log(await Alice.rpc.getCurrentPeriod())
      }
      currentPeriod = await Alice.rpc.getCurrentPeriod();
      if (currentPeriod.voting_period.kind === 'exploration') {
        console.log(await Alice.rpc.getCurrentPeriod())
        console.log('before block level: ', (await Alice.rpc.getBlockHeader({ block: 'head' })).level)
        const explorationBallotOp = await Alice.contract.ballot({
          proposal: 'ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK',
          ballot: 'yay'
        });
        await explorationBallotOp.confirmation();
        console.log('after block level: ', (await Alice.rpc.getBlockHeader({ block: 'head' })).level)
        console.log(await Alice.rpc.getCurrentPeriod())

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
